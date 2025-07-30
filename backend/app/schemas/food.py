from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Food(BaseModel):
    id: Optional[int] = None
    description: str
    calories: int
    user_id: int
    user_created_at: Optional[datetime] = None
