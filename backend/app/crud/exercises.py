from sqlalchemy.orm import Session
from app.schemas import exercise
from app.models.models import Exercise


def create_exercise(exercise: exercise.ExerciseCreate, user_id: int, db: Session):
    new_exercise = Exercise(**exercise.model_dump(), user_id=user_id)
    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)
    return new_exercise

def get_exercises(limit: int,
                  skip: int,
                  search: str,
                  user_id: int,
                  db: Session,):
    query = (
        db.query(Exercise)
        .filter((Exercise.user_id == None) | (Exercise.user_id == user_id),
                Exercise.name.ilike(f"%{search}%"))
    )
    
    total_count = query.count()

    exercises = (
        query
        .order_by(Exercise.id)
        .limit(limit)
        .offset(skip)
        .all()
    )

    exercise_search_results = {
        "exercises": exercises,
        "total_count": total_count
    }

    return exercise_search_results

def get_exercise(id: int, user_id: int, db: Session):
    exercise = (
        db.query(Exercise)
        .filter(Exercise.id == id,
                (Exercise.user_id == None) | (Exercise.user_id == user_id))
        .first()
    )
    return exercise

def update_exercise(id: int, exercise: exercise.ExerciseCreate, user_id: int, db: Session):
    exercise_query = db.query(Exercise).filter(Exercise.id == id, Exercise.user_id == user_id)
    exercise_query.update(exercise.model_dump(), synchronize_session=False)
    db.commit()
    updated_exercise = exercise_query.first()
    return updated_exercise

def delete_exercise(id: int, user_id: int, db: Session):
    exercise_query = db.query(Exercise).filter(Exercise.id == id, Exercise.user_id == user_id)
    exercise_query.delete(synchronize_session=False)
    db.commit()
