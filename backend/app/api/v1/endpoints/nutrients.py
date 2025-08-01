from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import nutrient
from app.crud import nutrients as crud_nutrients


router = APIRouter(prefix="/nutrients",
                   tags=['Nutrients'])

# Create a nutrient
@router.post("/", response_model=nutrient.NutrientResponse)
def create_nutrient(nutrient: nutrient.NutrientCreate, db: Session = Depends(get_db)):
    new_nutrient = crud_nutrients.create_nutrient(nutrient, db)
    return new_nutrient

# Get all nutrients
@router.get("/", response_model=list[nutrient.NutrientResponse])
def get_nutrients(db: Session = Depends(get_db)):
    nutrients = crud_nutrients.get_nutrients(db)
    return nutrients

# Get a nutrient
@router.get("/{id}", response_model=nutrient.NutrientResponse)
def get_nutrient(id: int, db: Session = Depends(get_db)):
    nutrient = crud_nutrients.get_nutrient(id, db)
    return nutrient

# Update a nutrient
@router.put("/{id}", response_model=nutrient.NutrientResponse)
def update_nutrient(id: int, nutrient: nutrient.NutrientCreate, db: Session = Depends(get_db)):
    updated_nutrient = crud_nutrients.update_nutrient(id, nutrient, db)
    return updated_nutrient

# Delete a nutrient
@router.delete("/{id}")
def delete_nutrient(id: int, db: Session = Depends(get_db)):
    crud_nutrients.delete_nutrient(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
