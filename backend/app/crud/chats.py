from sqlalchemy.orm import Session
from app.schemas import chat
from app.models.models import Chat


def create_chat(chat: chat.ChatCreate, db: Session):
    new_chat = Chat(**chat.model_dump(exclude_unset=True))
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

def get_chats(db: Session):
    chats = db.query(Chat).all()
    return chats

def get_chat(id: int, db: Session):
    chat = db.query(Chat).filter(Chat.id == id).first()
    return chat

def update_chat(id: int, chat: chat.ChatCreate, db: Session):
    chat_query = db.query(Chat).filter(Chat.id == id)
    chat_query.update(chat.model_dump(), synchronize_session=False)
    db.commit()
    updated_chat = chat_query.first()
    return updated_chat

def delete_chat(id: int, db: Session):
    chat_query = db.query(Chat).filter(Chat.id == id)
    chat_query.delete(synchronize_session=False)
    db.commit()
