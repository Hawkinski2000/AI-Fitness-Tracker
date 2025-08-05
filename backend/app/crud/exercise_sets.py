from sqlalchemy.orm import Session
from app.schemas import exercise_set
from app.models.models import ExerciseSet, WorkoutLog, WorkoutLogExercise


"""
==============================================================================
Todo:
    - If a unit is not specified, use the base_unit of the exercise.

    - A user should be able to add an exercise_set to a day and a workout_log
      and workout_log_exercise will be automatically created for it.

==============================================================================
"""

def create_exercise_set(exercise_set: exercise_set.ExerciseSetCreate, db: Session):
    new_exercise_set = ExerciseSet(**exercise_set.model_dump(exclude_unset=True))
    db.add(new_exercise_set)
    db.commit()
    db.refresh(new_exercise_set)

    workout_log_exercise = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == exercise_set.workout_log_exercise_id).first()
    workout_log_exercise.num_sets += 1
    
    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == workout_log_exercise.workout_log_id).first()
    workout_log.total_num_sets += 1
    
    db.commit()

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
    exercise_set = exercise_set_query.first()
    workout_log_exercise_id = exercise_set.workout_log_exercise_id
    exercise_set_query.delete(synchronize_session=False)
    db.commit()

    workout_log_exercise = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == workout_log_exercise_id).first()
    workout_log_exercise.num_sets -= 1

    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == workout_log_exercise.workout_log_id).first()
    workout_log.total_num_sets -= 1

    if workout_log_exercise.num_sets == 0:
        db.delete(workout_log_exercise)

    if workout_log.total_num_sets == 0:
        db.delete(workout_log)

    db.commit()
