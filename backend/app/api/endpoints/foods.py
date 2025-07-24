from fastapi import Response, status, APIRouter
from app.schemas.food import Food


router = APIRouter(prefix="/foods",
                   tags=['Foods'])

# Create a food
@router.post("/")
def create_food(food: Food):
    # TODO
    return {"data": "food"}

# Get all foods
@router.get("/")
def get_foods():
    # TODO  
    return {"data": "foods"}

# Get a food
@router.get("/{id}")
def get_food(id: int):
    # TODO
    return {"data": "food"}

# Update a food
@router.put("/{id}")
def update_food(id: int, food: Food):
    # TODO
    return {"data": "food"}

# Delete a food
@router.delete("/{id}")
def delete_food(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
