from fastapi import Response, status, APIRouter
from app.schemas.meal_log_nutrient import MealLogNutrient


router = APIRouter(prefix="/meal-log-nutrients",
                   tags=['Meal Log Nutrients'])

# Create a meal log nutrient
@router.post("/")
def create_meal_log_nutrient(meal_log_nutrient: MealLogNutrient):
    # TODO
    return {"data": "meal log nutrient"}

# Get all meal log nutrients
@router.get("/")
def get_meal_log_nutrients():
    # TODO
    return {"data": "meal log nutrients"}

# Get a meal log nutrient
@router.get("/{id}")
def get_meal_log_nutrient(id: int):
    # TODO
    return {"data": "meal log nutrient"}

# Update a meal log nutrient
@router.put("/{id}")
def update_meal_log_nutrient(id: int, meal_log_nutrient: MealLogNutrient):
    # TODO
    return {"data": "meal log nutrient"}

# Delete a meal log nutrient
@router.delete("/{id}")
def delete_meal_log_nutrient(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
