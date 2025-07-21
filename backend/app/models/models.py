from sqlalchemy import Column, Integer, String, Boolean, Float, Date, Text
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    settings = Column(JSONB, nullable=False)
    sex = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    height = Column(Integer, nullable=False)
    goal = Column(String, nullable=False)
    streak = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)

# ----------------------------------------------------------------------------

class MealLog(Base):
    __tablename__ = "meal_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    meal_type = Column(String, nullable=False)
    total_calories = Column(Integer)
    nutrients = Column(JSONB)

# ----------------------------------------------------------------------------

class Food(Base):
    __tablename__ = "food"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    based_num_servings = Column(Float, nullable=False)
    based_serving_size = Column(Float, nullable=False)
    calories = Column(Integer)
    nutrients = Column(JSONB)
    user_id = Column(Integer)
    user_created_at = Column(TIMESTAMP(timezone=True))

# ----------------------------------------------------------------------------

class WorkoutLog(Base):
    __tablename__ = "workout_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    workout_type = Column(String)
    total_calories_burned = Column(Integer)

# ----------------------------------------------------------------------------

class Exercise(Base):
    __tablename__ = "exercise"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    base_unit = Column(String)
    notes = Column(JSONB)
    user_id = Column(Integer)
    user_created_at = Column(TIMESTAMP(timezone=True))

# ----------------------------------------------------------------------------

class SleepLog(Base):
    __tablename__ = "sleep_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    time_to_bed = Column(TIMESTAMP(timezone=True), nullable=False)
    time_awake = Column(TIMESTAMP(timezone=True), nullable=False)
    duration = Column(Integer, nullable=False)
    sleep_score = Column(Integer)
    notes = Column(JSONB)

# ----------------------------------------------------------------------------

class MoodLog(Base):
    __tablename__ = "mood_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    mood_score = Column(Integer)
    notes = Column(JSONB)

# ----------------------------------------------------------------------------

class InsightLog(Base):
    __tablename__ = "insight_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    raw_text = Column(Text, nullable=False)
    summary = Column(Text)

# ----------------------------------------------------------------------------

class Insight(Base):
    __tablename__ = "insight"

    id = Column(Integer, primary_key=True, nullable=False)
    insights_log_id = Column(Integer, nullable=False)
    insight = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
    category = Column(String)

# ----------------------------------------------------------------------------

class WeightLog(Base):
    __tablename__ = "weight_log"

    id = Column(Integer, primary_key=True, nullable=False)
    user_id = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False)
