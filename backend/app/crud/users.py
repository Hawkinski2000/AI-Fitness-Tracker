from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import bcrypt
from app.schemas import user
from app.models.models import User


def create_user(user: user.UserCreate, db: Session):
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

    new_user = User(**user.model_dump(exclude_unset=True, exclude={"password"}))

    password = user.password.encode("utf-8")
    password_hash = bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")
    new_user.password_hash = password_hash

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# def get_users(db: Session):
#     users = db.query(User).all()
#     return users

def get_user(id: int, user_id: int, db: Session):
    user = db.query(User).filter(User.id == id, User.id == user_id).first()
    return user

def update_user(id: int, user: user.UserCreate, user_id: int, db: Session):
    user_query = db.query(User).filter(User.id == id, User.id == user_id)
    user_query.update(user.model_dump(exclude={"email", "password"}), synchronize_session=False)
    db.commit()
    updated_user = user_query.first()
    return updated_user

def delete_user(id: int, user_id: int, db: Session):
    user_query = db.query(User).filter(User.id == id, User.id == user_id)
    user_query.delete(synchronize_session=False)
    db.commit()
