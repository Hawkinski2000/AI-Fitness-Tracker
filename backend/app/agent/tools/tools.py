from agents import function_tool
from typing import List
from sqlalchemy.orm import Session
from app.core.db import get_db
import app.schemas as schemas
import app.crud as crud


db_gen = get_db()
db: Session = next(db_gen)

@function_tool
def greet_user(greeting: str):
    """
    Display a greeting to the user in the UI.

    Args:
        greeting (str): A friendly greeting addressing the user by their name.
    """
    print(greeting + "\n")

@function_tool
def get_meal_log_summaries(user_id: int, days_back: int, view_micronutrients: bool = False) -> List[dict]:
    """
    Retrieve a summary of a user's meal logs for the past "days_back" days.

    Args:
        user_id (int): The user's ID.
        days_back (int): Number of days in the past to include in the summary.
        view_micronutrients (bool, optional): If True, include detailed micronutrient data 
            in the summaries. Defaults to False.  
            **Note:** Set this to True only if micronutrient details are important, as 
            it significantly increases the amount of data returned.

    Returns:
        List[dict]: A list of meal log summaries, each containing:
            - meal_log_id (int): The id of the meal log.
            - date (str): The log date in ISO format (YYYY-MM-DD).
            - total_calories (float): Total calories consumed on that date.
            - nutrients (list of dict): Daily nutrient totals, each with:
                - name (str): Nutrient name.
                - amount (str): Nutrient amount formatted to 1 decimal place.
                - unit (str): Unit of measurement for the nutrient.
    """
    meal_log_summaries = crud.meal_logs.get_meal_log_summaries(user_id, days_back, view_micronutrients, db)

    return meal_log_summaries

@function_tool
def get_meal_log_foods(meal_log_ids: List[int], view_nutrients: bool = False):
    """
    Retrieve foods for multiple meal logs specified by their IDs.

    Args:
        meal_log_ids (List[int]): List of meal_log IDs to fetch foods for.
            These can be accessed with the get_meal_log_summaries tool.
        view_nutrients (bool, optional): Whether to include nutrient details for each food.
            Defaults to False.

    Returns:
        str: JSON string of a list of meal log food entries, each containing:
            - meal_log_id (int)
            - food_id (int)
            - description (str)
            - meal_type (str)
            - num_servings (float)
            - serving_size (float)
            - serving_unit (str)
            - calories (int or None)
            - nutrients (optional list of dict), each dict with:
                - name (str)
                - amount (str, formatted to 1 decimal place)
                - unit (str)
    """
    meal_log_foods = crud.meal_log_foods.get_meal_log_foods(meal_log_ids, view_nutrients, db)

    return meal_log_foods

@function_tool
def get_workout_log_summaries(user_id: int, days_back: int) -> List[dict]:
    """
    Retrieve a summary of a user's workout logs for the past "days_back" days.

    Args:
        user_id (int): The user's ID.
        days_back (int): Number of days in the past to include in the summary.

    Returns:
        List[dict]: A list of workout log summaries, each containing:
            - workout_log_id (int): The id of the meal log.
            - date (str): The log date in ISO format (YYYY-MM-DD).
            - workout_type (str | None): The type of workout (e.g., resistance or cardio).
            - total_num_sets (int | None): The total number of sets.
            - total_calories_burned (int | None): The approximate total calories burned.
    """
    workout_log_summaries = crud.workout_logs.get_workout_log_summaries(user_id, days_back, db)

    return workout_log_summaries

@function_tool
def get_sleep_logs(user_id: int) -> List[dict]:
    """
    Get a user's sleep logs.

    Args:
        user_id (int): The user's user_id.

    Returns:
        List[dict]: A list of SleepLog objects. Each dictionary contains:
            - id (int)
            - user_id (int)
            - log_date (str, ISO 8601)
            - time_to_bed (str, ISO 8601)
            - time_awake (str, ISO 8601)
            - duration int: Approximate minutes actually asleep.
            - sleep_score (int | None): Subjective sleep quality score out of 100.
            - notes (dict | None)
    """
    sleep_logs = crud.sleep_logs.get_sleep_logs(db)
    response_models = [schemas.sleep_log.SleepLogResponse.model_validate(log) for log in sleep_logs]
    response = [m.model_dump() for m in response_models]

    return response
