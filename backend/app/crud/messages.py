from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, delete
import asyncio
import tiktoken
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException
from app.schemas import message
from app.models.models import Message, Chat
import app.agent.agent as agent
from app.core.constants import (
    MAX_INPUT_TOKENS,
    MAX_OUTPUT_TOKENS,
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
    print(f"User message: {user_message}")
    user_message_tokens = encoding.encode(user_message)
    user_message_tokens_count = len(user_message_tokens)
    if user_message_tokens_count > MAX_USER_MESSAGE_TOKENS:
        raise HTTPException(
            status_code=400,
            detail=f"Your message is too long ({user_message_tokens_count} tokens). Limit is {MAX_USER_MESSAGE_TOKENS} tokens."
        )
    
    newest_response_id = chat.newest_response_id
    
    responses = []
    async for event in agent.generate_insight(user, message.content, newest_response_id):
        if event["type"] == "completed":
            response = event["response"]
            responses.append(response)

            usage = response.usage
            payload = {"type": "usage",
                       "usage": {
                           "input_tokens": usage.input_tokens,
                           "output_tokens": usage.output_tokens
                       }
            }
            yield payload
        else:
            yield event
        await asyncio.sleep(0)

    outputs = []
    input_tokens_count = 0
    output_tokens_count = 0
    for response in responses:
        response_outputs = [item.model_dump() for item in response.output]
        outputs.extend(response_outputs)

        input_tokens_count += response.usage.input_tokens
        output_tokens_count += response.usage.output_tokens

    print(f"\nInput tokens used: {input_tokens_count}")
    print(f"Output tokens used: {output_tokens_count}")
    user.input_tokens_remaining -= input_tokens_count
    user.output_tokens_remaining -= output_tokens_count
    db.commit()
    total_tokens_remaining = min(user.input_tokens_remaining, user.output_tokens_remaining)
    print(f"\nYou have {total_tokens_remaining} tokens remaining.")

    if responses:
        newest_response_id = responses[-1].id
        chat.newest_response_id = newest_response_id

    new_messages = []

    max_interaction_id = db.query(func.max(Message.interaction_id)).filter(Message.chat_id == message.chat_id).scalar()
    new_interaction_id = (max_interaction_id or 0) + 1

    new_user_message = Message(
        chat_id=message.chat_id,
        interaction_id=new_interaction_id,
        message={
            "role": "user",
            "content": user_message
        },
        role="user",
        type="message"
    )
    db.add(new_user_message)
    new_messages.append(new_user_message)

    for output in outputs:
        created_at = datetime.now(timezone.utc)
        new_message = Message(
            chat_id=message.chat_id,
            interaction_id=new_interaction_id,
            message=output,
            role="assistant",
            type=output.get("type"),
            created_at=created_at
        )
        db.add(new_message)
        new_messages.append(new_message)

    db.commit()

    for message in new_messages:
        db.refresh(message)

def get_messages(chat_id: int, user_id: int, db: Session):
    messages = (
        db.query(Message)
        .join(Chat, Message.chat_id == Chat.id)
        .filter(Chat.user_id == user_id,
                Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
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
