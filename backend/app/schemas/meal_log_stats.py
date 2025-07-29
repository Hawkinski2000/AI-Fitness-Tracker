from pydantic import BaseModel
from typing import Optional


class MealLogStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    min_calories: int
    max_calories: int
    avg_calories: float
