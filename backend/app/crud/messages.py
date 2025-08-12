from sqlalchemy.orm import Session
from sqlalchemy import func
from app.schemas import message
from app.models.models import Message
import app.agent.agent as agent


def create_message(message: message.MessageCreate, db: Session):
    max_interaction_id = db.query(func.max(Message.interaction_id)).filter(Message.chat_id == message.chat_id).scalar()
    new_interaction_id = (max_interaction_id or 0) + 1

    new_messages = agent.generate_insight(chat_id=message.chat_id, user_message=message.content)

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

async def load_messages(chat_id: int, db: Session, limit: int = 50):
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
        messages = (
            db.query(Message)
            .filter(Message.chat_id == chat_id)
            .order_by(Message.id.desc())
            .limit(limit)
            .all()
        )
        messages.reverse()
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
