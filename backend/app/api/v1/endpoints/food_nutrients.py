from fastapi import Response, status, APIRouter
from app.schemas.food_nutrient import FoodNutrient


router = APIRouter(prefix="/food-nutrients",
                   tags=['Food Nutrients'])

# Create a food nutrient
@router.post("/")
def create_food_nutrient(food_nutrient: FoodNutrient):
    # TODO
    return {"data": "food nutrient"}

# Get all food nutrients
@router.get("/")
def get_food_nutrients():
    # TODO
    return {"data": "food nutrients"}

# Get a food nutrient
@router.get("/{id}")
def get_food_nutrient(id: int):
    # TODO
    return {"data": "food nutrient"}

# Update a food nutrient
@router.put("/{id}")
def update_food_nutrient(id: int, food_nutrient: FoodNutrient):
    # TODO
    return {"data": "food nutrient"}

# Delete a food nutrient
@router.delete("/{id}")
def delete_food_nutrient(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
