from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MealLogBase(BaseModel):
    log_date: datetime

class MealLogCreate(MealLogBase):
    pass

class MealLogResponse(MealLogBase):
    id: int
    user_id: int
    total_calories: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
