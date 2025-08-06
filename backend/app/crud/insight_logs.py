from sqlalchemy.orm import Session
from app.schemas import insight_log
from app.models.models import InsightLog


def create_insight_log(insight_log: insight_log.InsightLogCreate, db: Session):
    new_insight_log = InsightLog(**insight_log.model_dump(exclude_unset=True))
    db.add(new_insight_log)
    db.commit()
    db.refresh(new_insight_log)
    return new_insight_log

def get_insight_logs(db: Session):
    insight_logs = db.query(InsightLog).all()
    return insight_logs

def get_insight_log(id: int, db: Session):
    insight_log = db.query(InsightLog).filter(InsightLog.id == id).first()
    return insight_log

def update_insight_log(id: int, insight_log: insight_log.InsightLogCreate, db: Session):
    insight_log_query = db.query(InsightLog).filter(InsightLog.id == id)
    insight_log_query.update(insight_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_insight_log = insight_log_query.first()
    return updated_insight_log

def delete_insight_log(id: int, db: Session):
    insight_log_query = db.query(InsightLog).filter(InsightLog.id == id)
    insight_log_query.delete(synchronize_session=False)
    db.commit()
