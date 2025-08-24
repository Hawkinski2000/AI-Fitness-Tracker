from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import json
from app.schemas import weight_log
from app.models.models import WeightLog


def create_weight_log(weight_log: weight_log.WeightLogCreate, user_id: int, db: Session):
    new_weight_log = WeightLog(**weight_log.model_dump(), user_id=user_id)
    db.add(new_weight_log)
    db.commit()
    db.refresh(new_weight_log)
    return new_weight_log

def get_weight_logs(user_id: int, db: Session):
    weight_logs = db.query(WeightLog).filter(WeightLog.user_id == user_id).all()
    return weight_logs

def get_weight_log(id: int, user_id: int, db: Session):
    weight_log = db.query(WeightLog).filter(WeightLog.id == id, WeightLog.user_id == user_id).first()

    if not weight_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Weight log not found")

    return weight_log

def update_weight_log(id: int, weight_log: weight_log.WeightLogCreate, user_id: int, db: Session):
    weight_log_query = db.query(WeightLog).filter(WeightLog.id == id, WeightLog.user_id == user_id)

    if not weight_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Weight log not found")

    weight_log_query.update(weight_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_weight_log = weight_log_query.first()
    return updated_weight_log

def delete_weight_log(id: int, user_id: int, db: Session):
    weight_log_query = db.query(WeightLog).filter(WeightLog.id == id, WeightLog.user_id == user_id)

    if not weight_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Weight log not found")

    weight_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def get_weight_log_summaries(user_id: int, days_back: int, db: Session):
    weight_logs = (
        db.query(WeightLog)
        .filter(WeightLog.user_id == user_id)
        .filter(WeightLog.log_date >= func.current_date() - days_back)
        .order_by(WeightLog.log_date)
        .all()
    )

    results = []
    for log in weight_logs:
        weight_log = {
            "date": log.log_date.isoformat(),
            "weight": log.weight,
            "unit": log.unit
        }

        results.append(weight_log)

    return json.dumps(results)
