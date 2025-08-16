from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, delete
import tiktoken
import json
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from app.schemas import message
from app.models.models import Message, Chat
import app.agent.agent as agent
from app.agent.memory import MemorySession
from app.agent.prompts import user_prompt
from app.core.constants import (
    MAX_INPUT_TOKENS,
    MAX_OUTPUT_TOKENS,
    MAX_OLD_MESSAGES,
    MAX_HISTORY_TOKENS,
    MAX_USER_MESSAGE_TOKENS
)


encoding = tiktoken.get_encoding("cl100k_base")

async def create_message(message: message.MessageCreate, user_id: int, db: Session):
    chat = (
        db.query(Chat)
        .filter(Chat.id == message.chat_id, Chat.user_id == user_id)
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    
    user = chat.user

    now_utc = datetime.now(timezone.utc)
    if now_utc - user.last_token_reset >= timedelta(hours=24):
        user.input_tokens_remaining = MAX_INPUT_TOKENS
        user.output_tokens_remaining = MAX_OUTPUT_TOKENS
        user.last_token_reset = now_utc
        db.commit()

    if user.input_tokens_remaining <= 0 or user.output_tokens_remaining <= 0:
        raise HTTPException(
            status_code=400,
            detail=f"You have no remaining tokens for today."
        )

    user_message = message.content
    print(f"User message: {user_message}\n")
    user_message_tokens = encoding.encode(user_message)
    user_message_tokens_count = len(user_message_tokens)
    if user_message_tokens_count > MAX_USER_MESSAGE_TOKENS:
        raise HTTPException(
            status_code=400,
            detail=f"Your message is too long ({user_message_tokens_count} tokens). Limit is {MAX_USER_MESSAGE_TOKENS} tokens."
        )
    
    prompt = user_prompt.get_user_prompt(user, user_message)

    old_messages = await load_messages(message.chat_id, db)
    # print(f"old_messages has {len(old_messages)} messages.")

    old_messages_token_count = 0
    for old_message in old_messages:
        old_message_str = json.dumps(old_message, separators=(",", ":"))
        old_message_tokens = encoding.encode(old_message_str)
        old_messages_token_count += len(old_message_tokens)
    # print(f"old_messages has {old_messages_token_count} tokens.\n")

    agent_memory = MemorySession(session_id=user.id, user_id=user.id)
    await agent_memory.add_old_items(old_messages)

    result = await agent.generate_insight(prompt=prompt, agent_memory=agent_memory)

    final_output = result.final_output
    print(final_output)
    final_output_tokens = encoding.encode(final_output)
    final_output_tokens_count = len(final_output_tokens)
    # print(f"\nfinal_output has {final_output_tokens_count} tokens.")

    usage = result.context_wrapper.usage
    input_tokens_count = usage.input_tokens
    output_tokens_count = usage.output_tokens
    print(f"\nInput tokens used: {input_tokens_count}")
    print(f"Output tokens used: {output_tokens_count}")
    user.input_tokens_remaining -= input_tokens_count
    user.output_tokens_remaining -= output_tokens_count
    db.commit()
    total_tokens_remaining = min(user.input_tokens_remaining, user.output_tokens_remaining)
    print(f"\nYou have {total_tokens_remaining} tokens remaining.")

    # await agent.print_history(agent_memory)

    new_messages = await agent_memory.get_new_items()

    max_interaction_id = db.query(func.max(Message.interaction_id)).filter(Message.chat_id == message.chat_id).scalar()
    new_interaction_id = (max_interaction_id or 0) + 1

    saved_messages = []
    for msg in new_messages:
        new_msg = Message(
            chat_id=message.chat_id,
            interaction_id=new_interaction_id,
            message=msg,
            role=msg.get("role", "assistant"),
            type=msg.get("type")
        )
        db.add(new_msg)
        saved_messages.append(new_msg)
    db.commit()
    
    for m in saved_messages:
        db.refresh(m)

    return saved_messages

def get_messages(user_id: int, db: Session):
    messages = (
        db.query(Message)
        .join(Chat, Message.chat_id == Chat.id)
        .filter(Chat.user_id == user_id)
        .all()
    )
    return messages

def get_message(id: int, user_id: int, db: Session):
    message = (
        db.query(Message)
        .join(Chat, Message.chat_id == Chat.id)
        .filter(Message.id == id, Chat.user_id == user_id)
        .first()
    )
    return message

# def update_message(id: int, message: message.MessageCreate, user_id: int, db: Session):
#     message_query = db.query(Message).filter(Message.id == id)
#     message_query.update(message.model_dump(), synchronize_session=False)
#     db.commit()
#     updated_message = message_query.first()
#     return updated_message

def delete_message_group(interaction_id: int, user_id: int, db: Session):
    db.execute(
        delete(Message)
        .where(
            Message.interaction_id == interaction_id,
            Message.chat_id.in_(
                db.query(Chat.id).filter(Chat.user_id == user_id)
            )
        )
    )
    db.commit()

# ----------------------------------------------------------------------------

async def load_messages(chat_id: int, db: Session, limit: int = MAX_OLD_MESSAGES):
    # Get interaction groups for this chat, ordered newest first by interaction_id
    interaction_groups = (
        db.query(Message.interaction_id)
        .filter(Message.chat_id == chat_id)
        .group_by(Message.interaction_id)
        .order_by(Message.interaction_id.desc())
        .all()
    )

    # Get list of unique interaction_ids
    interaction_ids = [group_id[0] for group_id in interaction_groups]

    selected_interactions = []
    total_messages = 0
    token_count = 0

    # Add interactions from newest to oldest until limit is reached or exceeded
    for interaction_id in interaction_ids:
        result = db.query(
            func.count(Message.id).label("count"),
            func.array_agg(Message.message).label("messages")
        ).filter(
            Message.chat_id == chat_id,
            Message.interaction_id == interaction_id
        ).first()

        count = result.count
        messages = result.messages

        for message in messages:
            message_str = json.dumps(message, separators=(",", ":"))
            message_tokens = encoding.encode(message_str)
            token_count += len(message_tokens)

        # Stop before breaking interaction group
        if total_messages + count > limit or token_count > MAX_HISTORY_TOKENS:
            break

        selected_interactions.append(interaction_id)
        total_messages += count

    # No messages found or first group exceeds limit
    if not selected_interactions:
        messages = []
        
    # Load messages belonging to selected interaction groups, ordered oldest first
    else:
        selected_interactions.reverse()

        messages = (
            db.query(Message)
            .filter(
                Message.chat_id == chat_id,
                Message.interaction_id.in_(selected_interactions)
            )
            .order_by(Message.id)
            .all()
        )

    items = [m.message for m in messages]

    return items
