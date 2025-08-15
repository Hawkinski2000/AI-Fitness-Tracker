from pydantic import BaseModel, EmailStr
from typing import Optional


class TokenBase(BaseModel):
    pass

class TokenCreate(TokenBase):
    email: EmailStr
    password: str

class TokenResponse(TokenBase):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
