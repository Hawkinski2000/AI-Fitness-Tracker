from pydantic import BaseModel, ConfigDict
from typing import Optional


class WorkoutLogExerciseBase(BaseModel):
    workout_log_id: int
    exercise_id: int

class WorkoutLogExerciseCreate(WorkoutLogExerciseBase):
    pass

class WorkoutLogExerciseResponse(WorkoutLogExerciseBase):
    id: int
    num_sets: int

    model_config = ConfigDict(from_attributes=True)
