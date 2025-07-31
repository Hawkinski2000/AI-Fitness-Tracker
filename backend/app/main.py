from .core.db import engine
from .models.models import MealLog
from fastapi import FastAPI
from .api.v1.endpoints import (
  users,
  meal_logs,
  meal_log_foods,
  foods,
  branded_foods,
  meal_log_nutrients,
  meal_log_food_nutrients,
  food_nutrients,
  nutrients,
  workout_logs,
  workout_log_exercises,
  exercise_sets,
  exercises,
  sleep_logs,
  mood_logs,
  insight_logs,
  insights,
  weight_logs,
  meal_log_stats,
  meal_log_stats_nutrients,
  exercise_stats,
  sleep_log_stats,
  mood_log_stats,
  weight_log_stats
)


"""
==============================================================================
Todo:

    - Split Pydantic schemas into separate models for each type of operation
      (e.g., create, read, update, delete) as needed by different routes.

    - Start crud.py functions for interacting with the database in FastAPI
      endpoint functions.

    - Add exceptions to crud functions.

    - Add PATCH routes for partial updates?

    - Set up automated testing.

==============================================================================
"""

MealLog.__table__.create(bind=engine, checkfirst=True)

app = FastAPI()

@app.get("/")
def root():
    # TODO
    return {"data": "root"}

app.include_router(users.router)

app.include_router(meal_logs.router)
app.include_router(meal_log_foods.router)
app.include_router(foods.router)
app.include_router(branded_foods.router)
app.include_router(meal_log_nutrients.router)
app.include_router(meal_log_food_nutrients.router)
app.include_router(food_nutrients.router)
app.include_router(nutrients.router)

app.include_router(workout_logs.router)
app.include_router(workout_log_exercises.router)
app.include_router(exercise_sets.router)
app.include_router(exercises.router)

app.include_router(sleep_logs.router)

app.include_router(mood_logs.router)

app.include_router(insight_logs.router)
app.include_router(insights.router)

app.include_router(weight_logs.router)

app.include_router(meal_log_stats.router)
app.include_router(meal_log_stats_nutrients.router)
app.include_router(exercise_stats.router)
app.include_router(sleep_log_stats.router)
app.include_router(mood_log_stats.router)
app.include_router(weight_log_stats.router)
