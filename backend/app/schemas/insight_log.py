from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InsightLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    created_at: datetime
    raw_text: str
    summary: Optional[str] = None
