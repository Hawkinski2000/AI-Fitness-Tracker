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
    greatest_one_rep_max: Optional[float] = None
    unit: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class WorkoutLogExerciseBulkAction(BaseModel):
    action: str
    ids: list[int]
    target_workout_log_id: Optional[int] = None
