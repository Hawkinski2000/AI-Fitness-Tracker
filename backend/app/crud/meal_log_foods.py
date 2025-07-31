from sqlalchemy.orm import Session
from app.schemas import meal_log_food
from app.models.models import MealLogFood


def create_meal_log_food(meal_log_food: meal_log_food.MealLogFoodCreate, db: Session):
    new_meal_log_food = MealLogFood(**meal_log_food.model_dump(exclude_unset=True))
    db.add(new_meal_log_food)
    db.commit()
    db.refresh(new_meal_log_food)
    return new_meal_log_food

def get_meal_log_foods(db: Session):
    meal_log_foods = db.query(MealLogFood).all()
    return meal_log_foods

def get_meal_log_food(id: int, db: Session):
    meal_log_food = db.query(MealLogFood).filter(MealLogFood.id == id).first()
    return meal_log_food

def update_meal_log_food(id: int, meal_log_food: meal_log_food.MealLogFoodCreate, db: Session):
    meal_log_food_query = db.query(MealLogFood).filter(MealLogFood.id == id)
    meal_log_food_query.update(meal_log_food.model_dump(), synchronize_session=False)
    db.commit()
    updated_meal_log_food = meal_log_food_query.first()
    return updated_meal_log_food

def delete_meal_log_food(id: int, db: Session):
    meal_log_food_query = db.query(MealLogFood).filter(MealLogFood.id == id)
    meal_log_food_query.delete(synchronize_session=False)
    db.commit()
