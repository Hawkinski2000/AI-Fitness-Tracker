from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.schemas import branded_food


class FoodBase(BaseModel):
    description: str
    calories: Optional[int] = None

class FoodCreate(FoodBase):
    pass

class FoodResponse(FoodBase):
    id: int
    user_id: Optional[int] = None
    user_created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class FoodListResponse(BaseModel):
    foods: list[FoodResponse]
    branded_foods: Optional[list[branded_food.BrandedFoodResponse]]
    total_count: int
