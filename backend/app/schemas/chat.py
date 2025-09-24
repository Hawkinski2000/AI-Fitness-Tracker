from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    pass

class ChatUpdate(ChatBase):
    title: str

class ChatResponse(ChatBase):
    id: int
    user_id: int
    created_at: datetime
    newest_response_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ChatTitleCreate(BaseModel):
    chat_id: int
    user_message: str

class ChatTitleResponse(BaseModel):
    new_chat_title: str

    model_config = ConfigDict(from_attributes=True)
