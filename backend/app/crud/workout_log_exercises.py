from sqlalchemy.orm import Session
from app.schemas import workout_log_exercise
from app.models.models import WorkoutLogExercise


def create_workout_log_exercise(workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate, db: Session):
    new_workout_log_exercise = WorkoutLogExercise(**workout_log_exercise.model_dump())
    db.add(new_workout_log_exercise)
    db.commit()
    db.refresh(new_workout_log_exercise)
    return new_workout_log_exercise

def get_workout_log_exercises(db: Session):
    workout_log_exercises = db.query(WorkoutLogExercise).all()
    return workout_log_exercises

def get_workout_log_exercise(id: int, db: Session):
    workout_log_exercise = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == id).first()
    return workout_log_exercise

def update_workout_log_exercise(id: int, workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate, db: Session):
    workout_log_exercise_query = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == id)
    workout_log_exercise_query.update(workout_log_exercise.model_dump(), synchronize_session=False)
    db.commit()
    updated_workout_log_exercise = workout_log_exercise_query.first()
    return updated_workout_log_exercise

def delete_workout_log_exercise(id: int, db: Session):
    workout_log_exercise_query = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == id)
    workout_log_exercise_query.delete(synchronize_session=False)
    db.commit()
