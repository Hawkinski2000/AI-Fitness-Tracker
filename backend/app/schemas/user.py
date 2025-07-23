from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password_hash: str
    settings: dict
    sex: str
    age: int
    weight: float
    height: int
    goal: str
    streak: int
    created_at: datetime
