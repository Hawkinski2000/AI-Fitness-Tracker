from sqlalchemy.orm import Session
from app.schemas import food
from app.models.models import Food


def create_food(food: food.FoodCreate, db: Session):
    new_food = Food(**food.model_dump(exclude_unset=True))
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food

def get_foods(db: Session,
              limit: int,
              skip: int,
              search: str):
    foods = db.query(Food).filter(Food.description.ilike(f"%{search}%"))\
        .limit(limit).offset(skip).all()
    return foods

def get_food(id: int, db: Session):
    food = db.query(Food).filter(Food.id == id).first()
    return food

def update_food(id: int, food: food.FoodCreate, db: Session):
    food_query = db.query(Food).filter(Food.id == id)
    food_query.update(food.model_dump(), synchronize_session=False)
    db.commit()
    updated_food = food_query.first()
    return updated_food

def delete_food(id: int, db: Session):
    food_query = db.query(Food).filter(Food.id == id)
    food_query.delete(synchronize_session=False)
    db.commit()
