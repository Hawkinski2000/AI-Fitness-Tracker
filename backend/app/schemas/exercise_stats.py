from pydantic import BaseModel
from typing import Optional


class ExerciseStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    exercise_id: int
    num_workouts: int
    min_weight: float
    max_weight: float
    total_weight: float
    avg_weight: float
    min_sets: int
    max_sets: int
    total_sets: int
    avg_sets: float
    min_reps: int
    max_reps: int
    total_reps: int
    avg_reps: float
    min_one_rep_max: float
    max_one_rep_max: float
    avg_one_rep_max: float
    min_duration: int
    max_duration: int
    total_duration: int
    avg_duration: float
    min_rest_time: int
    max_rest_time: int
    total_rest_time: int
    avg_rest_time: float
