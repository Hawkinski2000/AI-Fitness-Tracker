from sqlalchemy.orm import Session
from app.schemas import exercise
from app.models.models import Exercise


def create_exercise(exercise: exercise.ExerciseCreate, db: Session):
    new_exercise = Exercise(**exercise.model_dump())
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return new_exercise

def get_exercises(db: Session,
                  limit: int,
                  skip: int,
                  search: str):
    exercises = db.query(Exercise).filter(Exercise.name.ilike(f"%{search}%"))\
        .limit(limit).offset(skip).all()
    return exercises

def get_exercise(id: int, db: Session):
    exercise = db.query(Exercise).filter(Exercise.id == id).first()
    return exercise

def update_exercise(id: int, exercise: exercise.ExerciseCreate, db: Session):
    exercise_query = db.query(Exercise).filter(Exercise.id == id)
    exercise_query.update(exercise.model_dump(), synchronize_session=False)
    db.commit()
    updated_exercise = exercise_query.first()
    return updated_exercise

def delete_exercise(id: int, db: Session):
    exercise_query = db.query(Exercise).filter(Exercise.id == id)
    exercise_query.delete(synchronize_session=False)
    db.commit()
