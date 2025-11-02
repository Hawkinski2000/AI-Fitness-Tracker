from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.schemas import workout_log_exercise, exercise, exercise_set


class WorkoutLogBase(BaseModel):
    log_date: datetime
    workout_type: Optional[str] = None

class WorkoutLogCreate(WorkoutLogBase):
    pass

class WorkoutLogResponse(WorkoutLogBase):
    id: int
    user_id: int
    total_num_sets: int
    total_calories_burned: Optional[int] = None
    workout_log_exercises: Optional[list[workout_log_exercise.WorkoutLogExerciseResponse]] = None
    exercises: Optional[list[exercise.ExerciseResponse]] = None
    exercise_sets: Optional[list[exercise_set.ExerciseSetResponse]] = None

    model_config = ConfigDict(from_attributes=True)
