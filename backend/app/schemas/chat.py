from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ChatBase(BaseModel):
    title: Optional[str] = None

class ChatCreate(ChatBase):
    pass

class ChatResponse(ChatBase):
    id: int
    user_id: int
    created_at: datetime
    newest_response_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
