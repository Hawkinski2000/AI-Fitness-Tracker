from sqlalchemy.orm import Session
from app.schemas import food
from app.models.models import Food


def create_food(food: food.FoodCreate, user_id: int, db: Session):
    new_food = Food(**food.model_dump(), user_id=user_id)
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

def get_foods(limit: int,
              skip: int,
              search: str,
              user_id: int,
              db: Session):
    foods = (
        db.query(Food)
        .filter((Food.user_id == None) | (Food.user_id == user_id),
                Food.description.ilike(f"%{search}%"))
        .limit(limit)
        .offset(skip)
        .all()
    )
    return foods

def get_food(id: int, user_id: int, db: Session):
    food = (
        db.query(Food)
        .filter(Food.id == id,
                (Food.user_id == None) | (Food.user_id == user_id))
        .first()
    )
    return food

def update_food(id: int, food: food.FoodCreate, user_id: int, db: Session):
    food_query = db.query(Food).filter(Food.id == id, Food.user_id == user_id)
    food_query.update(food.model_dump(), synchronize_session=False)
    db.commit()
    updated_food = food_query.first()
    return updated_food

def delete_food(id: int, user_id: int, db: Session):
    food_query = db.query(Food).filter(Food.id == id, Food.user_id == user_id)
    food_query.delete(synchronize_session=False)
    db.commit()
