from sqlalchemy.orm import Session
from app.schemas import branded_food
from app.models.models import BrandedFood


def create_branded_food(branded_food: branded_food.BrandedFoodCreate, db: Session):
    new_branded_food = BrandedFood(**branded_food.model_dump(exclude_unset=True))
    db.add(new_branded_food)
    db.commit()
    db.refresh(new_branded_food)
    return new_branded_food

def get_branded_foods(db: Session,
                      limit: int,
                      skip: int,
                      search: str):
    branded_foods = db.query(BrandedFood).filter(BrandedFood.brand_owner.ilike(f"%{search}%"))\
        .limit(limit).offset(skip).all()
    return branded_foods

def get_branded_food(id: int, db: Session):
    branded_food = db.query(BrandedFood).filter(BrandedFood.food_id == id).first()
    return branded_food

def update_branded_food(id: int, branded_food: branded_food.BrandedFoodCreate, db: Session):
    branded_food_query = db.query(BrandedFood).filter(BrandedFood.food_id == id)
    branded_food_query.update(branded_food.model_dump(), synchronize_session=False)
    db.commit()
    updated_branded_food = branded_food_query.first()
    return updated_branded_food

def delete_branded_food(id: int, db: Session):
    branded_food_query = db.query(BrandedFood).filter(BrandedFood.food_id == id)
    branded_food_query.delete(synchronize_session=False)
    db.commit()
