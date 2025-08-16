from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import meal_log, token
from app.crud import meal_logs as crud_meal_logs
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/meal-logs",
                   tags=['Meal Logs'])

# Create a meal log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=meal_log.MealLogResponse)
def create_meal_log(meal_log: meal_log.MealLogCreate,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    new_meal_log = crud_meal_logs.create_meal_log(meal_log, current_user.user_id, db)
    return new_meal_log

# Get all meal logs
@router.get("/", response_model=list[meal_log.MealLogResponse])
def get_meal_logs(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    meal_logs = crud_meal_logs.get_meal_logs(current_user.user_id, db)
    return meal_logs

# Get a meal log
@router.get("/{id}", response_model=meal_log.MealLogResponse)
def get_meal_log(id: int,
                 current_user: token.TokenData = Depends(get_current_user),
                 db: Session = Depends(get_db)):
    meal_log = crud_meal_logs.get_meal_log(id, current_user.user_id, db)
    return meal_log

# Update a meal log
@router.put("/{id}", response_model=meal_log.MealLogResponse)
def update_meal_log(id: int,
                    meal_log: meal_log.MealLogCreate,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    updated_meal_log = crud_meal_logs.update_meal_log(id, meal_log, current_user.user_id, db)
    return updated_meal_log

# Delete a meal log
@router.delete("/{id}")
def delete_meal_log(id: int,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    crud_meal_logs.delete_meal_log(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
