from sqlalchemy.orm import Session
from app.schemas import exercise_set
from app.models.models import ExerciseSet, WorkoutLog, WorkoutLogExercise
from app.crud import workout_log_exercises as crud_workout_log_exercises


def create_exercise_set(exercise_set: exercise_set.ExerciseSetCreate, db: Session):
    new_exercise_set = ExerciseSet(**exercise_set.model_dump(exclude_unset=True))
    db.add(new_exercise_set)
    db.commit()
    db.refresh(new_exercise_set)

    workout_log_exercise = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == exercise_set.workout_log_exercise_id).first()
    workout_log_exercise.num_sets += 1
    
    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == workout_log_exercise.workout_log_id).first()
    workout_log.total_num_sets += 1
    
    if new_exercise_set.weight and new_exercise_set.reps:
        one_rep_max = estimate_one_rep_max(new_exercise_set.weight, new_exercise_set.reps)
        new_exercise_set.one_rep_max = one_rep_max
        db.flush()
        crud_workout_log_exercises.recalculate_greatest_one_rep_max(workout_log_exercise_id=new_exercise_set.workout_log_exercise_id, db=db)

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

    if updated_exercise_set.weight and updated_exercise_set.reps:
        one_rep_max = estimate_one_rep_max(updated_exercise_set.weight, updated_exercise_set.reps)
        updated_exercise_set.one_rep_max = one_rep_max
        db.flush()
        crud_workout_log_exercises.recalculate_greatest_one_rep_max(workout_log_exercise_id=updated_exercise_set.workout_log_exercise_id, db=db)

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

    if workout_log.total_num_sets > 0:
        crud_workout_log_exercises.recalculate_greatest_one_rep_max(workout_log_exercise_id=workout_log_exercise.id, db=db)

    if workout_log_exercise.num_sets == 0:
        db.delete(workout_log_exercise)

    if workout_log.total_num_sets == 0:
        db.delete(workout_log)

    db.commit()

# ----------------------------------------------------------------------------

def estimate_one_rep_max(weight: float, reps: int):
    # Epley formula
    one_rep_max = weight * (1 + 0.0333 * reps)
    return one_rep_max
