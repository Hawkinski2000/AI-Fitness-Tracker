from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import chat, token
from app.crud import chats as crud_chats
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/chats",
                   tags=['Chats'])

# Create a chat
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=chat.ChatResponse)
def create_chat(chat: chat.ChatCreate, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    new_chat = crud_chats.create_chat(chat, current_user.user_id, db)
    return new_chat

# Get all chats
@router.get("/", response_model=list[chat.ChatResponse])
def get_chats(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    chats = crud_chats.get_chats(current_user.user_id, db)
    return chats

# Get a chat
@router.get("/{id}", response_model=chat.ChatResponse)
def get_chat(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    chat = crud_chats.get_chat(id, current_user.user_id, db)
    return chat

# Update a chat
@router.put("/{id}", response_model=chat.ChatResponse)
def update_chat(id: int, chat: chat.ChatCreate, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_chat = crud_chats.update_chat(id, chat, current_user.user_id, db)
    return updated_chat

# Delete a chat
@router.delete("/{id}")
def delete_chat(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_chats.delete_chat(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
