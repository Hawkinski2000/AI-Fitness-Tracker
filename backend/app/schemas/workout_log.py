from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WorkoutLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    workout_type: Optional[str] = None
    total_calories_burned: Optional[int] = None
