from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import message
from app.crud import messages as crud_messages


router = APIRouter(prefix="/messages",
                   tags=['Messages'])

# Create a message
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=list[message.MessageResponse])
def create_message(message: message.MessageCreate, db: Session = Depends(get_db)):
    new_messages = crud_messages.create_message(message, db)
    return new_messages

# Get all messages
@router.get("/", response_model=list[message.MessageResponse])
def get_messages(db: Session = Depends(get_db)):
    messages = crud_messages.get_messages(db)
    return messages

# Get a message
@router.get("/{id}", response_model=message.MessageResponse)
def get_message(id: int, db: Session = Depends(get_db)):
    message = crud_messages.get_message(id, db)
    return message

# Update a message
@router.put("/{id}", response_model=message.MessageResponse)
def update_message(id: int, message: message.MessageCreate, db: Session = Depends(get_db)):
    updated_message = crud_messages.update_message(id, message, db)
    return updated_message

# Delete a message
@router.delete("/{interaction_id}")
def delete_message(interaction_id: int, db: Session = Depends(get_db)):
    crud_messages.delete_message(interaction_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
