from fastapi import Response, status, APIRouter
from app.schemas.meal_log_stats import MealLogStats


router = APIRouter(prefix="/api/meal-log-stats",
                   tags=['Meal Log Stats'])

# Create a meal log stats entry
@router.post("/")
def create_meal_log_stats(meal_log_stats: MealLogStats):
    # TODO
    return {"data": "meal log stats entry"}

# Get all meal log stats entries
@router.get("/")
def get_all_meal_log_stats():
    # TODO
    return {"data": "meal log stats entries"}

# Get a meal log stats entry
@router.get("/{id}")
def get_meal_log_stats(id: int):
    # TODO
    return {"data": "meal log stats entry"}

# Update a meal log stats entry
@router.put("/{id}")
def update_meal_log_stats(id: int, meal_log_stats: MealLogStats):
    # TODO
    return {"data": "meal log stats entry"}

# Delete a meal log stats entry
@router.delete("/{id}")
def delete_meal_log_stats(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
