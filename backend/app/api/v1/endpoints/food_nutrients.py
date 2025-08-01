from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import food_nutrient
from app.crud import food_nutrients as crud_food_nutrients


router = APIRouter(prefix="/food-nutrients",
                   tags=['Food Nutrients'])

# Create a food nutrient
@router.post("/", response_model=food_nutrient.FoodNutrientResponse)
def create_food_nutrient(food_nutrient: food_nutrient.FoodNutrientCreate, db: Session = Depends(get_db)):
    new_food_nutrient = crud_food_nutrients.create_food_nutrient(food_nutrient, db)
    return new_food_nutrient

# Get all food nutrients
@router.get("/", response_model=list[food_nutrient.FoodNutrientResponse])
def get_food_nutrients(db: Session = Depends(get_db)):
    food_nutrients = crud_food_nutrients.get_food_nutrients(db)
    return food_nutrients

# Get a food nutrient
@router.get("/{id}", response_model=food_nutrient.FoodNutrientResponse)
def get_food_nutrient(id: int, db: Session = Depends(get_db)):
    food_nutrient = crud_food_nutrients.get_food_nutrient(id, db)
    return food_nutrient

# Update a food nutrient
@router.put("/{id}", response_model=food_nutrient.FoodNutrientResponse)
def update_food_nutrient(id: int, food_nutrient: food_nutrient.FoodNutrientCreate, db: Session = Depends(get_db)):
    updated_food_nutrient = crud_food_nutrients.update_food_nutrient(id, food_nutrient, db)
    return updated_food_nutrient

# Delete a food nutrient
@router.delete("/{id}")
def delete_food_nutrient(id: int, db: Session = Depends(get_db)):
    crud_food_nutrients.delete_food_nutrient(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
