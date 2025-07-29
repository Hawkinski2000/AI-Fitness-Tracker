from pydantic import BaseModel
from typing import Optional


class WorkoutLogExercise(BaseModel):
    id: Optional[int] = None
    workout_log_id: Optional[int] = None
    exercise_id: Optional[int] = None
    num_sets: Optional[int] = None
