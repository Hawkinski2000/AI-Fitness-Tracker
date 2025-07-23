from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Food(BaseModel):
    id: Optional[int] = None
    name: str
    base_num_servings: float
    base_serving_size: float
    calories: Optional[int] = None
    nutrients: Optional[dict] = None
    user_id: Optional[int] = None
    user_created_at: Optional[datetime] = None
