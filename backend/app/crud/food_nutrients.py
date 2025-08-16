from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import food_nutrient
from app.models.models import FoodNutrient, Food


def create_food_nutrient(food_nutrient: food_nutrient.FoodNutrientCreate, user_id: int, db: Session):
    food = (
        db.query(Food)
        .filter(Food.id == food_nutrient.food_id, (Food.user_id == user_id))
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    new_food_nutrient = FoodNutrient(**food_nutrient.model_dump(exclude_unset=True))
    db.add(new_food_nutrient)
    db.commit()
    db.refresh(new_food_nutrient)

    return new_food_nutrient

def get_food_nutrients(limit: int,
                       skip: int,
                       user_id: int,
                       db: Session):
    food_nutrients = (
        db.query(FoodNutrient)
        .join(Food, FoodNutrient.food_id == Food.id)
        .filter((Food.user_id == None) | (Food.user_id == user_id))
        .limit(limit)
        .offset(skip)
        .all()
    )
    return food_nutrients

def get_food_nutrient(id: int, user_id: int, db: Session):
    food_nutrient = (
        db.query(FoodNutrient)
        .join(Food, FoodNutrient.food_id == Food.id)
        .filter(FoodNutrient.id == id,
                (Food.user_id == None) | (Food.user_id == user_id))
        .first()
    )
    return food_nutrient

def update_food_nutrient(id: int,
                         food_nutrient: food_nutrient.FoodNutrientCreate,
                         user_id: int,
                         db: Session):
    food_nutrient_row = (
        db.query(FoodNutrient)
        .join(Food, FoodNutrient.food_id == Food.id)
        .filter(FoodNutrient.id == id, Food.user_id == user_id)
        .first()
    )

    for key, value in food_nutrient.model_dump().items():
        setattr(food_nutrient_row, key, value)

    db.commit()
    db.refresh(food_nutrient_row)

    return food_nutrient_row

def delete_food_nutrient(id: int, user_id: int, db: Session):
    food_nutrient_row = (
        db.query(FoodNutrient)
        .join(Food, FoodNutrient.food_id == Food.id)
        .filter(FoodNutrient.id == id, Food.user_id == user_id)
        .first()
    )

    db.delete(food_nutrient_row)
    db.commit()
