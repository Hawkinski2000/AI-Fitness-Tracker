from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log_food, token
from app.crud import meal_log_foods as crud_meal_log_foods
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/meal-log-foods",
                   tags=['Meal Log Foods'])

# Create a meal log food
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=meal_log_food.MealLogFoodResponse)
def create_meal_log_food(meal_log_food: meal_log_food.MealLogFoodCreate,
                         current_user: token.TokenData = Depends(get_current_user),
                         db: Session = Depends(get_db)):
    new_meal_log_food = crud_meal_log_foods.create_meal_log_food(meal_log_food, current_user.user_id, db)
    return new_meal_log_food

# Get all meal log foods
@router.get("/", response_model=list[meal_log_food.MealLogFoodResponse])
def get_meal_log_foods(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    meal_logs_foods = crud_meal_log_foods.get_meal_log_foods(current_user.user_id, db)
    return meal_logs_foods

# Get a meal log food
@router.get("/{id}", response_model=meal_log_food.MealLogFoodResponse)
def get_meal_log_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    meal_log_food = crud_meal_log_foods.get_meal_log_food(id, current_user.user_id, db)
    return meal_log_food

# Update a meal log food
@router.put("/{id}", response_model=meal_log_food.MealLogFoodResponse)
def update_meal_log_food(id: int,
                         meal_log_food: meal_log_food.MealLogFoodCreate,
                         current_user: token.TokenData = Depends(get_current_user),
                         db: Session = Depends(get_db)):
    updated_meal_log_food = crud_meal_log_foods.update_meal_log_food(id, meal_log_food, current_user.user_id, db)
    return updated_meal_log_food

# Delete a meal log food
@router.delete("/{id}")
def delete_meal_log_food(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_meal_log_foods.delete_meal_log_food(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
