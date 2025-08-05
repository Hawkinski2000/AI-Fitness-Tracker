from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ExerciseSetBase(BaseModel):
    workout_log_exercise_id: int
    weight: Optional[float] = None
    reps: Optional[int] = None
    unit: Optional[str] = None
    one_rep_max: Optional[float] = None
    rest_after_secs: Optional[int] = None
    duration_secs: Optional[int] = None
    calories_burned: Optional[int] = None

class ExerciseSetCreate(ExerciseSetBase):
    pass

class ExerciseSetResponse(ExerciseSetBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
