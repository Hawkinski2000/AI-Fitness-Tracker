from fastapi import Response, status, APIRouter
from app.schemas.branded_food import BrandedFood


router = APIRouter(prefix="/branded-foods",
                   tags=['Branded Foods'])

# Create a branded food
@router.post("/")
def create_branded_food(branded_food: BrandedFood):
    # TODO
    return {"data": "branded food"}

# Get all branded foods
@router.get("/")
def get_branded_foods():
    # TODO  
    return {"data": "branded food"}

# Get a branded food
@router.get("/{id}")
def get_branded_food(id: int):
    # TODO
    return {"data": "branded food"}

# Update a branded food
@router.put("/{id}")
def update_branded_food(id: int, branded_food: BrandedFood):
    # TODO
    return {"data": "branded food"}

# Delete a branded food
@router.delete("/{id}")
def delete_branded_food(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
