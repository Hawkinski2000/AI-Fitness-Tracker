from sqlalchemy.orm import Session
from app.schemas import sleep_log
from app.models.models import SleepLog


def create_sleep_log(sleep_log: sleep_log.SleepLogCreate, db: Session):
    new_sleep_log = SleepLog(**sleep_log.model_dump())
    db.add(new_sleep_log)
    db.commit()
    db.refresh(new_sleep_log)
    return new_sleep_log

def get_sleep_logs(db: Session):
    sleep_logs = db.query(SleepLog).all()
    return sleep_logs

def get_sleep_log(id: int, db: Session):
    sleep_log = db.query(SleepLog).filter(SleepLog.id == id).first()
    return sleep_log

def update_sleep_log(id: int, sleep_log: sleep_log.SleepLogCreate, db: Session):
    sleep_log_query = db.query(SleepLog).filter(SleepLog.id == id)
    sleep_log_query.update(sleep_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_sleep_log = sleep_log_query.first()
    return updated_sleep_log

def delete_sleep_log(id: int, db: Session):
    sleep_log_query = db.query(SleepLog).filter(SleepLog.id == id)
    sleep_log_query.delete(synchronize_session=False)
    db.commit()
