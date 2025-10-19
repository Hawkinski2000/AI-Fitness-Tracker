from fastapi import HTTPException, status
import requests
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime, timezone, timedelta
from app.schemas import user
from app.models.models import User
from app.core.config import settings
from app.core.constants import (
    MAX_INPUT_TOKENS,
    MAX_OUTPUT_TOKENS
)


def create_user(user: user.UserCreate, db: Session):
    if not user.recaptcha_token:
        raise HTTPException(status_code=400, detail="Missing reCAPTCHA token")
    
    resp = requests.post(
        "https://www.google.com/recaptcha/api/siteverify",
        data={"secret": settings.recaptcha_secret_key, "response": user.recaptcha_token},
    )
    result = resp.json()
    if not result.get("success"):
        raise HTTPException(status_code=400, detail="Invalid reCAPTCHA token")

    existing_user_username = db.query(User).filter(User.username == user.username).first()
    if existing_user_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is already taken",
        )
    
    existing_user_email  = db.query(User).filter(User.email == user.email).first()
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    new_user = User(**user.model_dump(exclude_unset=True, exclude={"password", "recaptcha_token"}))

    password = user.password.encode("utf-8")
    password_hash = bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")
    new_user.password_hash = password_hash

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def check_username(username: str, db: Session):
    user = db.query(User).filter(User.username == username).first()
    return {"taken": bool(user)}

def check_email(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    return {"taken": bool(user)}

# def get_users(db: Session):
#     users = db.query(User).all()
#     return users

def get_user(id: int, user_id: int, db: Session):
    user = db.query(User).filter(User.id == id, User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    now_utc = datetime.now(timezone.utc)
    if now_utc - user.last_token_reset >= timedelta(hours=24):
        user.input_tokens_remaining = MAX_INPUT_TOKENS
        user.output_tokens_remaining = MAX_OUTPUT_TOKENS
        user.last_token_reset = now_utc
        db.commit()

    return user

def update_user(user: user.UserUpdate, user_id: int, db: Session):
    existing_user_username = db.query(User).filter(User.username == user.username, User.id != user_id).first()
    if existing_user_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username is already taken",
        )
    
    user_query = db.query(User).filter(User.id == user_id)

    if not user_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")
    
    user_query.update(user.model_dump(exclude_unset=True), synchronize_session=False)
    db.commit()
    updated_user = user_query.first()
    return updated_user

def delete_user(id: int, user_id: int, db: Session):
    user_query = db.query(User).filter(User.id == id, User.id == user_id)

    if not user_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")

    user_query.delete(synchronize_session=False)
    db.commit()
