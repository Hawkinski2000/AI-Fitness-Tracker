from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import chat
from app.crud import chats as crud_chats


router = APIRouter(prefix="/chats",
                   tags=['Chats'])

# Create a chat
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=chat.ChatResponse)
def create_chat(chat: chat.ChatCreate, db: Session = Depends(get_db)):
    new_chat = crud_chats.create_chat(chat, db)
    return new_chat

# Get all chats
@router.get("/", response_model=list[chat.ChatResponse])
def get_chats(db: Session = Depends(get_db)):
    chats = crud_chats.get_chats(db)
    return chats

# Get a chat
@router.get("/{id}", response_model=chat.ChatResponse)
def get_chat(id: int, db: Session = Depends(get_db)):
    chat = crud_chats.get_chat(id, db)
    return chat

# Update a chat
@router.put("/{id}", response_model=chat.ChatResponse)
def update_chat(id: int, chat: chat.ChatCreate, db: Session = Depends(get_db)):
    updated_chat = crud_chats.update_chat(id, chat, db)
    return updated_chat

# Delete a chat
@router.delete("/{id}")
def delete_chat(id: int, db: Session = Depends(get_db)):
    crud_chats.delete_chat(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
