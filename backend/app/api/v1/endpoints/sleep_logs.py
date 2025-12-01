from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from app.core.db import get_db
from app.schemas import sleep_log, token
from app.crud import sleep_logs as crud_sleep_logs
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/sleep-logs",
                   tags=['Sleep Logs'])

# Create a sleep log
@router.post("", status_code=status.HTTP_201_CREATED, response_model=sleep_log.SleepLogResponse)
def create_sleep_log(sleep_log: sleep_log.SleepLogCreate,
                     current_user: token.TokenData = Depends(get_current_user),
                     db: Session = Depends(get_db)):
    new_sleep_log = crud_sleep_logs.create_sleep_log(sleep_log, current_user.user_id, db)
    return new_sleep_log

# Get all sleep logs
@router.get("", response_model=list[sleep_log.SleepLogResponse])
def get_sleep_logs(date: Optional[str] = None,
                   current_user: token.TokenData = Depends(get_current_user),
                   db: Session = Depends(get_db)):
    sleep_logs = crud_sleep_logs.get_sleep_logs(date, current_user.user_id, db)
    return sleep_logs

# Get a sleep log
@router.get("/{id}", response_model=sleep_log.SleepLogResponse)
def get_sleep_log(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    sleep_log = crud_sleep_logs.get_sleep_log(id, current_user.user_id, db)
    return sleep_log

# Update a sleep log
@router.put("/{id}", response_model=sleep_log.SleepLogResponse)
def update_sleep_log(id: int, sleep_log: sleep_log.SleepLogCreate, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_sleep_log = crud_sleep_logs.update_sleep_log(id, sleep_log, current_user.user_id, db)
    return updated_sleep_log

# Delete a sleep log
@router.delete("/{id}")
def delete_sleep_log(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_sleep_logs.delete_sleep_log(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
