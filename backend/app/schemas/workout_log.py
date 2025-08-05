from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class WorkoutLogBase(BaseModel):
    # user_id: int
    log_date: datetime
    workout_type: Optional[str] = None

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    total_num_sets: int
    total_calories_burned: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
