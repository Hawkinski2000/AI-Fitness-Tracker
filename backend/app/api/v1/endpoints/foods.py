from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import food
from app.crud import foods as crud_foods


router = APIRouter(prefix="/foods",
                   tags=['Foods'])

# Create a food
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=food.FoodResponse)
def create_food(food: food.FoodCreate, db: Session = Depends(get_db)):
    new_food = crud_foods.create_food(food, db)
    return new_food

# Get all foods
@router.get("/", response_model=list[food.FoodResponse])
def get_foods(db: Session = Depends(get_db),
              limit: int = 10,
              skip: int = 0,
              search: Optional[str] = ""):
    foods = crud_foods.get_foods(db, limit, skip, search)
    return foods

# Get a food
@router.get("/{id}", response_model=food.FoodResponse)
def get_food(id: int, db: Session = Depends(get_db)):
    food = crud_foods.get_food(id, db)
    return food

# Update a food
@router.put("/{id}", response_model=food.FoodResponse)
def update_food(id: int, food: food.FoodCreate, db: Session = Depends(get_db)):
    updated_food = crud_foods.update_food(id, food, db)
    return updated_food

# Delete a food
@router.delete("/{id}")
def delete_food(id: int, db: Session = Depends(get_db)):
    crud_foods.delete_food(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
