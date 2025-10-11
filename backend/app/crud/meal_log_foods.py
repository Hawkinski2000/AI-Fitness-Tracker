from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
import json
from app.schemas import meal_log_food
from app.models.models import MealLog, MealLogFood, Food, BrandedFood, MealLogFoodNutrient, FoodNutrient
from app.crud import meal_logs as crud_meal_logs


def create_meal_log_food(meal_log_food: meal_log_food.MealLogFoodCreate, user_id: int, db: Session):
    meal_log = (
        db.query(MealLog)
        .filter(MealLog.id == meal_log_food.meal_log_id, MealLog.user_id == user_id)
        .first()
    )

    if not meal_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal log not found"
        )
    
    food = (
        db.query(Food)
        .filter(Food.id == meal_log_food.food_id,
                (Food.user_id == None) | (Food.user_id == user_id))
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    num_servings = meal_log_food.num_servings
    serving_size = meal_log_food.serving_size
    serving_unit = meal_log_food.serving_unit

    branded_food = db.query(BrandedFood).filter(BrandedFood.food_id == food.id).first()
    if num_servings is None or serving_size is None or serving_unit is None:
        if num_servings is None:
            num_servings = 1.0
        if serving_size is None:
            serving_size = branded_food.serving_size or 1.0
        if serving_unit is None:
            serving_unit = branded_food.serving_size_unit or "unit"

    if food.calories is None:
        calories = None
    else:
        calories = num_servings * serving_size * food.calories / branded_food.serving_size or 1.0

    new_meal_log_food = MealLogFood(**meal_log_food.model_dump(exclude_unset=True, 
                                                               exclude={"num_servings",
                                                                        "serving_size",
                                                                        "serving_unit"}),
                                    num_servings=num_servings,
                                    serving_size=serving_size,
                                    serving_unit=serving_unit,
                                    calories=calories)
    db.add(new_meal_log_food)
    db.commit()
    db.refresh(new_meal_log_food)

    food_nutrients = db.query(FoodNutrient).filter(FoodNutrient.food_id == food.id).all()
    
    for food_nutrient in food_nutrients:
        new_meal_log_food_nutrient = MealLogFoodNutrient(meal_log_food_id=new_meal_log_food.id,
                                                         nutrient_id=food_nutrient.nutrient_id,
                                                         amount=num_servings * serving_size * \
                                                            food_nutrient.amount / branded_food.serving_size or 1.0)
        db.add(new_meal_log_food_nutrient)
    db.commit()

    crud_meal_logs.recalculate_meal_log_calories(meal_log_id=meal_log_food.meal_log_id, db=db)
    crud_meal_logs.recalculate_meal_log_nutrients(meal_log_id=meal_log_food.meal_log_id, db=db)
    
    return new_meal_log_food

def get_meal_log_foods(meal_log_id: int, user_id: int, db: Session):
    meal_log_foods = (
        db.query(MealLogFood)
        .join(MealLog, MealLogFood.meal_log_id == MealLog.id)
        .filter(MealLog.user_id == user_id,
                MealLogFood.meal_log_id == meal_log_id)
        .order_by(MealLogFood.created_at.asc())
        .all()
    )
    return meal_log_foods

def get_meal_log_food(id: int, user_id: int, db: Session):
    meal_log_food = (
        db.query(MealLogFood)
        .join(MealLog, MealLogFood.meal_log_id == MealLog.id)
        .filter(MealLogFood.id == id, MealLog.user_id == user_id)
        .first()
    )
    return meal_log_food

def update_meal_log_food(id: int, meal_log_food: meal_log_food.MealLogFoodUpdate, user_id: int, db: Session):
    if meal_log_food.meal_log_id:
        meal_log = (
            db.query(MealLog)
            .filter(MealLog.id == meal_log_food.meal_log_id, MealLog.user_id == user_id)
            .first()
        )

        if not meal_log:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meal log not found"
            )

    meal_log_food_row = (
        db.query(MealLogFood)
        .join(MealLog, MealLogFood.meal_log_id == MealLog.id)
        .filter(MealLogFood.id == id, MealLog.user_id == user_id)
        .first()
    )

    food = (
        db.query(Food)
        .filter(Food.id == meal_log_food_row.food_id,
                (Food.user_id == None) | (Food.user_id == user_id))
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    for key, value in meal_log_food.model_dump(exclude_unset=True).items():
        setattr(meal_log_food_row, key, value)

    db.commit()
    db.refresh(meal_log_food_row)

    num_servings = meal_log_food_row.num_servings
    serving_size = meal_log_food_row.serving_size

    branded_food = db.query(BrandedFood).filter(BrandedFood.food_id == food.id).first()

    if food.calories:
        calories = round(num_servings * serving_size * food.calories / branded_food.serving_size or 1.0)
        meal_log_food_row.calories = calories

    food_nutrients = db.query(FoodNutrient).filter(FoodNutrient.food_id == food.id).all()
    
    for food_nutrient in food_nutrients:
        food_nutrient.amount = num_servings * serving_size * food_nutrient.amount / branded_food.serving_size or 1.0

    db.commit()

    crud_meal_logs.recalculate_meal_log_calories(meal_log_id=meal_log_food_row.meal_log_id, db=db)
    crud_meal_logs.recalculate_meal_log_nutrients(meal_log_id=meal_log_food_row.meal_log_id, db=db)

    return meal_log_food_row

def delete_meal_log_food(id: int, user_id: int, db: Session):
    meal_log_food_row = (
        db.query(MealLogFood)
        .join(MealLog, MealLogFood.meal_log_id == MealLog.id)
        .filter(MealLogFood.id == id, MealLog.user_id == user_id)
        .first()
    )

    meal_log_id = meal_log_food_row.meal_log_id
    
    db.delete(meal_log_food_row)
    db.commit()

    crud_meal_logs.recalculate_meal_log_calories(meal_log_id=meal_log_id, db=db)
    crud_meal_logs.recalculate_meal_log_nutrients(meal_log_id=meal_log_id, db=db)

# ----------------------------------------------------------------------------

def get_meal_log_food_summaries(meal_log_ids: List[int], view_nutrients: bool, db: Session):
    query = (
        db.query(MealLogFood)
        .filter(MealLogFood.meal_log_id.in_(meal_log_ids))
        .options(
            joinedload(MealLogFood.food)
        )
        .order_by(MealLogFood.created_at)
    )
    
    if view_nutrients:
        query = query.options(
            joinedload(MealLogFood.meal_log_food_nutrients)
            .joinedload(MealLogFoodNutrient.nutrient)
        )

    meal_log_foods = query.all()

    results = []
    for mlf in meal_log_foods:
        food_entry = {
            "meal_log_id": mlf.meal_log_id,
            "description": mlf.food.description,
            "meal_type": mlf.meal_type,
            "num_servings": mlf.num_servings,
            "serving_size": mlf.serving_size,
            "serving_unit": mlf.serving_unit,
            "created_at": mlf.created_at.isoformat(),
            "calories": mlf.calories,
        }
        
        if view_nutrients:
            nutrients = []
            for n in mlf.meal_log_food_nutrients:
                nutrients.append({
                    "name": n.nutrient.name,
                    "amount": f"{n.amount:.1f}",
                    "unit": n.nutrient.unit_name
                })
            food_entry["nutrients"] = nutrients

        results.append(food_entry)

    return json.dumps(results)
