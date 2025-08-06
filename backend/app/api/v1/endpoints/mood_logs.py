from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import mood_log
from app.crud import mood_logs as crud_mood_logs


router = APIRouter(prefix="/mood-logs",
                   tags=['Mood Logs'])

# Create a mood log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=mood_log.MoodLogResponse)
def create_mood_log(mood_log: mood_log.MoodLogCreate, db: Session = Depends(get_db)):
    new_mood_log = crud_mood_logs.create_mood_log(mood_log, db)
    return new_mood_log

# Get all mood logs
@router.get("/", response_model=list[mood_log.MoodLogResponse])
def get_mood_logs(db: Session = Depends(get_db)):
    mood_logs = crud_mood_logs.get_mood_logs(db)
    return mood_logs

# Get a mood log
@router.get("/{id}", response_model=mood_log.MoodLogResponse)
def get_mood_log(id: int, db: Session = Depends(get_db)):
    mood_log = crud_mood_logs.get_mood_log(id, db)
    return mood_log

# Update a mood log
@router.put("/{id}", response_model=mood_log.MoodLogResponse)
def update_mood_log(id: int, mood_log: mood_log.MoodLogCreate, db: Session = Depends(get_db)):
    updated_mood_log = crud_mood_logs.update_mood_log(id, mood_log, db)
    return updated_mood_log

# Delete a mood log
@router.delete("/{id}")
def delete_mood_log(id: int, db: Session = Depends(get_db)):
    crud_mood_logs.delete_mood_log(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
