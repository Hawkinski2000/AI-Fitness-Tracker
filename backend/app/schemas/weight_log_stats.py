from pydantic import BaseModel
from typing import Optional


class WeightLogStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    min_weight: float
    max_weight: float
    avg_weight: float
