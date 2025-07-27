from fastapi import Response, status, APIRouter
from app.schemas.mood_log_stats import MoodLogStats


router = APIRouter(prefix="/mood-log-stats",
                   tags=['Mood Log Stats'])

# Create a mood log stats entry
@router.post("/")
def create_mood_log_stats(mood_log_stats: MoodLogStats):
    # TODO
    return {"data": "mood log stats entry"}

# Get all mood log stats entries
@router.get("/")
def get_all_mood_log_stats():
    # TODO
    return {"data": "mood log stats entries"}

# Get a mood log stats entry
@router.get("/{id}")
def get_mood_log_stats(id: int):
    # TODO
    return {"data": "mood log stats entry"}

# Update a mood log stats entry
@router.put("/{id}")
def update_mood_log_stats(id: int, mood_log_stats: MoodLogStats):
    # TODO
    return {"data": "mood log stats entry"}

# Delete a mood log stats entry
@router.delete("/{id}")
def delete_mood_log_stats(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
