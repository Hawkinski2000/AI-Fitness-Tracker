from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log
from app.crud import meal_logs as crud_meal_logs


router = APIRouter(prefix="/meal-logs",
                   tags=['Meal Logs'])

# Create a meal log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=meal_log.MealLogResponse)
def create_meal_log(meal_log: meal_log.MealLogCreate, db: Session = Depends(get_db)):
    new_meal_log = crud_meal_logs.create_meal_log(meal_log, db)
    return new_meal_log

# Get all meal logs
@router.get("/", response_model=list[meal_log.MealLogResponse])
def get_meal_logs(db: Session = Depends(get_db)):
    meal_logs = crud_meal_logs.get_meal_logs(db)
    return meal_logs

# Get a meal log
@router.get("/{id}", response_model=meal_log.MealLogResponse)
def get_meal_log(id: int, db: Session = Depends(get_db)):
    meal_log = crud_meal_logs.get_meal_log(id, db)
    return meal_log

# Update a meal log
@router.put("/{id}", response_model=meal_log.MealLogResponse)
def update_meal_log(id: int, meal_log: meal_log.MealLogCreate, db: Session = Depends(get_db)):
    updated_meal_log = crud_meal_logs.update_meal_log(id, meal_log, db)
    return updated_meal_log

# Delete a meal log
@router.delete("/{id}")
def delete_meal_log(id: int, db: Session = Depends(get_db)):
    crud_meal_logs.delete_meal_log(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
