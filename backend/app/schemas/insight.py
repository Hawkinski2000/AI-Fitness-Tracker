from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class InsightBase(BaseModel):
    insight_log_id: int
    category: Optional[str] = None

class InsightCreate(InsightBase):
    pass

class InsightResponse(InsightBase):
    id: int
    insight: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
