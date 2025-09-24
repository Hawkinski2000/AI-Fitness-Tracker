from sqlalchemy.orm import Session
from app.schemas import chat
from app.models.models import Chat


def create_chat(chat: chat.ChatCreate, user_id: int, db: Session):
    new_chat = Chat(**chat.model_dump(exclude_unset=True), user_id=user_id)
    new_chat.title = f"New chat"
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

def get_chats(user_id: int, db: Session):
    chats = db.query(Chat).filter(Chat.user_id == user_id).order_by(Chat.created_at.desc()).all()
    return chats

def get_chat(id: int, user_id: int, db: Session):
    chat = db.query(Chat).filter(Chat.id == id, Chat.user_id == user_id).first()
    return chat

def update_chat(id: int, chat: chat.ChatCreate, user_id: int, db: Session):
    chat_query = db.query(Chat).filter(Chat.id == id, Chat.user_id == user_id)
    chat_query.update(chat.model_dump(exclude_unset=True), synchronize_session=False)
    db.commit()
    updated_chat = chat_query.first()
    return updated_chat

def delete_chat(id: int, user_id: int, db: Session):
    chat = db.query(Chat).filter(Chat.id == id, Chat.user_id == user_id).first()
    if chat:
        db.delete(chat)
        db.commit()
