from sqlalchemy.orm import Session
from app.models.models import MealLog


def get_meal_logs(db: Session):
    meal_logs = db.query(MealLog).all()
    
    return meal_logs
