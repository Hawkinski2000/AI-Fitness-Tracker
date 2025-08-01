from sqlalchemy.orm import Session
from sqlalchemy import func
from collections import defaultdict
from app.schemas import meal_log
from app.models.models import MealLog, MealLogFood, MealLogNutrient, MealLogFoodNutrient


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

def recalculate_meal_log_calories(meal_log_id: int, db: Session):
    total_calories = db.query(func.sum(MealLogFood.calories)) \
              .filter(MealLogFood.meal_log_id == meal_log_id) \
              .scalar()

    meal_log_query = db.query(MealLog).filter(MealLog.id == meal_log_id)
    meal_log_query.update({"total_calories":total_calories}, synchronize_session=False)
    db.commit()

def recalculate_meal_log_nutrients(meal_log_id: int, db: Session):
    # Get the nutrient_id and amount from all meal_log_food_nutrient rows associated with the meal_log.
    nutrients = (
        db.query(
            MealLogFoodNutrient.nutrient_id,
            MealLogFoodNutrient.amount
        )
        .join(MealLogFood)
        .filter(MealLogFood.meal_log_id == meal_log_id)
        .all()
    )

    # Accumulate nutrient totals for the meal_log into a dict.
    nutrient_totals = defaultdict(float)
    for nutrient_id, amount in nutrients:
        nutrient_totals[nutrient_id] += amount

    # Delete all previous meal_log_nutrient rows associated with the meal_log.
    meal_log_nutrients_query = db.query(MealLogNutrient).filter(MealLogNutrient.meal_log_id == meal_log_id)
    meal_log_nutrients_query.delete(synchronize_session=False)

    # Create new meal_log_nutrient rows using the nutrient totals in the dict.
    new_meal_log_nutrients = []
    for nutrient_id, amount in nutrient_totals.items():
        new_meal_log_nutrient = MealLogNutrient(
            meal_log_id=meal_log_id,
            nutrient_id=nutrient_id,
            amount=amount
        )
        new_meal_log_nutrients.append(new_meal_log_nutrient)

    db.add_all(new_meal_log_nutrients)
    db.commit()
