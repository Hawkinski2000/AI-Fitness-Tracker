from fastapi import Response, status, APIRouter
from app.schemas.meal_log_food import MealLogFood


router = APIRouter(prefix="/meal-log-foods",
                   tags=['Meal Log Foods'])

# Create a meal log food
@router.post("/")
def create_meal_log_food(meal_log_food: MealLogFood):
    # TODO
    return {"data": "meal log food"}

# Get all meal log foods
@router.get("/")
def get_meal_log_foods():
    # TODO
    return {"data": "meal log foods"}

# Get a meal log food
@router.get("/{id}")
def get_meal_log_food(id: int):
    # TODO
    return {"data": "meal log food"}

# Update a meal log food
@router.put("/{id}")
def update_meal_log_food(id: int, meal_log_food: MealLogFood):
    # TODO
    return {"data": "meal log food"}

# Delete a meal log food
@router.delete("/{id}")
def delete_meal_log_food(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
