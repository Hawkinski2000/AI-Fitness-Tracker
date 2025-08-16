from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import branded_food
from app.models.models import BrandedFood, Food


def create_branded_food(branded_food: branded_food.BrandedFoodCreate, user_id: int, db: Session):
    food = (
        db.query(Food)
        .filter(Food.id == branded_food.food_id, Food.user_id == user_id)
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )

    new_branded_food = BrandedFood(**branded_food.model_dump(exclude_unset=True))
    db.add(new_branded_food)
    db.commit()
    db.refresh(new_branded_food)
    return new_branded_food

def get_branded_foods(limit: int,
                      skip: int,
                      search: str,
                      user_id: int,
                      db: Session):
    branded_foods = (
        db.query(BrandedFood)
        .join(Food, BrandedFood.food_id == Food.id)
        .filter((Food.user_id == None) | (Food.user_id == user_id),
                BrandedFood.brand_owner.ilike(f"%{search}%"))
        .limit(limit)
        .offset(skip)
        .all()
    )
    
    return branded_foods

def get_branded_food(id: int, user_id: int, db: Session):
    branded_food = (
        db.query(BrandedFood)
        .join(Food, BrandedFood.food_id == Food.id)
        .filter(BrandedFood.food_id == id,
                (Food.user_id == None) | (Food.user_id == user_id))
        .first()
    )
    return branded_food

def update_branded_food(id: int, branded_food: branded_food.BrandedFoodCreate, user_id: int, db: Session):
    branded_food_row = (
        db.query(BrandedFood)
        .join(Food, BrandedFood.food_id == Food.id)
        .filter(BrandedFood.food_id == id, Food.user_id == user_id)
        .first()
    )

    for key, value in branded_food.model_dump().items():
        setattr(branded_food_row, key, value)

    db.commit()
    db.refresh(branded_food_row)

    return branded_food_row

def delete_branded_food(id: int, user_id: int, db: Session):
    branded_food_row = (
        db.query(BrandedFood)
        .join(Food, BrandedFood.food_id == Food.id)
        .filter(BrandedFood.food_id == id, Food.user_id == user_id)
        .first()
    )

    db.delete(branded_food_row)
    db.commit()
