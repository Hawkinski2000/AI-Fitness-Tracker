from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import workout_log_exercise, token
from app.crud import workout_log_exercises as crud_workout_log_exercises
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/workout-log-exercises",
                   tags=['Workout Log Exercises'])

# Create a workout log exercise
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=workout_log_exercise.WorkoutLogExerciseResponse)
def create_workout_log_exercise(workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate,
                                current_user: token.TokenData = Depends(get_current_user),
                                db: Session = Depends(get_db)):
    new_workout_log_exercise = crud_workout_log_exercises.create_workout_log_exercise(workout_log_exercise, current_user.user_id, db)
    return new_workout_log_exercise

# Get all workout log exercises
@router.get("/", response_model=list[workout_log_exercise.WorkoutLogExerciseResponse])
def get_workout_log_exercises(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    workout_log_exercises = crud_workout_log_exercises.get_workout_log_exercises(current_user.user_id, db)
    return workout_log_exercises

# Get a workout log exercise
@router.get("/{id}", response_model=workout_log_exercise.WorkoutLogExerciseResponse)
def get_workout_log_exercise(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    workout_log_exercise = crud_workout_log_exercises.get_workout_log_exercise(id, current_user.user_id, db)
    return workout_log_exercise

# Update a workout log exercise
@router.put("/{id}", response_model=workout_log_exercise.WorkoutLogExerciseResponse)
def update_workout_log_exercise(id: int,
                                workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate,
                                current_user: token.TokenData = Depends(get_current_user),
                                db: Session = Depends(get_db)):
    updated_workout_log_exercise = crud_workout_log_exercises.update_workout_log_exercise(id, workout_log_exercise, current_user.user_id, db)
    return updated_workout_log_exercise

# Delete a workout log exercise
@router.delete("/{id}")
def delete_workout_log_exercise(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_workout_log_exercises.delete_workout_log_exercise(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
