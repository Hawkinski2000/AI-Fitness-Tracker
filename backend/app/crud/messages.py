from sqlalchemy.orm import Session
from sqlalchemy import func
import tiktoken
import json
from fastapi import HTTPException
from app.schemas import message
from app.models.models import Message
import app.crud as crud
import app.agent.agent as agent
from app.agent.memory import MemorySession
from app.agent.prompts import user_prompt


MAX_USER_MESSAGE_TOKENS = 50
INPUT_TOKENS_REMAINING = 20000
OUTPUT_TOKENS_REMAINING = 2500

async def create_message(message: message.MessageCreate, db: Session):
    global INPUT_TOKENS_REMAINING
    global OUTPUT_TOKENS_REMAINING

    if INPUT_TOKENS_REMAINING <= 0 or OUTPUT_TOKENS_REMAINING <= 0:
        raise HTTPException(
            status_code=400,
            detail=f"You have no remaining tokens for today."
        )

    user_message = message.content
    print(f"User message: {user_message}\n")
    encoding = tiktoken.get_encoding("cl100k_base")
    user_message_tokens = encoding.encode(user_message)
    user_message_tokens_count = len(user_message_tokens)
    print(f"Your message has {user_message_tokens_count} tokens.")
    if user_message_tokens_count > MAX_USER_MESSAGE_TOKENS:
        raise HTTPException(
            status_code=400,
            detail=f"Your message is too long ({user_message_tokens_count} tokens). Limit is {MAX_USER_MESSAGE_TOKENS} tokens."
        )
    INPUT_TOKENS_REMAINING -= user_message_tokens_count
    print(f"You have {INPUT_TOKENS_REMAINING} input tokens remaining.")

    agent_memory = MemorySession(session_id="user_id")
    old_messages = await load_messages(message.chat_id, db)
    print(f"old_messages has {len(old_messages)} messages.")

    old_messages_token_count = 0
    for old_message in old_messages:
        old_message_str = json.dumps(old_message, separators=(",", ":"))
        old_message_tokens = encoding.encode(old_message_str)
        old_messages_token_count += len(old_message_tokens)
    print(f"old_messages has {old_messages_token_count} tokens.")
    INPUT_TOKENS_REMAINING -= old_messages_token_count
    print(f"You have {INPUT_TOKENS_REMAINING} input tokens remaining.")

    await agent_memory.add_old_items(old_messages)

    user = crud.users.get_user(2, db)
    prompt = user_prompt.get_user_prompt(user, user_message)

    final_output = await agent.generate_insight(agent_memory=agent_memory, prompt=prompt)
    print(final_output)
    final_output_tokens = encoding.encode(final_output)
    final_output_tokens_count = len(final_output_tokens)
    print(f"final_output has {len(final_output_tokens)} tokens.")
    OUTPUT_TOKENS_REMAINING -= final_output_tokens_count
    print(f"You have {OUTPUT_TOKENS_REMAINING} output tokens remaining.")

    new_messages = await agent_memory.get_new_items()

    new_messages_token_count = 0
    for new_message in new_messages:
        new_message_str = json.dumps(new_message, separators=(",", ":"))
        new_message_tokens = encoding.encode(new_message_str)
        new_messages_token_count += len(new_message_tokens)
    print(f"new_messages has {new_messages_token_count} tokens.")

    # await agent.print_history(agent_memory)

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

def get_messages(db: Session):
    messages = db.query(Message).all()
    return messages

def get_message(id: int, db: Session):
    message = db.query(Message).filter(Message.id == id).first()
    return message

def update_message(id: int, message: message.MessageCreate, db: Session):
    message_query = db.query(Message).filter(Message.id == id)
    message_query.update(message.model_dump(), synchronize_session=False)
    db.commit()
    updated_message = message_query.first()
    return updated_message

def delete_message(interaction_id: int, db: Session):
    message_query = db.query(Message).filter(Message.interaction_id == interaction_id)
    message_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

async def load_messages(chat_id: int, db: Session, limit: int = 20):
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
        count = db.query(func.count(Message.id)).filter(
            Message.chat_id == chat_id,
            Message.interaction_id == interaction_id
        ).scalar()

        # Stop before breaking interaction group
        if total_messages + count > limit:
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
