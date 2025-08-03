from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import branded_food
from app.crud import branded_foods as crud_branded_foods


router = APIRouter(prefix="/branded-foods",
                   tags=['Branded Foods'])

# Create a branded food
@router.post("/", response_model=branded_food.BrandedFoodResponse)
def create_branded_food(branded_food: branded_food.BrandedFoodCreate, db: Session = Depends(get_db)):
    new_branded_food = crud_branded_foods.create_branded_food(branded_food, db)
    return new_branded_food

# Get all branded foods
@router.get("/", response_model=list[branded_food.BrandedFoodResponse])
def get_branded_foods(db: Session = Depends(get_db),
                      limit: int = 10,
                      skip: int = 0,
                      search: Optional[str] = ""):
    branded_foods = crud_branded_foods.get_branded_foods(db, limit, skip, search)
    return branded_foods

# Get a branded food
@router.get("/{id}", response_model=branded_food.BrandedFoodResponse)
def get_branded_food(id: int, db: Session = Depends(get_db)):
    branded_food = crud_branded_foods.get_branded_food(id, db)
    return branded_food

# Update a branded food
@router.put("/{id}", response_model=branded_food.BrandedFoodResponse)
def update_branded_food(id: int, branded_food: branded_food.BrandedFoodCreate, db: Session = Depends(get_db)):
    updated_branded_food = crud_branded_foods.update_branded_food(id, branded_food, db)
    return updated_branded_food

# Delete a branded food
@router.delete("/{id}")
def delete_branded_food(id: int, db: Session = Depends(get_db)):
    crud_branded_foods.delete_branded_food(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
