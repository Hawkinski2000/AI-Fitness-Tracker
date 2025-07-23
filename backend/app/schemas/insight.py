from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Insight(BaseModel):
    id: Optional[int] = None
    insights_log_id: int
    insight: str
    created_at: datetime
    category: Optional[str] = None
