from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import exercise
from app.crud import exercises as crud_exercises


router = APIRouter(prefix="/exercises",
                   tags=['Exercises'])

# Create an exercise
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=exercise.ExerciseResponse)
def create_exercise(exercise: exercise.ExerciseCreate, db: Session = Depends(get_db)):
    new_exercise = crud_exercises.create_exercise(exercise, db)
    return new_exercise

# Get all exercises
@router.get("/", response_model=list[exercise.ExerciseResponse])
def get_exercises(db: Session = Depends(get_db),
                  limit: int = 10,
                  skip: int = 0,
                  search: Optional[str] = ""):
    exercises = crud_exercises.get_exercises(db, limit, skip, search)
    return exercises

# Get an exercise
@router.get("/{id}", response_model=exercise.ExerciseResponse)
def get_exercise(id: int, db: Session = Depends(get_db)):
    exercise = crud_exercises.get_exercise(id, db)
    return exercise

# Update an exercise
@router.put("/{id}", response_model=exercise.ExerciseResponse)
def update_exercise(id: int, exercise: exercise.ExerciseCreate, db: Session = Depends(get_db)):
    updated_exercise = crud_exercises.update_exercise(id, exercise, db)
    return updated_exercise

# Delete an exercise
@router.delete("/{id}")
def delete_exercise(id: int, db: Session = Depends(get_db)):
    crud_exercises.delete_exercise(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
