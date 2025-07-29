from fastapi import Response, status, APIRouter
from app.schemas.mood_log import MoodLog


router = APIRouter(prefix="/mood-logs",
                   tags=['Mood Logs'])

# Create a mood log
@router.post("/")
def create_mood_log(mood_log: MoodLog):
    # TODO
    return {"data": "mood log"}

# Get all mood logs
@router.get("/")
def get_mood_logs():
    # TODO
    return {"data": "mood logs"}

# Get a mood log
@router.get("/{id}")
def get_mood_log(id: int):
    # TODO
    return {"data": "mood log"}

# Update a mood log
@router.put("/{id}")
def update_mood_log(id: int, mood_log: MoodLog):
    # TODO
    return {"data": "mood log"}

# Delete a mood log
@router.delete("/{id}")
def delete_mood_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
