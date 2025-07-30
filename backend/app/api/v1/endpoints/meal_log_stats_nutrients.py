from fastapi import Response, status, APIRouter
from app.schemas.meal_log_stats_nutrient import MealLogStatsNutrient


router = APIRouter(prefix="/meal-log-stats-nutrients",
                   tags=['Meal Log Stats Nutrients'])

# Create a meal log stats nutrient
@router.post("/")
def create_meal_log_stats_nutrient(meal_log_stats_nutrient: MealLogStatsNutrient):
    # TODO
    return {"data": "meal log stats nutrient"}

# Get all meal log stats nutrients
@router.get("/")
def get_meal_log_stats_nutrients():
    # TODO
    return {"data": "meal log stats nutrients"}

# Get a meal log stats nutrient
@router.get("/{id}")
def get_meal_log_stats_nutrient(id: int):
    # TODO
    return {"data": "meal log stats nutrient"}

# Update a meal log stats nutrient
@router.put("/{id}")
def update_meal_log_stats_nutrient(id: int, meal_log_stats_nutrient: MealLogStatsNutrient):
    # TODO
    return {"data": "meal log stats nutrient"}

# Delete a meal log stats nutrient
@router.delete("/{id}")
def delete_meal_log_stats_nutrient(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
