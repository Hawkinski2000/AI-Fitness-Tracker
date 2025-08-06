from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    exercise_type: Optional[str] = None
    body_part: Optional[str] = None
    equipment: Optional[str] = None
    level: Optional[str] = None
    notes: Optional[dict] = None
    base_unit: Optional[str] = None
    user_id: Optional[int] = None

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseResponse(ExerciseBase):
    id: int
    user_created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
