from sqlalchemy.orm import Session
from app.schemas import meal_log_food_nutrient
from app.models.models import MealLogFoodNutrient


def create_meal_log_food_nutrient(meal_log_food_nutrient: meal_log_food_nutrient.MealLogFoodNutrientCreate, db: Session):
    new_meal_log_food_nutrient = MealLogFoodNutrient(**meal_log_food_nutrient.model_dump(exclude_unset=True))
    db.add(new_meal_log_food_nutrient)
    db.commit()
    db.refresh(new_meal_log_food_nutrient)
    return new_meal_log_food_nutrient

def get_meal_log_food_nutrients(db: Session):
    meal_log_food_nutrients = db.query(MealLogFoodNutrient).all()
    return meal_log_food_nutrients

def get_meal_log_food_nutrient(id: int, db: Session):
    meal_log_food_nutrient = db.query(MealLogFoodNutrient).filter(MealLogFoodNutrient.id == id).first()
    return meal_log_food_nutrient

def update_meal_log_food_nutrient(id: int, meal_log_food_nutrient: meal_log_food_nutrient.MealLogFoodNutrientCreate, db: Session):
    meal_log_food_nutrient_query = db.query(MealLogFoodNutrient).filter(MealLogFoodNutrient.id == id)
    meal_log_food_nutrient_query.update(meal_log_food_nutrient.model_dump(), synchronize_session=False)
    db.commit()
    updated_meal_log_food_nutrient = meal_log_food_nutrient_query.first()
    return updated_meal_log_food_nutrient

def delete_meal_log_food_nutrient(id: int, db: Session):
    meal_log_food_nutrient_query = db.query(MealLogFoodNutrient).filter(MealLogFoodNutrient.id == id)
    meal_log_food_nutrient_query.delete(synchronize_session=False)
    db.commit()
