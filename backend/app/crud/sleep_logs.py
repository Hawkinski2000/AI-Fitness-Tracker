from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import json
from app.schemas import sleep_log
from app.models.models import SleepLog


def create_sleep_log(sleep_log: sleep_log.SleepLogCreate, user_id: int, db: Session):
    new_sleep_log = SleepLog(**sleep_log.model_dump(), user_id=user_id)
    db.add(new_sleep_log)
    db.commit()
    db.refresh(new_sleep_log)
    return new_sleep_log

def get_sleep_logs(user_id: int, db: Session):
    sleep_logs = db.query(SleepLog).filter(SleepLog.user_id == user_id).all()
    return sleep_logs

def get_sleep_log(id: int, user_id: int, db: Session):
    sleep_log = db.query(SleepLog).filter(SleepLog.id == id, SleepLog.user_id == user_id).first()

    if not sleep_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Sleep log not found")

    return sleep_log

def update_sleep_log(id: int, sleep_log: sleep_log.SleepLogCreate, user_id: int, db: Session):
    sleep_log_query = db.query(SleepLog).filter(SleepLog.id == id, SleepLog.user_id == user_id)

    if not sleep_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Sleep log not found")

    sleep_log_query.update(sleep_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_sleep_log = sleep_log_query.first()
    return updated_sleep_log

def delete_sleep_log(id: int, user_id: int, db: Session):
    sleep_log_query = db.query(SleepLog).filter(SleepLog.id == id, SleepLog.user_id == user_id)

    if not sleep_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Sleep log not found")

    sleep_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def get_sleep_log_summaries(user_id: int, days_back: int, db: Session):
    sleep_logs = (
        db.query(SleepLog)
        .filter(SleepLog.user_id == user_id)
        .filter(SleepLog.log_date >= func.current_date() - days_back)
        .order_by(SleepLog.log_date)
        .all()
    )

    results = []
    for log in sleep_logs:
        sleep_log = {
            "date": log.log_date.isoformat(),
            "time_to_bed": log.time_to_bed.isoformat(),
            "time_awake": log.time_awake.isoformat(),
            "duration": log.duration,
            "sleep_score": log.sleep_score,
            "notes": log.notes
        }

        results.append(sleep_log)

    return json.dumps(results)
