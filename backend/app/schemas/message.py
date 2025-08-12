from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MessageBase(BaseModel):
    chat_id: int

class MessageCreate(MessageBase):
    content: str

class MessageResponse(MessageBase):
    id: int
    interaction_id: int
    message: dict
    role: str
    type: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
