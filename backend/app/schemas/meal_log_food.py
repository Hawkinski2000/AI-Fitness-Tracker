from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class MealLogFoodBase(BaseModel):
    meal_log_id: int
    # food_id: int
    num_servings: float
    serving_size: float
    serving_unit: str
    calories: Optional[int] = None

class MealLogFoodCreate(MealLogFoodBase):
    pass

class MealLogFoodResponse(MealLogFoodBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
