from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    sex: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[int] = None
    goal: Optional[str] = None
    settings: Optional[dict] = None

class UserCreate(UserBase):
    password: str
    recaptcha_token: str

class UserResponse(UserBase):
    id: int
    streak: int
    created_at: datetime
    input_tokens_remaining: int
    output_tokens_remaining: int
    last_token_reset: datetime

    model_config = ConfigDict(from_attributes=True)
