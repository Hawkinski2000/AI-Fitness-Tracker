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
def get_meal_logs(user_id: int) -> List[dict]:
    """
    Get a user's meal logs.

    Args:
        user_id (int): The user's user_id.

    Returns:
    List[dict]: A list of MealLog objects. Each dictionary contains:
        - id (int)
        - user_id (int)
        - log_date (str, ISO 8601)
        - total_calories (int | None)
    """
    meal_logs = crud.meal_logs.get_meal_logs(db)
    response_models = [schemas.meal_log.MealLogResponse.model_validate(log) for log in meal_logs]
    response = [m.model_dump() for m in response_models]

    return response

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
