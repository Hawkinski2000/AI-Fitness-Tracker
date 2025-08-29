from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import user, token
from app.crud import users as crud_users
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/users",
                   tags=['Users'])

# Create a user
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=user.UserResponse)
def create_user(user: user.UserCreate, db: Session = Depends(get_db)):
    new_user = crud_users.create_user(user, db)
    return new_user

# Get all users
# @router.get("/", response_model=list[user.UserResponse])
# def get_users(db: Session = Depends(get_db)):
#     users = crud_users.get_users(db)
#     return users

# Get a user
@router.get("/{id}", response_model=user.UserResponse)
def get_user(id: int,
             current_user: token.TokenData = Depends(get_current_user),
             db: Session = Depends(get_db)):
    user = crud_users.get_user(id, current_user.user_id, db)
    return user

# Update a user
@router.put("/{id}", response_model=user.UserResponse)
def update_user(id: int,
                user: user.UserCreate,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    updated_user = crud_users.update_user(id, user, current_user.user_id, db)
    return updated_user

# Delete a user
@router.delete("/{id}")
def delete_user(id: int,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    crud_users.delete_user(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
