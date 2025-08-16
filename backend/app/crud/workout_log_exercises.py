from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List
import json
from app.schemas import workout_log_exercise
from app.models.models import WorkoutLog, WorkoutLogExercise, Exercise, ExerciseSet


def create_workout_log_exercise(workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate, user_id: int, db: Session):
    workout_log = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.id == workout_log_exercise.workout_log_id, WorkoutLog.user_id == user_id)
        .first()
    )

    if not workout_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found"
        )

    exercise = (
        db.query(Exercise)
        .filter(Exercise.id == workout_log_exercise.exercise_id,
                (Exercise.user_id == None) | (Exercise.user_id == user_id))
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    new_workout_log_exercise = WorkoutLogExercise(**workout_log_exercise.model_dump())
    db.add(new_workout_log_exercise)
    db.commit()
    db.refresh(new_workout_log_exercise)

    return new_workout_log_exercise

def get_workout_log_exercises(user_id: int, db: Session):
    workout_log_exercises = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLog.user_id == user_id)
        .all()
    )
    return workout_log_exercises

def get_workout_log_exercise(id: int, user_id: int, db: Session):
    workout_log_exercise = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLogExercise.id == id, WorkoutLog.user_id == user_id)
        .first()
    )
    return workout_log_exercise

def update_workout_log_exercise(id: int, workout_log_exercise: workout_log_exercise.WorkoutLogExerciseCreate, user_id: int, db: Session):
    workout_log = (
        db.query(WorkoutLog)
        .filter(WorkoutLog.id == workout_log_exercise.workout_log_id, WorkoutLog.user_id == user_id)
        .first()
    )

    if not workout_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found"
        )

    exercise = (
        db.query(Exercise)
        .filter(Exercise.id == workout_log_exercise.exercise_id,
                (Exercise.user_id == None) | (Exercise.user_id == user_id))
        .first()
    )

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercise not found"
        )

    workout_log_exercise_row = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLogExercise.id == id, WorkoutLog.user_id == user_id)
        .first()
    )

    for key, value in workout_log_exercise.model_dump().items():
        setattr(workout_log_exercise_row, key, value)

    db.commit()
    db.refresh(workout_log_exercise_row)

    return workout_log_exercise_row

def delete_workout_log_exercise(id: int, user_id: int, db: Session):
    workout_log_exercise_row = (
        db.query(WorkoutLogExercise)
        .join(WorkoutLog, WorkoutLogExercise.workout_log_id == WorkoutLog.id)
        .filter(WorkoutLogExercise.id == id, WorkoutLog.user_id == user_id)
        .first()
    )

    workout_log = db.query(WorkoutLog).filter(WorkoutLog.id == workout_log_exercise_row.workout_log_id).first()
    workout_log.total_num_sets -= workout_log_exercise_row.num_sets

    db.delete(workout_log_exercise_row)
    db.commit()

# ----------------------------------------------------------------------------

def recalculate_greatest_one_rep_max(workout_log_exercise_id: int, db: Session):
    max_set = (
        db.query(ExerciseSet)
        .filter(
            ExerciseSet.workout_log_exercise_id == workout_log_exercise_id,
            ExerciseSet.one_rep_max.isnot(None)
        )
        .order_by(desc(ExerciseSet.one_rep_max))
        .first()
    )

    workout_log_exercise_query = db.query(WorkoutLogExercise).filter(WorkoutLogExercise.id == workout_log_exercise_id)

    if max_set:
        workout_log_exercise_query.update(
            {
                WorkoutLogExercise.greatest_one_rep_max: max_set.one_rep_max,
                WorkoutLogExercise.unit: max_set.unit
            },
            synchronize_session=False
        )
    else:
        workout_log_exercise_query.update(
            {
                WorkoutLogExercise.greatest_one_rep_max: None,
                WorkoutLogExercise.unit: None
            },
            synchronize_session=False
        )

    db.commit()

# ----------------------------------------------------------------------------

def get_workout_log_exercise_summaries(workout_log_ids: List[int], view_sets: bool, db: Session):
    query = (
        db.query(WorkoutLogExercise)
        .filter(WorkoutLogExercise.workout_log_id.in_(workout_log_ids))
        .options(joinedload(WorkoutLogExercise.exercise))
    )

    if view_sets:
        query = query.options(joinedload(WorkoutLogExercise.exercise_sets))

    workout_log_exercises = query.all()

    results = []
    for wle in workout_log_exercises:
        exercise_entry = {
            "workout_log_id": wle.workout_log_id,
            "num_sets": wle.num_sets,
            "greatest_one_rep_max": f"{wle.greatest_one_rep_max:.1f}",
            "unit": wle.unit,
            "name": wle.exercise.name,
            "description": wle.exercise.description,
            "exercise_type": wle.exercise.exercise_type,
            "body_part": wle.exercise.body_part,
            "equipment": wle.exercise.equipment,
            "level": wle.exercise.level,
            "notes": wle.exercise.notes,
            "base_unit": wle.exercise.base_unit,
        }
        
        if view_sets:
            sets = []
            for s in wle.exercise_sets:
                sets.append({
                    "created_at": s.created_at.isoformat(),
                    "weight": f"{s.weight:.1f}",
                    "reps": s.reps,
                    "unit": s.unit,
                    "one_rep_max": f"{s.one_rep_max:.1f}",
                    "rest_after_secs": s.rest_after_secs,
                    "duration_secs": s.duration_secs,
                    "calories_burned": s.calories_burned
                })
            exercise_entry["sets"] = sets

        results.append(exercise_entry)

    return json.dumps(results)
