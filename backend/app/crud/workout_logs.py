from sqlalchemy.orm import Session
from sqlalchemy import func
import json
from app.schemas import workout_log
from app.models.models import WorkoutLog


def create_workout_log(workout_log: workout_log.WorkoutLogCreate, db: Session):
    new_workout_log = WorkoutLog(**workout_log.model_dump())
    db.add(new_workout_log)
    db.commit()
    db.refresh(new_workout_log)
    return new_workout_log

def get_workout_logs(db: Session):
    workout_logs = db.query(WorkoutLog).all()
    return workout_logs

def get_workout_log(id: int, db: Session):
    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == id).first()
    return workout_log

def update_workout_log(id: int, workout_log: workout_log.WorkoutLogCreate, db: Session):
    workout_log_query = db.query(WorkoutLog).filter(WorkoutLog.id == id)
    workout_log_query.update(workout_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_workout_log = workout_log_query.first()
    return updated_workout_log

def delete_workout_log(id: int, db: Session):
    workout_log_query = db.query(WorkoutLog).filter(WorkoutLog.id == id)
    workout_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def get_workout_log_summaries(user_id: int, days_back: int, db: Session):
    workout_logs = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.user_id == user_id)
        .filter(WorkoutLog.log_date >= func.current_date() - days_back)
        .all()
    )

    workout_log_summaries = []

    for log in workout_logs:
        workout_log_summary = {
            "workout_log_id": log.id,
            "date": log.log_date.isoformat(),
            "workout_type": log.workout_type,
            "total_num_sets": log.total_num_sets,
            "total_calories_burned": log.total_calories_burned
        }

        workout_log_summaries.append(workout_log_summary)

    return json.dumps(workout_log_summaries)
