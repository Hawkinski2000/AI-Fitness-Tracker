from fastapi import FastAPI
from .api.v1.endpoints import (users, meal_logs, foods, workout_logs, exercises,
                            sleep_logs, mood_logs, insight_logs, insights,
                            weight_logs, meal_log_stats, exercise_stats,
                            sleep_log_stats, mood_log_stats, weight_log_stats)


"""
==============================================================================
Todo:
    - Start FastAPI routes for interacting with meal_log_food,
      meal_log_nutrients, meal_log_food_nutrients, food_nutrients,
      meal_log_stats_nutrients, workout_log_exercise, and exercise_set tables.
    
    - Set up database engine and session in db.py.

    - Split Pydantic schemas into separate models for each type of operation
      (e.g., create, read, update, delete) as needed by different routes.

    - Start crud.py functions for interacting with the database in FastAPI
      endpoint functions.

    - Set up automated testing.

==============================================================================
"""


app = FastAPI()

@app.get("/")
def root():
    # TODO
    return {"data": "root"}

app.include_router(users.router)
app.include_router(meal_logs.router)
app.include_router(foods.router)
app.include_router(workout_logs.router)
app.include_router(exercises.router)
app.include_router(sleep_logs.router)
app.include_router(mood_logs.router)
app.include_router(insight_logs.router)
app.include_router(insights.router)
app.include_router(weight_logs.router)
app.include_router(meal_log_stats.router)
app.include_router(exercise_stats.router)
app.include_router(sleep_log_stats.router)
app.include_router(mood_log_stats.router)
app.include_router(weight_log_stats.router)
