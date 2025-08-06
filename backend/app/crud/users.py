from sqlalchemy.orm import Session
from app.schemas import user
from app.models.models import User


def create_user(user: user.UserCreate, db: Session):
    new_user = User(**user.model_dump(exclude_unset=True))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_users(db: Session):
    users = db.query(User).all()
    return users

def get_user(id: int, db: Session):
    user = db.query(User).filter(User.id == id).first()
    return user

def update_user(id: int, user: user.UserCreate, db: Session):
    user_query = db.query(User).filter(User.id == id)
    user_query.update(user.model_dump(), synchronize_session=False)
    db.commit()
    updated_user = user_query.first()
    return updated_user

def delete_user(id: int, db: Session):
    user_query = db.query(User).filter(User.id == id)
    user_query.delete(synchronize_session=False)
    db.commit()
