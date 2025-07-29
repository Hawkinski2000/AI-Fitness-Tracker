from pydantic import BaseModel
from typing import Optional


class MealLogFoodNutrients(BaseModel):
    meal_log_food_id: Optional[int] = None
    protein: float
    total_fat: float
    total_carbs: float
