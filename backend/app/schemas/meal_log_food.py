from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MealLogFoodBase(BaseModel):
    meal_log_id: int
    food_id: int

class MealLogFoodCreate(MealLogFoodBase):
    num_servings: Optional[float] = None
    serving_size: Optional[float] = None
    serving_unit: Optional[str] = None

class MealLogFoodResponse(MealLogFoodBase):
    id: int
    num_servings: float
    serving_size: float
    serving_unit: str
    created_at: datetime
    calories: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
