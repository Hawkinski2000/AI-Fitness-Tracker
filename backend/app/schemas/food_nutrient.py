from pydantic import BaseModel
from typing import Optional


class FoodNutrient(BaseModel):
    id: Optional[int] = None
    food_id: int
    nutrient_id: int
    amount: float
