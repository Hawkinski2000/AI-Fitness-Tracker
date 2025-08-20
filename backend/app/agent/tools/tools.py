from sqlalchemy.orm import Session
import tiktoken
from typing import List
from app.core.db import get_db
from app.models.models import MealLog, WorkoutLog
from app.crud import (
    meal_logs,
    meal_log_foods,
    workout_logs,
    workout_log_exercises,
    sleep_logs,
    mood_logs,
    weight_logs
)


tools_list = [
{
    "type": "function",
    "name": "get_meal_log_summaries",
    "description": "Retrieve summaries of a user's meal logs for the past 'days_back' days.",
    "parameters": {
        "type": "object",
        "properties": {
            "days_back": {
                "type": "integer",
                "description": "Number of days in the past to include in the summary. Do not exceed 7 days."
            },
            "view_micronutrients": {
                "type": "boolean",
                "description": (
                    """If True, include detailed micronutrient data in the summaries. Defaults to False.
                    Note: Set this to True only if micronutrient details are important, as it significantly increases the amount of data returned.
                    
                    Returns:
                        str: JSON string of a list of meal log summaries, each containing:
                            - meal_log_id (int): The id of the meal log.
                            - date (str): The log date in ISO format (YYYY-MM-DD).
                            - total_calories (float | None): Total calories consumed on that date.
                            - nutrients (list of dict): Daily nutrient totals, each with:
                                - name (str): Nutrient name.
                                - amount (float): Nutrient amount formatted to 1 decimal place.
                                - unit (str): Unit of measurement for the nutrient."""
                )
            }
        },
        "required": [
            "days_back"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_meal_log_food_summaries",
    "description": "Retrieve foods for multiple meal logs specified by their meal_log IDs.",
    "parameters": {
        "type": "object",
        "properties": {
            "meal_log_ids": {
                "type": "array",
                "items": {
                    "type": "integer"
                },
                "description": (
                    """A list of meal_log IDs specifying which meal logs to retrieve foods from. These IDs can be obtained using the get_meal_log_summaries tool.

                    Returns:
                        str: JSON string of a list of meal log food entries, each containing:
                            - meal_log_id (int).
                            - description (str).
                            - meal_type (str).
                            - num_servings (float).
                            - serving_size (float).
                            - serving_unit (str).
                            - created_at (str, ISO 8601).
                            - calories (int | None)."""
                )
            }
        },
        "required": [
            "meal_log_ids"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_workout_log_summaries",
    "description": "Retrieve summaries of a user's workout logs for the past 'days_back' days.",
    "parameters": {
        "type": "object",
        "properties": {
            "days_back": {
                "type": "integer",
                "description": (
                    """Number of days in the past to include in the summary. Do not exceed 7 days.

                    Returns:
                        str: JSON string of a list of workout log summaries, each containing:
                            - workout_log_id (int): The id of the meal log.
                            - date (str): The log date in ISO format (YYYY-MM-DD).
                            - workout_type (str | None): The type of workout (e.g., resistance or cardio).
                            - total_num_sets (int): The total number of sets.
                            - total_calories_burned (int | None): The approximate total calories burned.   
                    """
                )
            }
        },
        "required": [
            "days_back"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_workout_log_exercise_summaries",
    "description": "Retrieve exercises for multiple workout logs specified by their workout_log IDs.",
    "parameters": {
        "type": "object",
        "properties": {
            "workout_log_ids": {
                "type": "array",
                "items": {
                    "type": "integer"
                },
                "description": (
                    """A list of workout_log IDs specifying which workout logs to retrieve exercises from. These IDs can be obtained using the get_workout_log_summaries tool.
                
                    Returns:
                        str: JSON string of a list of workout log exercise entries, each containing:
                            - workout_log_id (int)
                            - num_sets (int)
                            - greatest_one_rep_max (float | None): The greatest estimated one-rep-max in all sets.
                            - unit (str | None): The unit (e.g. lbs or kg) associated with the greatest_one_rep_max.
                            - name (str)
                            - description (str | None)
                            - exercise_type (str | None)
                            - body_part (str | None)
                            - equipment (str | None)
                            - level (str | None)
                            - notes (dict | None)
                            - base_unit (str | None)
                            - sets (optional list of dict), each dict with:
                                - created_at (str, ISO 8601)
                                - weight (float | None)
                                - reps (int | None)
                                - unit (str | None)
                                - one_rep_max (float | None): Estimated one-rep-max for the set (uses Epley formula).
                                - rest_after_secs (int | None): The approximate rest duration in seconds after the set.
                                - duration_secs (int | None): The approximate duration in seconds of the set (e.g., cardio).
                                - calories_burned (int | None)"""
                )
            },
            "view_sets": {
                "type": "boolean",
                "description": (
                    """Whether to include set details for each exercise. Defaults to False.
                    Note: Set this to True only if set details are important, as it significantly increases the amount of data returned."""
                )
            }
        },
        "required": [
            "workout_log_ids"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_sleep_log_summaries",
    "description": "Retrieve summaries of a user's sleep logs for the past 'days_back' days.",
    "parameters": {
        "type": "object",
        "properties": {
            "days_back": {
                "type": "integer",
                "description": (
                    """Number of days in the past to include in the summary. Do not exceed 7 days.

                    Returns:
                        str: JSON string of a list of sleep log entries, each containing:
                            - date (str): (str, ISO 8601)
                            - time_to_bed (str, ISO 8601)
                            - time_awake (str, ISO 8601)
                            - duration int: Approximate minutes actually asleep.
                            - sleep_score (int | None): Subjective sleep quality score out of 100.
                            - notes (dict | None)"""
                )
            }
        },
        "required": [
            "days_back"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_mood_log_summaries",
    "description": "Retrieve summaries of a user's mood logs for the past 'days_back' days.",
    "parameters": {
        "type": "object",
        "properties": {
            "days_back": {
                "type": "integer",
                "description": (
                    """Number of days in the past to include in the summary. Do not exceed 7 days.
                    
                    Returns:
                        str: JSON string of a list of mood log entries, each containing:
                            - date (str, ISO 8601)
                            - mood_score (int | None): Subjective mood quality score out of 10.
                            - notes (dict | None)"""
                )
            }
        },
        "required": [
            "days_back"
        ],
        "additionalProperties": False
    }
},
{
    "type": "function",
    "name": "get_weight_log_summaries",
    "description": "Retrieve summaries of a user's bodyweight logs for the past 'days_back' days.",
    "parameters": {
        "type": "object",
        "properties": {
            "days_back": {
                "type": "integer",
                "description": (
                    """Number of days in the past to include in the summary. Do not exceed 7 days.
                    
                    Returns:
                        str: JSON string of a list of weight log entries, each containing:
                            - date (str, ISO 8601)
                            - weight (float)
                            - unit (str)"""
                )
            }
        },
        "required": [
            "days_back"
        ],
        "additionalProperties": False
    }
}]

db_gen = get_db()
db: Session = next(db_gen)

encoding = tiktoken.get_encoding("cl100k_base")

def greet_user(user_id: int, greeting: str):
    print(f"{greeting} \n")

def get_meal_log_summaries(user_id: int, days_back: int, view_micronutrients: bool = False) -> str:
    days_back = min(days_back, 7)

    meal_log_summaries = meal_logs.get_meal_log_summaries(user_id, days_back, view_micronutrients, db)

    tokens = encoding.encode(meal_log_summaries)
    tokens_count = len(tokens)
    # print(f"meal_log_summaries has {tokens_count} tokens.")
    if tokens_count > 10000:
        meal_log_summaries = "[]"

    return meal_log_summaries

def get_meal_log_food_summaries(user_id: int, meal_log_ids: List[int]) -> str:
    valid_meal_log_ids = (
        db.query(MealLog.id)
        .filter(MealLog.id.in_(meal_log_ids))
        .filter(MealLog.user_id == user_id)
        .all()
    )
    valid_ids = [row.id for row in valid_meal_log_ids]

    if set(valid_ids) != set(meal_log_ids):
        raise ValueError("One or more meal_log_ids do not belong to the current user")

    view_nutrients = False

    meal_log_foods_data = meal_log_foods.get_meal_log_food_summaries(meal_log_ids, view_nutrients, db)

    tokens = encoding.encode(meal_log_foods_data)
    tokens_count = len(tokens)
    # print(f"meal_log_foods_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        meal_log_foods_data = "[]"

    return meal_log_foods_data

def get_workout_log_summaries(user_id: int, days_back: int) -> str:
    days_back = min(days_back, 7)

    workout_log_summaries = workout_logs.get_workout_log_summaries(user_id, days_back, db)

    tokens = encoding.encode(workout_log_summaries)
    tokens_count = len(tokens)
    # print(f"workout_log_summaries has {len(tokens)} tokens.")
    if tokens_count > 10000:
        workout_log_summaries = "[]"

    return workout_log_summaries

def get_workout_log_exercise_summaries(user_id: int, workout_log_ids: List[int], view_sets: bool = False) -> str:
    valid_workout_log_ids = (
        db.query(WorkoutLog.id)
        .filter(WorkoutLog.id.in_(workout_log_ids))
        .filter(WorkoutLog.user_id == user_id)
        .all()
    )
    valid_ids = [row.id for row in valid_workout_log_ids]

    if set(valid_ids) != set(workout_log_ids):
        raise ValueError("One or more workout_log_ids do not belong to the current user")

    workout_log_exercises_data = workout_log_exercises.get_workout_log_exercise_summaries(workout_log_ids, view_sets, db)

    tokens = encoding.encode(workout_log_exercises_data)
    tokens_count = len(tokens)
    # print(f"workout_log_exercises_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        workout_log_exercises_data = "[]"

    return workout_log_exercises_data

def get_sleep_log_summaries(user_id: int, days_back: int) -> str:
    days_back = min(days_back, 7)

    sleep_logs_data = sleep_logs.get_sleep_log_summaries(user_id, days_back, db)

    tokens = encoding.encode(sleep_logs_data)
    tokens_count = len(tokens)
    # print(f"sleep_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        sleep_logs_data = "[]"

    return sleep_logs_data

def get_mood_log_summaries(user_id: int, days_back: int) -> str:
    days_back = min(days_back, 7)

    mood_logs_data = mood_logs.get_mood_log_summaries(user_id, days_back, db)

    tokens = encoding.encode(mood_logs_data)
    tokens_count = len(tokens)
    # print(f"mood_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        mood_logs_data = "[]"

    return mood_logs_data

def get_weight_log_summaries(user_id: int, days_back: int) -> str:
    days_back = min(days_back, 7)

    weight_logs_data = weight_logs.get_weight_log_summaries(user_id, days_back, db)

    tokens = encoding.encode(weight_logs_data)
    tokens_count = len(tokens)
    # print(f"weight_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        weight_logs_data = "[]"

    return weight_logs_data

tool_map = {
    "greet_user": greet_user,
    "get_meal_log_summaries": get_meal_log_summaries,
    "get_meal_log_food_summaries": get_meal_log_food_summaries,
    "get_workout_log_summaries": get_workout_log_summaries,
    "get_workout_log_exercise_summaries": get_workout_log_exercise_summaries,
    "get_sleep_log_summaries": get_sleep_log_summaries,
    "get_mood_log_summaries": get_mood_log_summaries,
    "get_weight_log_summaries": get_weight_log_summaries,
}

def call_function(name: str, args: dict, user_id: int):
    func = tool_map.get(name)

    print(f"\nCalling {name}...\n")

    return func(user_id, **args)
