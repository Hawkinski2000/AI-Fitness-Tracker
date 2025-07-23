from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Exercise(BaseModel):
    id: Optional[int] = None
    name: str
    base_unit: Optional[str] = None
    notes: Optional[dict] = None
    user_id: Optional[int] = None
    user_created_at: Optional[datetime] = None
