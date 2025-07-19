from fastapi import FastAPI, Response, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


app = FastAPI()

@app.get("/")
def root():
    # TODO
    return {"data": "root"}

# ----------------------------------------------------------------------------
# ---- Users ----

class User(BaseModel):
    id: Optional[int] = None
    email: str
    password_hash: str
    settings: dict
    sex: str
    age: int
    weight: float
    height: int
    goal: str
    streak: int
    created_at: datetime

# Create a user
@app.post("/users")
def create_user(user: User):
    # TODO
    return {"data": "user"}

# Get all users
@app.get("/users")
def get_users():
    # TODO
    return {"data": "users"}

# Get a user
@app.get("/users/{id}")
def get_user(id: int):
    # TODO
    return {"data": "user"}

# Update a user
@app.put("/users/{id}")
def update_user(id: int, user: User):
    # TODO
    return {"data": "user"}

# Delete a user
@app.delete("/users/{id}")
def delete_user(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Meal Logs ----

class MealLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    meal_type: str
    total_calories: Optional[int] = None
    nutrients: Optional[dict] = None

# Create a meal log
@app.post("/meal-logs")
def create_meal_log(meal_log: MealLog):
    # TODO
    return {"data": "meal log"}

# Get all meal logs
@app.get("/meal-logs")
def get_meal_logs():
    # TODO
    return {"data": "meal logs"}

# Get a meal log
@app.get("/meal-logs/{id}")
def get_meal_log(id: int):
    # TODO
    return {"data": "meal log"}

# Update a meal log
@app.put("/meal-logs/{id}")
def update_meal_log(id: int, meal_log: MealLog):
    # TODO
    return {"data": "meal log"}

# Delete a meal log
@app.delete("/meal-logs/{id}")
def delete_meal_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Foods ----

class Food(BaseModel):
    id: Optional[int] = None
    name: str
    base_num_servings: float
    base_serving_size: float
    calories: Optional[int] = None
    nutrients: Optional[dict] = None
    user_id: Optional[int] = None
    user_created_at: Optional[datetime] = None

# Create a food
@app.post("/foods")
def create_food(food: Food):
    # TODO
    return {"data": "food"}

# Get all foods
@app.get("/foods")
def get_foods():
    # TODO  
    return {"data": "foods"}

# Get a food
@app.get("/foods/{id}")
def get_food(id: int):
    # TODO
    return {"data": "food"}

# Update a food
@app.put("/foods/{id}")
def update_food(id: int, food: Food):
    # TODO
    return {"data": "food"}

# Delete a food
@app.delete("/foods/{id}")
def delete_food(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Workout Logs ----

class WorkoutLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    workout_type: Optional[str] = None
    total_calories_burned: Optional[int] = None

# Create a workout log
@app.post("/workout-logs")
def create_workout_log(workout_log: WorkoutLog):
    # TODO
    return {"data": "workout log"}

# Get all workout logs
@app.get("/workout-logs")
def get_workout_logs():
    # TODO
    return {"data": "workout logs"}

# Get a workout log
@app.get("/workout-logs/{id}")
def get_workout_log(id: int):
    # TODO
    return {"data": "workout log"}

# Update a workout log
@app.put("/workout-logs/{id}")
def update_workout_log(id: int, workout_log: WorkoutLog):
    # TODO
    return {"data": "workout log"}

# Delete a workout log
@app.delete("/workout-logs/{id}")
def delete_workout_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Exercises ----

class Exercise(BaseModel):
    id: Optional[int] = None
    name: str
    base_unit: Optional[str] = None
    notes: Optional[dict] = None
    user_id: Optional[int] = None
    user_created_at: Optional[datetime] = None

# Create an exercise
@app.post("/exercises")
def create_exercise(exercise: Exercise):
    # TODO
    return {"data": "exercise"}

# Get all exercises
@app.get("/exercises")
def get_exercises():
    # TODO
    return {"data": "exercises"}

# Get an exercise
@app.get("/exercises/{id}")
def get_exercise(id: int):
    # TODO
    return {"data": "exercise"}

# Update an exercise
@app.put("/exercises/{id}")
def update_exercise(id: int, exercise: Exercise):
    # TODO
    return {"data": "exercise"}

# Delete an exercise
@app.delete("/exercises/{id}")
def delete_exercise(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Sleep Logs ----

class SleepLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    time_to_bed: datetime
    time_awake: datetime
    duration: int
    sleep_score: Optional[int] = None
    notes: Optional[dict] = None


# Create a sleep log
@app.post("/sleep-logs")
def create_sleep_log(sleep_log: SleepLog):
    # TODO
    return {"data": "sleep log"}

# Get all sleep logs
@app.get("/sleep-logs")
def get_sleep_logs():
    # TODO
    return {"data": "sleep logs"}

# Get a sleep log
@app.get("/sleep-logs/{id}")
def get_sleep_log(id: int):
    # TODO
    return {"data": "sleep log"}

# Update a sleep log
@app.put("/sleep-logs/{id}")
def update_sleep_log(id: int, sleep_log: SleepLog):
    # TODO
    return {"data": "sleep log"}

# Delete a sleep log
@app.delete("/sleep-logs/{id}")
def delete_sleep_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Mood Logs ----

class MoodLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    date: datetime
    mood_score: Optional[int] = None
    notes: Optional[dict] = None


# Create a mood log
@app.post("/mood-logs")
def create_mood_log(mood_log: MoodLog):
    # TODO
    return {"data": "mood log"}

# Get all mood logs
@app.get("/mood-logs")
def get_mood_logs():
    # TODO
    return {"data": "mood logs"}

# Get a mood log
@app.get("/mood-logs/{id}")
def get_mood_log(id: int):
    # TODO
    return {"data": "mood log"}

# Update a mood log
@app.put("/mood-logs/{id}")
def update_mood_log(id: int, mood_log: MoodLog):
    # TODO
    return {"data": "mood log"}

# Delete a mood log
@app.delete("/mood-logs/{id}")
def delete_mood_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Insight Logs ----

class InsightLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    created_at: datetime
    raw_text: str
    summary: Optional[str] = None

# Create an insight log
@app.post("/insight-logs")
def create_insight_log(insight_log: InsightLog):
    # TODO
    return {"data": "insight log"}

# Get all insight logs
@app.get("/insight-logs")
def get_insight_logs():
    # TODO
    return {"data": "insight logs"}

# Get an insight log
@app.get("/insight-logs/{id}")
def get_insight_log(id: int):
    # TODO
    return {"data": "insight log"}

# Update an insight log
@app.put("/insight-logs/{id}")
def update_insight_log(id: int, insight_log: InsightLog):
    # TODO
    return {"data": "insight log"}

# Delete an insight log
@app.delete("/insight-logs/{id}")
def delete_insight_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Insights ----

class Insight(BaseModel):
    id: Optional[int] = None
    insights_log_id: int
    insight: str
    created_at: datetime
    category: Optional[str] = None

# Create an insight
@app.post("/insights")
def create_insight(insight: Insight):
    # TODO
    return {"data": "insight"}

# Get all insights
@app.get("/insights")
def get_insights():
    # TODO
    return {"data": "insights"}

# Get an insight
@app.get("/insights/{id}")
def get_insight(id: int):
    # TODO
    return {"data": "insight"}

# Update an insight
@app.put("/insights/{id}")
def update_insight(id: int, insight: Insight):
    # TODO
    return {"data": "insight"}

# Delete an insight
@app.delete("/insight/{id}")
def delete_insight(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# ----------------------------------------------------------------------------
# ---- Weight Logs ----

class WeightLog(BaseModel):
    id: Optional[int] = None
    user_id: int
    weight: float
    unit: str
    created_at: datetime

# Create a weight log
@app.post("/weight-logs")
def create_weight_log(weight_log: WeightLog):
    # TODO
    return {"data": "weight log"}

# Get all weight logs
@app.get("/weight-logs")
def get_weight_logs():
    # TODO
    return {"data": "weight logs"}

# Get a weight log
@app.get("/weight-logs/{id}")
def get_weight_log(id: int):
    # TODO
    return {"data": "weight log"}

# Update a weight log
@app.put("/weight-logs/{id}")
def update_weight_log(id: int, weight_log: WeightLog):
    # TODO
    return {"data": "weight log"}

# Delete a weight log
@app.delete("/weight-logs/{id}")
def delete_weight_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
