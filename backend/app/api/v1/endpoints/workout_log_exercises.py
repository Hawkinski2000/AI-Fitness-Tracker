from fastapi import Response, status, APIRouter
from app.schemas.workout_log_exercise import WorkoutLogExercise


router = APIRouter(prefix="/workout-log-exercises",
                   tags=['Workout Log Exercises'])

# Create a workout log exercise
@router.post("/")
def create_workout_log_exercise(workout_log_exercise: WorkoutLogExercise):
    # TODO
    return {"data": "workout log exercise"}

# Get all workout log exercises
@router.get("/")
def get_workout_log_exercises():
    # TODO
    return {"data": "workout log exercises"}

# Get a workout log exercise
@router.get("/{id}")
def get_workout_log_exercise(id: int):
    # TODO
    return {"data": "workout log exercise"}

# Update a workout log exercise
@router.put("/{id}")
def update_workout_log_exercise(id: int, workout_log_exercise: WorkoutLogExercise):
    # TODO
    return {"data": "workout log exercise"}

# Delete a workout log exercise
@router.delete("/{id}")
def delete_workout_log_exercise(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
