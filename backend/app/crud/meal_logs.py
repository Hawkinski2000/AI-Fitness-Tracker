from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from collections import defaultdict
import json
from app.schemas import meal_log
from app.models.models import MealLog, MealLogFood, MealLogNutrient, MealLogFoodNutrient


def create_meal_log(meal_log: meal_log.MealLogCreate, user_id: int, db: Session):
    new_meal_log = MealLog(**meal_log.model_dump(), user_id=user_id)
    db.add(new_meal_log)
    db.commit()
    db.refresh(new_meal_log)
    return new_meal_log

def get_meal_logs(user_id: int, db: Session):
    meal_logs = db.query(MealLog).filter(MealLog.user_id == user_id).all()
    return meal_logs

def get_meal_log(id: int, user_id: int, db: Session):
    meal_log = db.query(MealLog).filter(MealLog.id == id, MealLog.user_id == user_id).first()

    if not meal_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Meal log not found")

    return meal_log

def update_meal_log(id: int, meal_log: meal_log.MealLogCreate, user_id: int, db: Session):
    meal_log_query = db.query(MealLog).filter(MealLog.id == id, MealLog.user_id == user_id)

    if not meal_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Meal log not found")

    meal_log_query.update(meal_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_meal_log = meal_log_query.first()
    return updated_meal_log

def delete_meal_log(id: int, user_id: int, db: Session):
    meal_log_query = db.query(MealLog).filter(MealLog.id == id, MealLog.user_id == user_id)

    if not meal_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Meal log not found")

    meal_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def recalculate_meal_log_calories(meal_log_id: int, db: Session):
    total_calories = db.query(func.sum(MealLogFood.calories)) \
              .filter(MealLogFood.meal_log_id == meal_log_id) \
              .scalar()

    meal_log_query = db.query(MealLog).filter(MealLog.id == meal_log_id)
    meal_log_query.update({MealLog.total_calories: total_calories}, synchronize_session=False)
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

# ----------------------------------------------------------------------------

def get_meal_log_summaries(user_id: int, days_back: int, view_micronutrients: bool, db: Session):
    meal_logs = (
        db.query(MealLog)
        .filter(MealLog.user_id == user_id)
        .filter(MealLog.log_date >= func.current_date() - days_back)
        .options(
            joinedload(MealLog.meal_log_nutrients)
            .joinedload(MealLogNutrient.nutrient)
        )
        .order_by(MealLog.log_date)
        .all()
    )

    meal_log_summaries = []

    macronutrients = {"Energy", "Protein", "Total lipid (fat)", "Carbohydrate, by difference"}

    for log in meal_logs:
        nutrients_list = []
        for n in log.meal_log_nutrients:
            if view_micronutrients or n.nutrient.name in macronutrients:
                nutrients_list.append({
                    "name": n.nutrient.name,
                    "amount": f"{n.amount:.1f}",
                    "unit": n.nutrient.unit_name
                })

        meal_log_summary = {
            "meal_log_id": log.id,
            "date": log.log_date.isoformat(),
            "nutrients": nutrients_list
        }

        meal_log_summaries.append(meal_log_summary)

    return json.dumps(meal_log_summaries)
