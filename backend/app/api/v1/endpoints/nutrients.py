from fastapi import Response, status, APIRouter
from app.schemas.nutrient import Nutrient


router = APIRouter(prefix="/nutrients",
                   tags=['Nutrients'])

# Create a nutrient
@router.post("/")
def create_nutrient(nutrient: Nutrient):
    # TODO
    return {"data": "nutrient"}

# Get all nutrients
@router.get("/")
def get_nutrients():
    # TODO
    return {"data": "nutrients"}

# Get a nutrient
@router.get("/{id}")
def get_nutrient(id: int):
    # TODO
    return {"data": "nutrient"}

# Update a nutrient
@router.put("/{id}")
def update_nutrient(id: int, nutrient: Nutrient):
    # TODO
    return {"data": "nutrient"}

# Delete a nutrient
@router.delete("/{id}")
def delete_nutrient(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
