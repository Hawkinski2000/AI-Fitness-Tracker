from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class InsightLogBase(BaseModel):
    user_id: int
    raw_text: str
    summary: Optional[str] = None

class InsightLogCreate(InsightLogBase):
    pass

class InsightLogResponse(InsightLogBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
