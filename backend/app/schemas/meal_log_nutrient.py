from pydantic import BaseModel
from typing import Optional


class MealLogNutrient(BaseModel):
    id: Optional[int] = None
    meal_log_id: int
    nutrient_id: int
    amount: float
