from sqlalchemy.orm import Session
from app.schemas import meal_log_nutrient
from app.models.models import MealLogNutrient


def create_meal_log_nutrient(meal_log_nutrient: meal_log_nutrient.MealLogNutrientCreate, db: Session):
    new_meal_log_nutrient = MealLogNutrient(**meal_log_nutrient.model_dump(exclude_unset=True))
    db.add(new_meal_log_nutrient)
    db.commit()
    db.refresh(new_meal_log_nutrient)
    return new_meal_log_nutrient

def get_meal_log_nutrients(db: Session):
    meal_log_nutrients = db.query(MealLogNutrient).all()
    return meal_log_nutrients

def get_meal_log_nutrient(id: int, db: Session):
    meal_log_nutrient = db.query(MealLogNutrient).filter(MealLogNutrient.id == id).first()
    return meal_log_nutrient

def update_meal_log_nutrient(id: int, meal_log_nutrient: meal_log_nutrient.MealLogNutrientCreate, db: Session):
    meal_log_nutrient_query = db.query(MealLogNutrient).filter(MealLogNutrient.id == id)
    meal_log_nutrient_query.update(meal_log_nutrient.model_dump(), synchronize_session=False)
    db.commit()
    updated_meal_log_nutrient = meal_log_nutrient_query.first()
    return updated_meal_log_nutrient

def delete_meal_log_nutrient(id: int, db: Session):
    meal_log_nutrient_query = db.query(MealLogNutrient).filter(MealLogNutrient.id == id)
    meal_log_nutrient_query.delete(synchronize_session=False)
    db.commit()
