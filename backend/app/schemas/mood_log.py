from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MoodLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    mood_score: Optional[int] = None
    notes: Optional[dict] = None
