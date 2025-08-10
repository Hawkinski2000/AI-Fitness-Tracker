from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import List
import json
from app.schemas import workout_log_exercise
from app.models.models import WorkoutLogExercise, ExerciseSet


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

def get_workout_log_exercises(workout_log_ids: List[int], view_sets: bool, db: Session):
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
