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
    password: Optional[str] = None
    recaptcha_token: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    sex: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[int] = None
    goal: Optional[str] = None
    settings: Optional[dict] = None

    model_config = ConfigDict(extra="forbid")

class UserResponse(UserBase):
    id: int
    streak: int
    created_at: datetime
    input_tokens_remaining: int
    output_tokens_remaining: int
    last_token_reset: datetime

    model_config = ConfigDict(from_attributes=True)

class CheckResponse(BaseModel):
    taken: bool
