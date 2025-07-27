from pydantic import BaseModel
from typing import Optional


class MoodLogStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    min_mood_score: int
    max_mood_score: int
    avg_mood_score: float
