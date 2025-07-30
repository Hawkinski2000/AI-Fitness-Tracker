from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Food(BaseModel):
    id: Optional[int] = None
    brand_owner: str
    brand_name: str
    subbrand_name: str
    ingredients: str
    serving_size: float
    serving_size_unit: str
    food_category: str
    calories: int
    user_id: int
    user_created_at: Optional[datetime] = None
