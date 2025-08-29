from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import workout_log, token
from app.crud import workout_logs as crud_workout_logs
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/workout-logs",
                   tags=['Workout Logs'])

# Create a workout log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=workout_log.WorkoutLogResponse)
def create_workout_log(workout_log: workout_log.WorkoutLogCreate,
                       current_user: token.TokenData = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    new_workout_log = crud_workout_logs.create_workout_log(workout_log, current_user.user_id, db)
    return new_workout_log

# Get all workout logs
@router.get("/", response_model=list[workout_log.WorkoutLogResponse])
def get_workout_logs(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    workout_logs = crud_workout_logs.get_workout_logs(current_user.user_id, db)
    return workout_logs

# Get a workout log
@router.get("/{id}", response_model=workout_log.WorkoutLogResponse)
def get_workout_log(id: int,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    workout_log = crud_workout_logs.get_workout_log(id, current_user.user_id, db)
    return workout_log

# Update a workout log
@router.put("/{id}", response_model=workout_log.WorkoutLogResponse)
def update_workout_log(id: int,
                       workout_log: workout_log.WorkoutLogCreate,
                       current_user: token.TokenData = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    updated_workout_log = crud_workout_logs.update_workout_log(id, workout_log, current_user.user_id, db)
    return updated_workout_log

# Delete a workout log
@router.delete("/{id}")
def delete_workout_log(id: int,
                       current_user: token.TokenData = Depends(get_current_user),
                       db: Session = Depends(get_db)):
    crud_workout_logs.delete_workout_log(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
