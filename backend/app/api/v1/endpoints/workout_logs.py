from fastapi import Response, status, APIRouter
from app.schemas.workout_log import WorkoutLog


router = APIRouter(prefix="/workout-logs",
                   tags=['Workout Logs'])

# Create a workout log
@router.post("/")
def create_workout_log(workout_log: WorkoutLog):
    # TODO
    return {"data": "workout log"}

# Get all workout logs
@router.get("/")
def get_workout_logs():
    # TODO
    return {"data": "workout logs"}

# Get a workout log
@router.get("/{id}")
def get_workout_log(id: int):
    # TODO
    return {"data": "workout log"}

# Update a workout log
@router.put("/{id}")
def update_workout_log(id: int, workout_log: WorkoutLog):
    # TODO
    return {"data": "workout log"}

# Delete a workout log
@router.delete("/{id}")
def delete_workout_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
