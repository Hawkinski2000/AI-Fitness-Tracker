from fastapi import status, APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import bcrypt
import app.core.oauth2 as oauth2
from app.core.db import get_db
from app.schemas import token
from app.models.models import User


router = APIRouter(prefix="/tokens",
                   tags=['Tokens'])

# Create a token
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=token.TokenResponse)
def create_token(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.username).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials")

    password = user_credentials.password.encode("utf-8")
    password_hash = user.password_hash.encode("utf-8")
    
    if not bcrypt.checkpw(password, password_hash):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid credentials")

    access_token = oauth2.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}
