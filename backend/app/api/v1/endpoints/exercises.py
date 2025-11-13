from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import exercise, token
from app.crud import exercises as crud_exercises
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/exercises",
                   tags=['Exercises'])

# Create an exercise
@router.post("", status_code=status.HTTP_201_CREATED, response_model=exercise.ExerciseResponse)
def create_exercise(exercise: exercise.ExerciseCreate,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    new_exercise = crud_exercises.create_exercise(exercise, current_user.user_id, db)
    return new_exercise

# Get all exercises
@router.get("", response_model=exercise.ExerciseListResponse)
def get_exercises(limit: int = 10,
                  skip: int = 0,
                  search: Optional[str] = "",
                  current_user: token.TokenData = Depends(get_current_user),
                  db: Session = Depends(get_db)):
    if search:
        search = "%".join(search.split())
    
    exercise_search_results = crud_exercises.get_exercises(limit, skip, search, current_user.user_id, db)
    
    return exercise_search_results

# Get an exercise
@router.get("/{id}", response_model=exercise.ExerciseResponse)
def get_exercise(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise = crud_exercises.get_exercise(id, current_user.user_id, db)
    return exercise

# Update an exercise
@router.put("/{id}", response_model=exercise.ExerciseResponse)
def update_exercise(id: int,
                    exercise: exercise.ExerciseCreate,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    updated_exercise = crud_exercises.update_exercise(id, exercise, current_user.user_id, db)
    return updated_exercise

# Delete an exercise
@router.delete("/{id}")
def delete_exercise(id: int,
                    current_user: token.TokenData = Depends(get_current_user),
                    db: Session = Depends(get_db)):
    crud_exercises.delete_exercise(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
