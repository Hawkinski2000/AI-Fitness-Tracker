from sqlalchemy.orm import Session
from sqlalchemy import func
from app.schemas import meal_log
from app.models.models import MealLog, MealLogFood


def create_meal_log(meal_log: meal_log.MealLogCreate, db: Session):
    new_meal_log = MealLog(**meal_log.model_dump())
    db.add(new_meal_log)
    db.commit()
    db.refresh(new_meal_log)
    return new_meal_log

def get_meal_logs(db: Session):
    meal_logs = db.query(MealLog).all()
    return meal_logs

def get_meal_log(id: int, db: Session):
    meal_log = db.query(MealLog).filter(MealLog.id == id).first()
    return meal_log

def update_meal_log(id: int, meal_log: meal_log.MealLogCreate, db: Session):
    meal_log_query = db.query(MealLog).filter(MealLog.id == id)
    meal_log_query.update(meal_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_meal_log = meal_log_query.first()
    return updated_meal_log

def delete_meal_log(id: int, db: Session):
    meal_log_query = db.query(MealLog).filter(MealLog.id == id)
    meal_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def recalculate_total_calories(meal_log_id: int, db: Session):
    total_calories = db.query(func.sum(MealLogFood.calories)) \
              .filter(MealLogFood.meal_log_id == meal_log_id) \
              .scalar()

    meal_log_query = db.query(MealLog).filter(MealLog.id == meal_log_id)
    meal_log_query.update({"total_calories":total_calories}, synchronize_session=False)
    db.commit()
