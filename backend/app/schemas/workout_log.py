from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class WorkoutLogBase(BaseModel):
    log_date: datetime
    workout_type: Optional[str] = None

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    user_id: int
    total_num_sets: int
    total_calories_burned: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
