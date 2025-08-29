from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import branded_food, token
from app.crud import branded_foods as crud_branded_foods
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/branded-foods",
                   tags=['Branded Foods'])

# Create a branded food
@router.post("/", response_model=branded_food.BrandedFoodResponse)
def create_branded_food(branded_food: branded_food.BrandedFoodCreate,
                        current_user: token.TokenData = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    new_branded_food = crud_branded_foods.create_branded_food(branded_food, current_user.user_id, db)
    return new_branded_food

# Get all branded foods
@router.get("/", response_model=list[branded_food.BrandedFoodResponse])
def get_branded_foods(limit: int = 10,
                      skip: int = 0,
                      search: Optional[str] = "",
                      current_user: token.TokenData = Depends(get_current_user),
                      db: Session = Depends(get_db)
                      ):
    branded_foods = crud_branded_foods.get_branded_foods(limit, skip, search, current_user.user_id, db)
    return branded_foods

# Get a branded food
@router.get("/{id}", response_model=branded_food.BrandedFoodResponse)
def get_branded_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    branded_food = crud_branded_foods.get_branded_food(id, current_user.user_id, db)
    return branded_food

# Update a branded food
@router.put("/{id}", response_model=branded_food.BrandedFoodResponse)
def update_branded_food(id: int,
                        branded_food: branded_food.BrandedFoodCreate,
                        current_user: token.TokenData = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    updated_branded_food = crud_branded_foods.update_branded_food(id, branded_food, current_user.user_id, db)
    return updated_branded_food

# Delete a branded food
@router.delete("/{id}")
def delete_branded_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_branded_foods.delete_branded_food(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
