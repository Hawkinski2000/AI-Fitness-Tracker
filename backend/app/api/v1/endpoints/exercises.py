from fastapi import Response, status, APIRouter
from app.schemas.exercise import Exercise


router = APIRouter(prefix="/exercises",
                   tags=['Exercises'])

# Create an exercise
@router.post("/")
def create_exercise(exercise: Exercise):
    # TODO
    return {"data": "exercise"}

# Get all exercises
@router.get("/")
def get_exercises():
    # TODO
    return {"data": "exercises"}

# Get an exercise
@router.get("/{id}")
def get_exercise(id: int):
    # TODO
    return {"data": "exercise"}

# Update an exercise
@router.put("/{id}")
def update_exercise(id: int, exercise: Exercise):
    # TODO
    return {"data": "exercise"}

# Delete an exercise
@router.delete("/{id}")
def delete_exercise(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
