from pydantic import BaseModel
from typing import Optional


class MealLogNutrients(BaseModel):
    meal_log_id: Optional[int] = None
    protein: float
    total_fat: float
    total_carbs: float
