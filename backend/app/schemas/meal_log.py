from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MealLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    meal_type: str
    total_calories: Optional[int] = None
