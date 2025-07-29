from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExerciseSet(BaseModel):
    id: Optional[int] = None
    workout_log_exercise_id: Optional[int] = None
    created_at: datetime
    weight: Optional[float] = None
    reps: Optional[int] = None
    unit: Optional[str] = None
    one_rep_max: Optional[float] = None
    rest_after_secs: Optional[int] = None
    duration_secs: Optional[int] = None
    calories_burned: Optional[int] = None
