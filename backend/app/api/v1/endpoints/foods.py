from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import food, token
from app.crud import foods as crud_foods
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/foods",
                   tags=['Foods'])

# Create a food
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=food.FoodResponse)
def create_food(food: food.FoodCreate,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    new_food = crud_foods.create_food(food, current_user.user_id, db)
    return new_food

# Get all foods
@router.get("/", response_model=list[food.FoodResponse])
def get_foods(limit: int = 10,
              skip: int = 0,
              search: Optional[str] = "",
              current_user: token.TokenData = Depends(get_current_user),
              db: Session = Depends(get_db)):
    foods = crud_foods.get_foods(limit, skip, search, current_user.user_id, db)
    return foods

# Get a food
@router.get("/{id}", response_model=food.FoodResponse)
def get_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    food = crud_foods.get_food(id, current_user.user_id, db)
    return food

# Update a food
@router.put("/{id}", response_model=food.FoodResponse)
def update_food(id: int,
                food: food.FoodCreate,
                current_user: token.TokenData = Depends(get_current_user),
                db: Session = Depends(get_db)):
    updated_food = crud_foods.update_food(id, food, current_user.user_id, db)
    return updated_food

# Delete a food
@router.delete("/{id}")
def delete_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_foods.delete_food(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
