from sqlalchemy.orm import Session
from app.schemas import nutrient
from app.models.models import Nutrient


def create_nutrient(nutrient: nutrient.NutrientCreate, db: Session):
    new_nutrient = Nutrient(**nutrient.model_dump(exclude_unset=True))
    db.add(new_nutrient)
    db.commit()
    db.refresh(new_nutrient)
    return new_nutrient

def get_nutrients(db: Session):
    nutrients = db.query(Nutrient).all()
    return nutrients

def get_nutrient(id: int, db: Session):
    nutrient = db.query(Nutrient).filter(Nutrient.id == id).first()
    return nutrient

def update_nutrient(id: int, nutrient: nutrient.NutrientCreate, db: Session):
    nutrient_query = db.query(Nutrient).filter(Nutrient.id == id)
    nutrient_query.update(nutrient.model_dump(), synchronize_session=False)
    db.commit()
    updated_nutrient = nutrient_query.first()
    return updated_nutrient

def delete_nutrient(id: int, db: Session):
    nutrient_query = db.query(Nutrient).filter(Nutrient.id == id)
    nutrient_query.delete(synchronize_session=False)
    db.commit()
