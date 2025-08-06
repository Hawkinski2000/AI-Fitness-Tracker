from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class SleepLogBase(BaseModel):
    user_id: int
    log_date: datetime
    time_to_bed: datetime
    time_awake: datetime
    duration: int
    sleep_score: Optional[int] = None
    notes: Optional[dict] = None

class SleepLogCreate(SleepLogBase):
    pass

class SleepLogResponse(SleepLogBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
