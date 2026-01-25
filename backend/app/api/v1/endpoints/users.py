from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import user, token
from app.crud import users as crud_users
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/users",
                   tags=['Users'])

# Create a user
@router.post("", status_code=status.HTTP_201_CREATED, response_model=user.UserResponse)
def create_user(user: user.UserCreate, db: Session = Depends(get_db)):
    new_user = crud_users.create_user(user, db)
    return new_user

# Check if a username is taken
@router.get("/check-username", response_model=user.CheckResponse)
def check_username(username: str, db: Session = Depends(get_db)):
    response = crud_users.check_username(username, db)
    return response

# Check if an email is already registered
@router.get("/check-email", response_model=user.CheckResponse)
def check_email(email: str, db: Session = Depends(get_db)):
    response = crud_users.check_email(email, db)
    return response

# Get a user
@router.get("/{id}", response_model=user.UserResponse)
def get_user(id: int,
             current_user: token.TokenData = Depends(get_current_user),
             db: Session = Depends(get_db)):
    user = crud_users.get_user(id, current_user.user_id, db)
    return user

# Update a user
@router.patch("", response_model=user.UserResponse)
def update_user(user: user.UserUpdate,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    updated_user = crud_users.update_user(user, current_user.user_id, db)
    return updated_user

# Delete a user
@router.delete("/{id}")
def delete_user(id: int,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    crud_users.delete_user(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
