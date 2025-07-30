from fastapi import Response, status, APIRouter
from app.schemas.exercise_set import ExerciseSet


router = APIRouter(prefix="/exercise-sets",
                   tags=['Exercise Sets'])

# Create an exercise set
@router.post("/")
def create_exercise_set(exercise_set: ExerciseSet):
    # TODO
    return {"data": "exercise set"}

# Get all exercise sets
@router.get("/")
def get_exercise_sets():
    # TODO
    return {"data": "exercise sets"}

# Get an exercise set
@router.get("/{id}")
def get_exercise_set(id: int):
    # TODO
    return {"data": "exercise set"}

# Update an exercise set
@router.put("/{id}")
def update_exercise_set(id: int, exercise_set: ExerciseSet):
    # TODO
    return {"data": "exercise set"}

# Delete an exercise set
@router.delete("/{id}")
def delete_exercise_set(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
