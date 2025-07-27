from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SleepLogStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    earliest_time_to_bed: datetime
    latest_time_to_bed: datetime
    earliest_time_awake: datetime
    latest_time_awake: datetime
    avg_time_to_bed: datetime
    avg_time_awake: datetime
    min_duration: int
    max_duration: int
    total_duration: int
    avg_duration: float
    min_sleep_score: int
    max_sleep_score: int
    avg_sleep_score: float
