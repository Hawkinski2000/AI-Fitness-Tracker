from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log_nutrient
from app.crud import meal_log_nutrients as crud_meal_log_nutrients


router = APIRouter(prefix="/meal-log-nutrients",
                   tags=['Meal Log Nutrients'])

# Create a meal log nutrient
@router.post("/", response_model=meal_log_nutrient.MealLogNutrientResponse)
def create_meal_log_nutrient(meal_log_nutrient: meal_log_nutrient.MealLogNutrientCreate, db: Session = Depends(get_db)):
    new_meal_log_nutrient = crud_meal_log_nutrients.create_meal_log_nutrient(meal_log_nutrient, db)
    return new_meal_log_nutrient

# Get all meal log nutrients
@router.get("/", response_model=list[meal_log_nutrient.MealLogNutrientResponse])
def get_meal_log_nutrients(db: Session = Depends(get_db)):
    meal_log_nutrients = crud_meal_log_nutrients.get_meal_log_nutrients(db)
    return meal_log_nutrients

# Get a meal log nutrient
@router.get("/{id}", response_model=meal_log_nutrient.MealLogNutrientResponse)
def get_meal_log_nutrient(id: int, db: Session = Depends(get_db)):
    meal_log_nutrient = crud_meal_log_nutrients.get_meal_log_nutrient(id, db)
    return meal_log_nutrient

# Update a meal log nutrient
@router.put("/{id}", response_model=meal_log_nutrient.MealLogNutrientResponse)
def update_meal_log_nutrient(id: int, meal_log_nutrient: meal_log_nutrient.MealLogNutrientCreate, db: Session = Depends(get_db)):
    updated_meal_log_nutrient = crud_meal_log_nutrients.update_meal_log_nutrient(id, meal_log_nutrient, db)
    return updated_meal_log_nutrient

# Delete a meal log nutrient
@router.delete("/{id}")
def delete_meal_log_nutrient(id: int, db: Session = Depends(get_db)):
    crud_meal_log_nutrients.delete_meal_log_nutrient(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
