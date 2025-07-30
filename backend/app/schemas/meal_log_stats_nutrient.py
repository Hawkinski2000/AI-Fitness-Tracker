from pydantic import BaseModel
from typing import Optional


class MealLogStatsNutrient(BaseModel):    
    id: Optional[int] = None
    meal_log_stats_id: int
    nutrient_id: int
    amount: float
