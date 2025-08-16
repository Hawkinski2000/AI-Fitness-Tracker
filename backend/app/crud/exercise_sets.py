from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import exercise_set
from app.models.models import ExerciseSet, WorkoutLog, WorkoutLogExercise
from app.crud import workout_log_exercises as crud_workout_log_exercises


def create_exercise_set(exercise_set: exercise_set.ExerciseSetCreate, user_id: int, db: Session):
    workout_log_exercise = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLogExercise.id == exercise_set.workout_log_exercise_id, WorkoutLog.user_id == user_id)
        .first()
    )

    if not workout_log_exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log exercise not found"
        )

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

def get_exercise_sets(user_id: int, db: Session):
    exercise_sets = (
        db.query(ExerciseSet)
        .join(WorkoutLogExercise, ExerciseSet.workout_log_exercise_id == WorkoutLogExercise.id)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLog.user_id == user_id)
        .all()
    )
    return exercise_sets

def get_exercise_set(id: int, user_id: int, db: Session):
    exercise_set = (
        db.query(ExerciseSet)
        .join(WorkoutLogExercise, ExerciseSet.workout_log_exercise_id == WorkoutLogExercise.id)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(ExerciseSet.id == id, WorkoutLog.user_id == user_id)
        .first()
    )
    return exercise_set

def update_exercise_set(id: int, exercise_set: exercise_set.ExerciseSetCreate, user_id: int, db: Session):
    workout_log_exercise = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLogExercise.id == exercise_set.workout_log_exercise_id, WorkoutLog.user_id == user_id)
        .first()
    )

    if not workout_log_exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log exercise not found"
        )

    exercise_set_row = (
        db.query(ExerciseSet)
        .join(ExerciseSet.workout_log_exercise)
        .join(WorkoutLogExercise.workout_log)
        .filter(ExerciseSet.id == id, WorkoutLog.user_id == user_id)
        .first()
    )

    for key, value in exercise_set.model_dump().items():
        setattr(exercise_set_row, key, value)

    db.commit()
    db.refresh(exercise_set_row)

    if exercise_set_row.weight and exercise_set_row.reps:
        one_rep_max = estimate_one_rep_max(exercise_set_row.weight, exercise_set_row.reps)
        exercise_set_row.one_rep_max = one_rep_max
        db.flush()
        crud_workout_log_exercises.recalculate_greatest_one_rep_max(workout_log_exercise_id=exercise_set_row.workout_log_exercise_id, db=db)

    return exercise_set_row

def delete_exercise_set(id: int, user_id: int, db: Session):
    exercise_set_row = (
        db.query(ExerciseSet)
        .join(ExerciseSet.workout_log_exercise)
        .join(WorkoutLogExercise.workout_log)
        .filter(ExerciseSet.id == id, WorkoutLog.user_id == user_id)
        .first()
    )

    workout_log_exercise_id = exercise_set_row.workout_log_exercise_id

    db.delete(exercise_set_row)
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
