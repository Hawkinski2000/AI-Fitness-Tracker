from sqlalchemy.orm import Session
from sqlalchemy import func
import json
from app.schemas import mood_log
from app.models.models import MoodLog


def create_mood_log(mood_log: mood_log.MoodLogCreate, db: Session):
    new_mood_log = MoodLog(**mood_log.model_dump())
    db.add(new_mood_log)
    db.commit()
    db.refresh(new_mood_log)
    return new_mood_log

def get_mood_logs(db: Session):
    mood_logs = db.query(MoodLog).all()
    return mood_logs

def get_mood_log(id: int, db: Session):
    mood_log = db.query(MoodLog).filter(MoodLog.id == id).first()
    return mood_log

def update_mood_log(id: int, mood_log: mood_log.MoodLogCreate, db: Session):
    mood_log_query = db.query(MoodLog).filter(MoodLog.id == id)
    mood_log_query.update(mood_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_mood_log = mood_log_query.first()
    return updated_mood_log

def delete_mood_log(id: int, db: Session):
    mood_log_query = db.query(MoodLog).filter(MoodLog.id == id)
    mood_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def get_mood_logs(user_id: int, days_back: int, db: Session):
    mood_logs = (
        db.query(MoodLog)
        .filter(MoodLog.user_id == user_id)
        .filter(MoodLog.log_date >= func.current_date() - days_back)
        .order_by(MoodLog.log_date)
        .all()
    )

    results = []
    for log in mood_logs:
        mood_log = {
            "date": log.log_date.isoformat(),
            "mood_score": log.mood_score,
            "notes": log.notes
        }

        results.append(mood_log)
    
    return json.dumps(results)
