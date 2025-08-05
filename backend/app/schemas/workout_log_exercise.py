from pydantic import BaseModel, ConfigDict
from typing import Optional


class WorkoutLogExerciseBase(BaseModel):
    workout_log_id: int
    # exercise_id: int
    num_sets: Optional[int] = None

class WorkoutLogExerciseCreate(WorkoutLogExerciseBase):
    pass

class WorkoutLogExerciseResponse(WorkoutLogExerciseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
