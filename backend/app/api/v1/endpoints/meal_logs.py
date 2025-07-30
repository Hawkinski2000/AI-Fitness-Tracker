from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log
from app.crud import meal_logs as crud_meal_logs


router = APIRouter(prefix="/meal-logs",
                   tags=['Meal Logs'])

# Create a meal log
@router.post("/")
def create_meal_log(meal_log: meal_log.MealLog):
    # TODO
    return {"data": "meal log"}

# Get all meal logs
@router.get("/", response_model=list[meal_log.MealLog])
def get_meal_logs(db: Session = Depends(get_db)):
    meal_logs = crud_meal_logs.get_meal_logs(db)
    return meal_logs

# Get a meal log
@router.get("/{id}")
def get_meal_log(id: int):
    # TODO
    return {"data": "meal log"}

# Update a meal log
@router.put("/{id}")
def update_meal_log(id: int, meal_log: meal_log.MealLog):
    # TODO
    return {"data": "meal log"}

# Delete a meal log
@router.delete("/{id}")
def delete_meal_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
