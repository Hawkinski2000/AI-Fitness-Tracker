from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MealLogFood(BaseModel):
    id: Optional[int] = None
    meal_log_id: int
    food_id: int
    num_servings: float
    serving_size: float
    serving_unit: str
    created_at: datetime
    calories: Optional[int] = None
