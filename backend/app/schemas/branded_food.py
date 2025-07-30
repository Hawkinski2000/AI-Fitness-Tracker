from pydantic import BaseModel
from typing import Optional


class BrandedFood(BaseModel):
    id: Optional[int] = None
    brand_owner: str
    brand_name: str
    subbrand_name: str
    ingredients: str
    serving_size: float
    serving_size_unit: str
    food_category: str
