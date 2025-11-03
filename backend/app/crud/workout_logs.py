from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
import json
from app.schemas import workout_log, workout_log_exercise, exercise, exercise_set
from app.models.models import WorkoutLog, WorkoutLogExercise, Exercise, ExerciseSet


def create_workout_log(workout_log: workout_log.WorkoutLogCreate, user_id: int, db: Session):
    new_workout_log = WorkoutLog(**workout_log.model_dump(), user_id=user_id)
    db.add(new_workout_log)
    db.commit()
    db.refresh(new_workout_log)
    return new_workout_log

def get_workout_logs(date: str,
                     expand: list[str] | None,
                     user_id: int,
                     db: Session):
    query = db.query(WorkoutLog).filter(WorkoutLog.user_id == user_id)
    
    if date:
        query = query.filter(func.date(WorkoutLog.log_date) == date)

    if expand:
        if "workoutLogExercises" in expand:
            query = query.options(
                joinedload(WorkoutLog.workout_log_exercises)
            )
        if "workoutLogExercises.exercise" in expand:
            query = query.options(
                joinedload(WorkoutLog.workout_log_exercises)
                .joinedload(WorkoutLogExercise.exercise)
            )
        if "workoutLogExercises.exerciseSets" in expand:
            query = query.options(
                joinedload(WorkoutLog.workout_log_exercises)
                .joinedload(WorkoutLogExercise.exercise_sets)
            )

    workout_logs = query.all()

    workout_log_responses = []

    for workout_log_row in workout_logs:
        workout_log_exercises = None
        exercises = None
        exercise_sets = None

        if expand:
            if "workoutLogExercises" in expand and workout_log_row.workout_log_exercises:
                workout_log_exercises = [
                    workout_log_exercise.WorkoutLogExerciseResponse.model_validate(wle)
                    for wle in workout_log_row.workout_log_exercises
                ]
            if "workoutLogExercises.exercise" in expand and workout_log_exercises:
                exercises = [
                    exercise.ExerciseResponse.model_validate(workout_log_exercise.exercise)
                    for workout_log_exercise in workout_log_row.workout_log_exercises
                    if workout_log_exercise.exercise is not None
                ]
            if "workoutLogExercises.exerciseSets" in expand and workout_log_exercises:
                exercise_sets = [
                    exercise_set.ExerciseSetResponse.model_validate(es)
                    for workout_log_exercise in workout_log_row.workout_log_exercises
                    for es in (workout_log_exercise.exercise_sets or [])
                ]

        workout_log_responses.append(
            workout_log.WorkoutLogResponse(
                id=workout_log_row.id,
                user_id=workout_log_row.user_id,
                log_date=workout_log_row.log_date,
                workout_type=workout_log_row.workout_type,
                total_num_sets=workout_log_row.total_num_sets,
                total_calories_burned=workout_log_row.total_calories_burned,
                workout_log_exercises=workout_log_exercises,
                exercises=exercises,
                exercise_sets=exercise_sets
            )
        )

    return workout_log_responses

def get_workout_log(id: int, user_id: int, db: Session):
    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == id, WorkoutLog.user_id == user_id).first()

    if not workout_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Workout log not found")

    return workout_log

def update_workout_log(id: int, workout_log: workout_log.WorkoutLogCreate, user_id: int, db: Session):
    workout_log_query = db.query(WorkoutLog).filter(WorkoutLog.id == id, WorkoutLog.user_id == user_id)

    if not workout_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Workout log not found")

    workout_log_query.update(workout_log.model_dump(), synchronize_session=False)
    db.commit()
    updated_workout_log = workout_log_query.first()
    return updated_workout_log

def delete_workout_log(id: int, user_id: int, db: Session):
    workout_log_query = db.query(WorkoutLog).filter(WorkoutLog.id == id, WorkoutLog.user_id == user_id)

    if not workout_log_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Workout log not found")

    workout_log_query.delete(synchronize_session=False)
    db.commit()

# ----------------------------------------------------------------------------

def get_workout_log_summaries(user_id: int, days_back: int, db: Session):
    workout_logs = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.user_id == user_id)
        .filter(WorkoutLog.log_date >= func.current_date() - days_back)
        .order_by(WorkoutLog.log_date)
        .all()
    )

    workout_log_summaries = []

    for log in workout_logs:
        workout_log_summary = {
            "workout_log_id": log.id,
            "date": log.log_date.isoformat(),
            "workout_type": log.workout_type,
            "total_num_sets": log.total_num_sets,
            "total_calories_burned": log.total_calories_burned
        }

        workout_log_summaries.append(workout_log_summary)

    return json.dumps(workout_log_summaries)
