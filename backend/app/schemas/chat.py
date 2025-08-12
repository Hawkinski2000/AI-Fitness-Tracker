from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ChatBase(BaseModel):
    user_id: int
    title: Optional[str] = None

class ChatCreate(ChatBase):
    pass

class ChatResponse(ChatBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
