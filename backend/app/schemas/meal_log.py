from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MealLogBase(BaseModel):
    log_date: datetime
    total_calories: Optional[int] = None

class MealLogCreate(MealLogBase):
    pass

class MealLogResponse(MealLogBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
