from fastapi import Response, status, APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
from app.core.db import get_db
from app.schemas import message, token
from app.crud import messages as crud_messages
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/messages",
                   tags=['Messages'])

# Create a message
@router.post("", status_code=status.HTTP_201_CREATED, response_model=list[message.MessageResponse])
async def create_message(message: message.MessageCreate,
                         current_user: token.TokenData = Depends(get_current_user),
                         db: Session = Depends(get_db)):
    async def message_generator():
        async for event in crud_messages.create_message(message, current_user.user_id, db):
            yield (json.dumps(event) + "\n").encode("utf-8")
            
    return StreamingResponse(message_generator(), media_type="text/event-stream")

# Get all messages
@router.get("/{chat_id}", response_model=list[message.MessageResponse])
def get_messages(chat_id: int,
                 current_user: token.TokenData = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    messages = crud_messages.get_messages(chat_id, current_user.user_id, db)
    return messages

# Get a message
@router.get("/{id}", response_model=message.MessageResponse)
def get_message(id: int,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    message = crud_messages.get_message(id, current_user.user_id, db)
    return message

# Update a message
# @router.put("/{id}", response_model=message.MessageResponse)
# def update_message(id: int, message: message.MessageCreate,
#                    current_user: token.TokenData = Depends(get_current_user),
#                    db: Session = Depends(get_db)):
#     updated_message = crud_messages.update_message(id, message, current_user.user_id, db)
#     return updated_message

# Delete a message group
@router.delete("/{interaction_id}")
def delete_message_group(interaction_id: int,
                   current_user: token.TokenData = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    crud_messages.delete_message_group(interaction_id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
