from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SleepLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    time_to_bed: datetime
    time_awake: datetime
    duration: int
    sleep_score: Optional[int] = None
    notes: Optional[dict] = None
