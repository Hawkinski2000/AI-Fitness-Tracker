from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: str
    password_hash: str
    settings: dict
    sex: str
    age: int
    weight: float
    height: int
    goal: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    streak: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
