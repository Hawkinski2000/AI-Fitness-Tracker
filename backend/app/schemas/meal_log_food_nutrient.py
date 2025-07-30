from pydantic import BaseModel
from typing import Optional


class MealLogFoodNutrient(BaseModel):
    id: Optional[int] = None
    meal_log_food_id: int
    nutrient_id: int
    amount: float
