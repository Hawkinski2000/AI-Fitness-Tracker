from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MoodLogBase(BaseModel):
    log_date: datetime
    mood_score: Optional[int] = None
    notes: Optional[dict] = None

class MoodLogCreate(MoodLogBase):
    pass

class MoodLogUpdate(BaseModel):
    mood_score: Optional[int] = None

class MoodLogResponse(MoodLogBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
