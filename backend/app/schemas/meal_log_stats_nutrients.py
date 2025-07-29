from pydantic import BaseModel
from typing import Optional


class MealLogStatsNutrients(BaseModel):
    meal_log_stats_id: Optional[int] = None
    protein: float
    total_fat: float
    total_carbs: float
