from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class SleepLogBase(BaseModel):
    log_date: datetime
    time_to_bed: Optional[datetime] = None
    time_awake: Optional[datetime] = None
    duration: Optional[int] = None
    sleep_score: Optional[int] = None
    notes: Optional[dict] = None

class SleepLogCreate(SleepLogBase):
    pass

class SleepLogUpdate(BaseModel):
    time_to_bed: Optional[datetime] = None
    time_awake: Optional[datetime] = None
    duration: Optional[int] = None
    sleep_score: Optional[int] = None

class SleepLogResponse(SleepLogBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
