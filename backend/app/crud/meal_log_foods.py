from sqlalchemy.orm import Session
from app.schemas import meal_log_food
from app.models.models import MealLogFood, Food, BrandedFood
from app.crud import meal_logs as crud_meal_logs


def create_meal_log_food(meal_log_food: meal_log_food.MealLogFoodCreate, db: Session):
    food = db.query(Food).filter(Food.id == meal_log_food.food_id).first()

    num_servings = meal_log_food.num_servings
    serving_size = meal_log_food.serving_size
    serving_unit = meal_log_food.serving_unit

    if num_servings is None or serving_size is None or serving_unit is None:
        branded_food = db.query(BrandedFood).filter(BrandedFood.food_id == food.id).first()
        if num_servings is None:
            num_servings = 1.0
        if serving_size is None:
            serving_size = branded_food.serving_size or 1.0
        if serving_unit is None:
            serving_unit = branded_food.serving_size_unit or "unit"

    new_meal_log_food = MealLogFood(**meal_log_food.model_dump(exclude_unset=True, 
                                                               exclude={"num_servings",
                                                                        "serving_size",
                                                                        "serving_unit"}),
                                    num_servings=num_servings,
                                    serving_size=serving_size,
                                    serving_unit=serving_unit,
                                    calories=food.calories * num_servings)
    db.add(new_meal_log_food)
    db.commit()
    db.refresh(new_meal_log_food)

    crud_meal_logs.recalculate_total_calories(meal_log_id=meal_log_food.meal_log_id, db=db)
    
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

    crud_meal_logs.recalculate_total_calories(meal_log_id=updated_meal_log_food.meal_log_id, db=db)

    return updated_meal_log_food

def delete_meal_log_food(id: int, db: Session):
    meal_log_food_query = db.query(MealLogFood).filter(MealLogFood.id == id)
    meal_log_food = meal_log_food_query.first()
    meal_log_food_query.delete(synchronize_session=False)
    db.commit()

    crud_meal_logs.recalculate_total_calories(meal_log_id=meal_log_food.meal_log_id, db=db)
