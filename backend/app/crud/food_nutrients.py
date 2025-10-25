from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
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

def get_food_nutrients(food_id: int,
                       expand: list[str] | None,
                       user_id: int,
                       db: Session):
    query = (
        db.query(FoodNutrient)
        .join(Food, FoodNutrient.food_id == Food.id)
        .filter((Food.user_id == None) | (Food.user_id == user_id), Food.id == food_id)
    )

    if expand:
        if "nutrient" in expand:
            query = query.options(joinedload(FoodNutrient.nutrient))

    food_nutrients = query.all()

    food_nutrient_responses = []

    for food_nutrient_row in food_nutrients:
        nutrient = None

        if expand:
            if "nutrient" in expand and food_nutrient_row.nutrient:
                nutrient = food_nutrient_row.nutrient

        food_nutrient_responses.append(
            food_nutrient.FoodNutrientResponse(
                id=food_nutrient_row.id,
                food_id=food_nutrient_row.food_id,
                nutrient_id=food_nutrient_row.nutrient_id,
                amount=food_nutrient_row.amount,
                nutrient=nutrient
            )
        )

    return food_nutrient_responses

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
