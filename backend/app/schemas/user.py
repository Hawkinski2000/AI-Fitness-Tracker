from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: str
    sex: str
    age: int
    weight: float
    height: int
    goal: str
    settings: dict

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    streak: int
    created_at: datetime
    input_tokens_remaining: int
    output_tokens_remaining: int
    last_token_reset: datetime

    model_config = ConfigDict(from_attributes=True)
