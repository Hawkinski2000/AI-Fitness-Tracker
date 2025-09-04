from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log_food_nutrient
from app.crud import meal_log_food_nutrients as crud_meal_log_food_nutrients


router = APIRouter(prefix="/api/meal-log-food-nutrients",
                   tags=['Meal Log Food Nutrients'])

# Create a meal log food nutrient
@router.post("", response_model=meal_log_food_nutrient.MealLogFoodNutrientResponse)
def create_meal_log_food_nutrient(meal_log_food_nutrient: meal_log_food_nutrient.MealLogFoodNutrientCreate, db: Session = Depends(get_db)):
    new_meal_log_food_nutrient = crud_meal_log_food_nutrients.create_meal_log_food_nutrient(meal_log_food_nutrient, db)
    return new_meal_log_food_nutrient

# Get all meal log food nutrients
@router.get("", response_model=list[meal_log_food_nutrient.MealLogFoodNutrientResponse])
def get_meal_log_food_nutrients(db: Session = Depends(get_db)):
    meal_log_food_nutrients = crud_meal_log_food_nutrients.get_meal_log_food_nutrients(db)
    return meal_log_food_nutrients

# Get a meal log food nutrient
@router.get("/{id}", response_model=meal_log_food_nutrient.MealLogFoodNutrientResponse)
def get_meal_log_food_nutrient(id: int, db: Session = Depends(get_db)):
    meal_log_food_nutrient = crud_meal_log_food_nutrients.get_meal_log_food_nutrient(id, db)
    return meal_log_food_nutrient

# Update a meal log food nutrient
@router.put("/{id}", response_model=meal_log_food_nutrient.MealLogFoodNutrientResponse)
def update_meal_log_food_nutrient(id: int, meal_log_food_nutrient: meal_log_food_nutrient.MealLogFoodNutrientCreate, db: Session = Depends(get_db)):
    updated_meal_log_food_nutrient = crud_meal_log_food_nutrients.update_meal_log_food_nutrient(id, meal_log_food_nutrient, db)
    return updated_meal_log_food_nutrient

# Delete a meal log food nutrient
@router.delete("/{id}")
def delete_meal_log_food_nutrient(id: int, db: Session = Depends(get_db)):
    crud_meal_log_food_nutrients.delete_meal_log_food_nutrient(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
