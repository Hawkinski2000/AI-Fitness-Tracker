from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.schemas import meal_log_food, food, branded_food


class MealLogBase(BaseModel):
    log_date: datetime

class MealLogCreate(MealLogBase):
    pass

class MealLogResponse(MealLogBase):
    id: int
    user_id: int
    total_calories: Optional[int] = None
    meal_log_foods: Optional[list[meal_log_food.MealLogFoodResponse]] = None
    foods: Optional[list[food.FoodResponse]] = None
    branded_foods: Optional[list[branded_food.BrandedFoodResponse]] = None

    model_config = ConfigDict(from_attributes=True)
