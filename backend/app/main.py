from fastapi import FastAPI
import argparse
from .models.models import Base
from .core.db import engine
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
    - When creating a food, a food_nutrient should be created for it.

    - Split Pydantic schemas into separate models for each type of operation
        (e.g., create, read, update, delete) as needed by different routes.

    - Start crud.py functions for interacting with the database in FastAPI
        endpoint functions.

    - Add exceptions to crud functions.

    - Add PATCH routes for partial updates?

    - Set up automated testing.

==============================================================================
"""

"""
==============================================================================
---- Starting the Server ----

To start the server, in AI-Fitness-Tracker/backend, run:
    uvicorn app.main:app --reload
for development, or:
    uvicorn app.main:app
for production.


---- Loading Data into the Database ---

To load all data into the database, in AI-Fitness-Tracker/backend, run:
    python -m app.main --load_all_data

To load food data into the database, in AI-Fitness-Tracker/backend, run:
    python -m app.main --load_food_data

To load branded_food data into the database, in AI-Fitness-Tracker/backend,
run:
    python -m app.main --load_branded_food_data
Note: The food table must already exist since branded_food depends on it.

To load nutrient data into the database, in AI-Fitness-Tracker/backend, run:
    python -m app.main --load_nutrient_data

To load food_nutrient data into the database, in AI-Fitness-Tracker/backend,
run:
    python -m app.main --load_food_nutrient_data
Note: The food and nutrient tables must already exist since food_nutrient
depends on it.

==============================================================================
"""

Base.metadata.create_all(bind=engine)

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

# ----------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Load data into the database")

    parser.add_argument(
        "--load_all_data",
        action="store_true",
        help="Load all data into the database"
    )
    parser.add_argument(
        "--load_food_data",
        action="store_true",
        help="Load food data into the database"
    )
    parser.add_argument(
        "--load_branded_food_data",
        action="store_true",
        help="Load branded_food data into the database"
    )
    parser.add_argument(
        "--load_nutrient_data",
        action="store_true",
        help="Load nutrient data into the database"
    )
    parser.add_argument(
        "--load_food_nutrient_data",
        action="store_true",
        help="Load food_nutrient data into the database"
    )

    args = parser.parse_args()

    if args.load_all_data:
        args.load_food_data = True
        args.load_branded_food_data = True
        args.load_nutrient_data = True
        args.load_food_nutrient_data = True

    if args.load_food_data:
        from data.load_food_data import load_food_data
        print("\nLoading food data...\n")
        load_food_data()
        print("\nfood data was loaded into the database.\n")

    if args.load_branded_food_data:
        from data.load_branded_food_data import load_branded_food_data
        print("\nLoading branded_food data...\n")
        load_branded_food_data()
        print("\nbranded_food data was loaded into the database.\n")
    
    if args.load_nutrient_data:
        from data.load_nutrient_data import load_nutrient_data
        print("\nLoading nutrient data...\n")
        load_nutrient_data()
        print("\nnutrient data was loaded into the database.\n")

    if args.load_food_nutrient_data:
        from data.load_food_nutrient_data import load_food_nutrient_data
        print("\nLoading food_nutrient data...\n")
        load_food_nutrient_data()
        print("\nfood_nutrient data was loaded into the database.\n")
    
if __name__ == "__main__":
    main()
