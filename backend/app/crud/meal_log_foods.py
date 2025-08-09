from sqlalchemy.orm import Session, joinedload
from typing import List
import json
from app.schemas import meal_log_food
from app.models.models import MealLogFood, Food, BrandedFood, MealLogFoodNutrient, FoodNutrient
from app.crud import meal_logs as crud_meal_logs


def create_meal_log_food(meal_log_food: meal_log_food.MealLogFoodCreate, db: Session):
    food = db.query(Food).filter(Food.id == meal_log_food.food_id).first()

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

    crud_meal_logs.recalculate_meal_log_calories(meal_log_id=updated_meal_log_food.meal_log_id, db=db)
    crud_meal_logs.recalculate_meal_log_nutrients(meal_log_id=meal_log_food.meal_log_id, db=db)

    return updated_meal_log_food

def delete_meal_log_food(id: int, db: Session):
    meal_log_food_query = db.query(MealLogFood).filter(MealLogFood.id == id)
    meal_log_food = meal_log_food_query.first()
    meal_log_food_query.delete(synchronize_session=False)
    db.commit()

    crud_meal_logs.recalculate_meal_log_calories(meal_log_id=meal_log_food.meal_log_id, db=db)
    crud_meal_logs.recalculate_meal_log_nutrients(meal_log_id=meal_log_food.meal_log_id, db=db)

# ----------------------------------------------------------------------------

def get_meal_log_foods(meal_log_ids: List[int], view_nutrients: bool, db: Session):
    query = (
        db.query(MealLogFood)
        .filter(MealLogFood.meal_log_id.in_(meal_log_ids))
        .options(
            joinedload(MealLogFood.food)
        )
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
