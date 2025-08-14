from agents import function_tool
from sqlalchemy.orm import Session
import tiktoken
from typing import List
from app.core.db import get_db
from app.crud import (
    meal_logs,
    meal_log_foods,
    workout_logs,
    workout_log_exercises,
    sleep_logs,
    mood_logs,
    weight_logs
)


db_gen = get_db()
db: Session = next(db_gen)

encoding = tiktoken.get_encoding("cl100k_base")

@function_tool
def greet_user(greeting: str):
    """
    Display a greeting to the user in the UI.

    Args:
        greeting (str): A friendly greeting addressing the user by their name.
    """
    print(f"{greeting} \n")

@function_tool
def get_meal_log_summaries(user_id: int, days_back: int, view_micronutrients: bool = False) -> str:
    """
    Retrieve a summary of a user's meal logs for the past "days_back" days.

    Args:
        user_id (int): The user's ID.
        days_back (int): Number of days in the past to include in the summary. Do not exceed 7 days.
        view_micronutrients (bool, optional): If True, include detailed micronutrient data 
            in the summaries. Defaults to False.  
            **Note:** Set this to True only if micronutrient details are important, as 
            it significantly increases the amount of data returned.

    Returns:
        str: JSON string of a list of meal log summaries, each containing:
            - meal_log_id (int): The id of the meal log.
            - date (str): The log date in ISO format (YYYY-MM-DD).
            - total_calories (float | None): Total calories consumed on that date.
            - nutrients (list of dict): Daily nutrient totals, each with:
                - name (str): Nutrient name.
                - amount (str): Nutrient amount formatted to 1 decimal place.
                - unit (str): Unit of measurement for the nutrient.
    """
    days_back = min(days_back, 7)

    meal_log_summaries = meal_logs.get_meal_log_summaries(user_id, days_back, view_micronutrients, db)

    tokens = encoding.encode(meal_log_summaries)
    tokens_count = len(tokens)
    print(f"meal_log_summaries has {tokens_count} tokens.")
    if tokens_count > 10000:
        meal_log_summaries = "[]"

    return meal_log_summaries

@function_tool
def get_meal_log_foods(meal_log_ids: List[int]) -> str:
    """
    Retrieve foods for multiple meal logs specified by their IDs.

    Args:
        meal_log_ids (List[int]): List of meal_log IDs to fetch foods for.
            These can be accessed with the get_meal_log_summaries tool.

    Returns:
        str: JSON string of a list of meal log food entries, each containing:
            - meal_log_id (int)
            - description (str)
            - meal_type (str)
            - num_servings (float)
            - serving_size (float)
            - serving_unit (str)
            - created_at (str, ISO 8601)
            - calories (int or None)
    """
    view_nutrients = False

    meal_log_foods_data = meal_log_foods.get_meal_log_foods(meal_log_ids, view_nutrients, db)

    tokens = encoding.encode(meal_log_foods_data)
    tokens_count = len(tokens)
    print(f"meal_log_foods_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        meal_log_foods_data = "[]"

    return meal_log_foods_data

@function_tool
def get_workout_log_summaries(user_id: int, days_back: int) -> str:
    """
    Retrieve a summary of a user's workout logs for the past "days_back" days.

    Args:
        user_id (int): The user's ID.
        days_back (int): Number of days in the past to include in the summary. Do not exceed 7 days.

    Returns:
        str: JSON string of a list of workout log summaries, each containing:
            - workout_log_id (int): The id of the meal log.
            - date (str): The log date in ISO format (YYYY-MM-DD).
            - workout_type (str | None): The type of workout (e.g., resistance or cardio).
            - total_num_sets (int): The total number of sets.
            - total_calories_burned (int | None): The approximate total calories burned.
    """
    days_back = min(days_back, 7)

    workout_log_summaries = workout_logs.get_workout_log_summaries(user_id, days_back, db)

    tokens = encoding.encode(workout_log_summaries)
    tokens_count = len(tokens)
    print(f"workout_log_summaries has {len(tokens)} tokens.")
    if tokens_count > 10000:
        workout_log_summaries = "[]"

    return workout_log_summaries

@function_tool
def get_workout_log_exercises(workout_log_ids: List[int], view_sets: bool = False) -> str:
    """
    Retrieve exercises for multiple workout logs specified by their IDs.

    Args:
        workout_log_ids (List[int]): List of workout_log IDs to fetch exercises for.
            These can be accessed with the get_workout_log_summaries tool.
        view_sets (bool, optional): Whether to include set details for each exercise.
            Defaults to False.
            **Note:** Set this to True only if set details are important, as 
            it significantly increases the amount of data returned.

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
                - calories_burned (int | None)
    """
    workout_log_exercises_data = workout_log_exercises.get_workout_log_exercises(workout_log_ids, view_sets, db)

    tokens = encoding.encode(workout_log_exercises_data)
    tokens_count = len(tokens)
    print(f"workout_log_exercises_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        workout_log_exercises_data = "[]"

    return workout_log_exercises_data

@function_tool
def get_sleep_logs(user_id: int, days_back: int) -> str:
    """
    Get a user's sleep logs.

    Args:
        user_id (int): The user's user_id.
        days_back (int): Number of days in the past to include. Do not exceed 7 days.

    Returns:
        str: JSON string of a list of sleep log entries, each containing:
            - date (str): (str, ISO 8601)
            - time_to_bed (str, ISO 8601)
            - time_awake (str, ISO 8601)
            - duration int: Approximate minutes actually asleep.
            - sleep_score (int | None): Subjective sleep quality score out of 100.
            - notes (dict | None)
    """
    days_back = min(days_back, 7)

    sleep_logs_data = sleep_logs.get_sleep_logs(user_id, days_back, db)

    tokens = encoding.encode(sleep_logs_data)
    tokens_count = len(tokens)
    print(f"sleep_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        sleep_logs_data = "[]"

    return sleep_logs_data

@function_tool
def get_mood_logs(user_id: int, days_back: int) -> str:
    """
    Get a user's mood logs.

    Args:
        user_id (int): The user's user_id.
        days_back (int): Number of days in the past to include. Do not exceed 7 days.

    Returns:
        str: JSON string of a list of mood log entries, each containing:
            - date (str, ISO 8601)
            - mood_score (int | None): Subjective mood quality score out of 10.
            - notes (dict | None)
    """
    days_back = min(days_back, 7)

    mood_logs_data = mood_logs.get_mood_logs(user_id, days_back, db)

    tokens = encoding.encode(mood_logs_data)
    tokens_count = len(tokens)
    print(f"mood_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        mood_logs_data = "[]"

    return mood_logs_data

@function_tool
def get_weight_logs(user_id: int, days_back: int) -> str:
    """
    Get a user's bodyweight logs.

    Args:
        user_id (int): The user's user_id.
        days_back (int): Number of days in the past to include. Do not exceed 7 days.

    Returns:
        str: JSON string of a list of weight log entries, each containing:
            - date (str, ISO 8601)
            - weight (float)
            - unit (str)
    """
    days_back = min(days_back, 7)

    weight_logs_data = weight_logs.get_weight_logs(user_id, days_back, db)

    tokens = encoding.encode(weight_logs_data)
    tokens_count = len(tokens)
    print(f"weight_logs_data has {len(tokens)} tokens.")
    if tokens_count > 10000:
        weight_logs_data = "[]"

    return weight_logs_data
