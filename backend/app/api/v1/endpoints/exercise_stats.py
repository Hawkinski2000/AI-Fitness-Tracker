from fastapi import Response, status, APIRouter
from app.schemas.exercise_stats import ExerciseStats


router = APIRouter(prefix="/api/exercise-stats",
                   tags=['Exercise Stats'])

# Create an exercise stats entry
@router.post("/")
def create_exercise_stats(exercise_stats: ExerciseStats):
    # TODO
    return {"data": "exercise stats entry"}

# Get all exercise stats entries
@router.get("/")
def get_all_exercise_stats():
    # TODO
    return {"data": "exercise stats entries"}

# Get an exercise stats entry
@router.get("/{id}")
def get_exercise_stats(id: int):
    # TODO
    return {"data": "exercise stats entry"}

# Update an exercise stats entry
@router.put("/{id}")
def update_exercise_stats(id: int, exercise_stats: ExerciseStats):
    # TODO
    return {"data": "exercise stats entry"}

# Delete an exercise stats entry
@router.delete("/{id}")
def delete_exercise_stats(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
