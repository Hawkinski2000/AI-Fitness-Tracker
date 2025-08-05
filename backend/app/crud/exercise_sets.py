from sqlalchemy.orm import Session
from app.schemas import exercise_set
from app.models.models import ExerciseSet


def create_exercise_set(exercise_set: exercise_set.ExerciseSetCreate, db: Session):
    new_exercise_set = ExerciseSet(**exercise_set.model_dump(exclude_unset=True))
    db.add(new_exercise_set)
    db.commit()
    db.refresh(new_exercise_set)
    return new_exercise_set

def get_exercise_sets(db: Session):
    exercise_sets = db.query(ExerciseSet).all()
    return exercise_sets

def get_exercise_set(id: int, db: Session):
    exercise_set = db.query(ExerciseSet).filter(ExerciseSet.id == id).first()
    return exercise_set

def update_exercise_set(id: int, exercise_set: exercise_set.ExerciseSetCreate, db: Session):
    exercise_set_query = db.query(ExerciseSet).filter(ExerciseSet.id == id)
    exercise_set_query.update(exercise_set.model_dump(), synchronize_session=False)
    db.commit()
    updated_exercise_set = exercise_set_query.first()
    return updated_exercise_set

def delete_exercise_set(id: int, db: Session):
    exercise_set_query = db.query(ExerciseSet).filter(ExerciseSet.id == id)
    exercise_set_query.delete(synchronize_session=False)
    db.commit()
