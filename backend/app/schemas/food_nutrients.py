from pydantic import BaseModel
from typing import Optional


class FoodNutrients(BaseModel):
    food_id: Optional[int] = None
    protein: float
    total_fat: float
    total_carbs: float
