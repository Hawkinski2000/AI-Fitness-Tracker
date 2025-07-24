from fastapi import Response, status, APIRouter
from app.schemas.meal_log import MealLog


router = APIRouter(prefix="/meal-logs",
                   tags=['Meal Logs'])

# Create a meal log
@router.post("/")
def create_meal_log(meal_log: MealLog):
    # TODO
    return {"data": "meal log"}

# Get all meal logs
@router.get("/")
def get_meal_logs():
    # TODO
    return {"data": "meal logs"}

# Get a meal log
@router.get("/{id}")
def get_meal_log(id: int):
    # TODO
    return {"data": "meal log"}

# Update a meal log
@router.put("/{id}")
def update_meal_log(id: int, meal_log: MealLog):
    # TODO
    return {"data": "meal log"}

# Delete a meal log
@router.delete("/{id}")
def delete_meal_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
