from fastapi import Response, status, APIRouter
from app.schemas.meal_log_food_nutrient import MealLogFoodNutrient


router = APIRouter(prefix="/meal-log-food-nutrients",
                   tags=['Meal Log Food Nutrients'])

# Create a meal log food nutrient
@router.post("/")
def create_meal_log_food_nutrient(meal_log_food_nutrient: MealLogFoodNutrient):
    # TODO
    return {"data": "meal log food nutrient"}

# Get all meal log food nutrients
@router.get("/")
def get_meal_log_food_nutrients():
    # TODO
    return {"data": "meal log food nutrients"}

# Get a meal log food nutrient
@router.get("/{id}")
def get_meal_log_food_nutrient(id: int):
    # TODO
    return {"data": "meal log food nutrient"}

# Update a meal log food nutrient
@router.put("/{id}")
def update_meal_log_food_nutrient(id: int, meal_log_food_nutrient: MealLogFoodNutrient):
    # TODO
    return {"data": "meal log food nutrient"}

# Delete a meal log food nutrient
@router.delete("/{id}")
def delete_meal_log_food_nutrient(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
