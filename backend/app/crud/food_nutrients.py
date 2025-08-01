from sqlalchemy.orm import Session
from app.schemas import food_nutrient
from app.models.models import FoodNutrient


def create_food_nutrient(food_nutrient: food_nutrient.FoodNutrientCreate, db: Session):
    new_food_nutrient = FoodNutrient(**food_nutrient.model_dump(exclude_unset=True))
    db.add(new_food_nutrient)
    db.commit()
    db.refresh(new_food_nutrient)
    return new_food_nutrient

def get_food_nutrients(db: Session):
    food_nutrients = db.query(FoodNutrient).all()
    return food_nutrients

def get_food_nutrient(id: int, db: Session):
    food_nutrient = db.query(FoodNutrient).filter(FoodNutrient.id == id).first()
    return food_nutrient

def update_food_nutrient(id: int, food_nutrient: food_nutrient.FoodNutrientCreate, db: Session):
    food_nutrient_query = db.query(FoodNutrient).filter(FoodNutrient.id == id)
    food_nutrient_query.update(food_nutrient.model_dump(), synchronize_session=False)
    db.commit()
    updated_food_nutrient = food_nutrient_query.first()
    return updated_food_nutrient

def delete_food_nutrient(id: int, db: Session):
    food_nutrient_query = db.query(FoodNutrient).filter(FoodNutrient.id == id)
    food_nutrient_query.delete(synchronize_session=False)
    db.commit()
