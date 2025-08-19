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


tools_list = [{
    "type": "function",
    "name": "greet_user",
    "description": "Display a greeting to the user in the UI.",
    "parameters": {
        "type": "object",
        "properties": {
            "greeting": {
                "type": "string",
                "description": "A friendly greeting addressing the user by their name"
            }
        },
        "required": [
            "greeting"
        ],
        "additionalProperties": False
    }
},
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
                    Note: Set this to True only if micronutrient details are important, as it significantly increases the amount of data returned."""
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
                "description": "A list of meal_log IDs specifying which meal logs to retrieve foods from. These IDs can be obtained using the get_meal_log_summaries tool."
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
                "description": "Number of days in the past to include in the summary. Do not exceed 7 days."
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
                "description": "A list of workout_log IDs specifying which workout logs to retrieve exercises from. These IDs can be obtained using the get_workout_log_summaries tool."
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
                "description": "Number of days in the past to include in the summary. Do not exceed 7 days."
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
                "description": "Number of days in the past to include in the summary. Do not exceed 7 days."
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
                "description": "Number of days in the past to include in the summary. Do not exceed 7 days."
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

    print(f"Calling {name}...\n")

    return func(user_id, **args)
