from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import exercise_set, token
from app.crud import exercise_sets as crud_exercise_sets
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/exercise-sets",
                   tags=['Exercise Sets'])

# Create an exercise set
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=exercise_set.ExerciseSetResponse)
def create_exercise_set(exercise_set: exercise_set.ExerciseSetCreate,
                        current_user: token.TokenData = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    new_exercise_set = crud_exercise_sets.create_exercise_set(exercise_set, current_user.user_id, db)
    return new_exercise_set

# Get all exercise sets
@router.get("/", response_model=list[exercise_set.ExerciseSetResponse])
def get_exercise_sets(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_sets = crud_exercise_sets.get_exercise_sets(current_user.user_id, db)
    return exercise_sets

# Get an exercise set
@router.get("/{id}", response_model=exercise_set.ExerciseSetResponse)
def get_exercise_set(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    exercise_set = crud_exercise_sets.get_exercise_set(id, current_user.user_id, db)
    return exercise_set

# Update an exercise set
@router.put("/{id}", response_model=exercise_set.ExerciseSetResponse)
def update_exercise_set(id: int,
                        exercise_set: exercise_set.ExerciseSetCreate,
                        current_user: token.TokenData = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    updated_exercise_set = crud_exercise_sets.update_exercise_set(id, exercise_set, current_user.user_id, db)
    return updated_exercise_set

# Delete an exercise set
@router.delete("/{id}")
def delete_exercise_set(id: int,
                        current_user: token.TokenData = Depends(get_current_user),
                        db: Session = Depends(get_db)):
    crud_exercise_sets.delete_exercise_set(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
