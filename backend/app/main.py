from fastapi import FastAPI
from .api.endpoints import (users, meal_logs, foods, workout_logs, exercises,
                            sleep_logs, mood_logs, insight_logs, insights,
                            weight_logs, meal_log_stats, exercise_stats,
                            sleep_log_stats, mood_log_stats, weight_log_stats)


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
