from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class WeightLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    weight: float
    unit: str
    created_at: datetime
