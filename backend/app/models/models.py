from sqlalchemy import Integer, String, Float, Date, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime, date
from typing import Optional


"""
==============================================================================
Todo:
    - Add association tables for many-to-many relationships. Consider adding 
      additional tables and modifying the ER diagram to normalize data, e.g., 
      instead of using integer arrays for the weights, reps, etc. in 
      workout_log_exercise, create a Set table that stores this data for an
      individual set.
      
      Another example is the "nutrients" rows like in the meal_log and food
      tables, which could have their own Nutrients table. It could be shared
      between them by adding something like a "type" column, e.g., the type
      could be "meal_log" or "food".
    
    - Add stats tables.

    - Add insight_visualization table.

==============================================================================
"""


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    username: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    settings: Mapped[dict] = mapped_column(JSONB, nullable=False)
    sex: Mapped[str] = mapped_column(String, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    height: Mapped[int] = mapped_column(Integer, nullable=False)
    goal: Mapped[str] = mapped_column(String, nullable=False)
    streak: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)

    meal_logs: Mapped[list["MealLog"]] = relationship("MealLog", back_populates="user", cascade="all, delete-orphan")
    foods: Mapped[list["Food"]] = relationship("Food", back_populates="user", cascade="all, delete-orphan")
    workout_logs: Mapped[list["WorkoutLog"]] = relationship("WorkoutLog", back_populates="user", cascade="all, delete-orphan")
    exercises: Mapped[list["Exercise"]] = relationship("Exercise", back_populates="user", cascade="all, delete-orphan")
    sleep_logs: Mapped[list["SleepLog"]] = relationship("SleepLog", back_populates="user", cascade="all, delete-orphan")
    mood_logs: Mapped[list["MoodLog"]] = relationship("MoodLog", back_populates="user", cascade="all, delete-orphan")
    insight_logs: Mapped[list["InsightLog"]] = relationship("InsightLog", back_populates="user", cascade="all, delete-orphan")
    weight_logs: Mapped[list["WeightLog"]] = relationship("WeightLog", back_populates="user", cascade="all, delete-orphan")

# ----------------------------------------------------------------------------

class MealLog(Base):
    __tablename__ = "meal_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    meal_type: Mapped[str] = mapped_column(String, nullable=False)
    total_calories: Mapped[Optional[int]] = mapped_column(Integer)
    nutrients: Mapped[Optional[dict]] = mapped_column(JSONB)

    user: Mapped["User"] = relationship("User", back_populates="meal_logs")

# ----------------------------------------------------------------------------

class Food(Base):
    __tablename__ = "food"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    based_num_servings: Mapped[float] = mapped_column(Float, nullable=False)
    based_serving_size: Mapped[float] = mapped_column(Float, nullable=False)
    calories: Mapped[Optional[int]] = mapped_column(Integer)
    nutrients: Mapped[Optional[dict]] = mapped_column(JSONB)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("user.id"))
    user_created_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))

    user: Mapped["User"] = relationship("User", back_populates="foods")

# ----------------------------------------------------------------------------

class WorkoutLog(Base):
    __tablename__ = "workout_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    workout_type: Mapped[Optional[str]] = mapped_column(String)
    total_calories_burned: Mapped[Optional[int]] = mapped_column(Integer)

    user: Mapped["User"] = relationship("User", back_populates="workout_logs")

# ----------------------------------------------------------------------------

class Exercise(Base):
    __tablename__ = "exercise"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    base_unit: Mapped[Optional[str]] = mapped_column(String)
    notes: Mapped[Optional[dict]] = mapped_column(JSONB)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("user.id"))
    user_created_at: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP(timezone=True))

    user: Mapped["User"] = relationship("User", back_populates="exercises")

# ----------------------------------------------------------------------------

class SleepLog(Base):
    __tablename__ = "sleep_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    time_to_bed: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    time_awake: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    sleep_score: Mapped[Optional[int]] = mapped_column(Integer)
    notes: Mapped[Optional[dict]] = mapped_column(JSONB)

    user: Mapped["User"] = relationship("User", back_populates="sleep_logs")

# ----------------------------------------------------------------------------

class MoodLog(Base):
    __tablename__ = "mood_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    mood_score: Mapped[Optional[int]] = mapped_column(Integer)
    notes: Mapped[Optional[dict]] = mapped_column(JSONB)

    user: Mapped["User"] = relationship("User", back_populates="mood_logs")

# ----------------------------------------------------------------------------

class InsightLog(Base):
    __tablename__ = "insight_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text)

    user: Mapped["User"] = relationship("User", back_populates="insight_logs")
    insights: Mapped[list["Insight"]] = relationship("Insight", back_populates="insight_log", cascade="all, delete-orphan")

# ----------------------------------------------------------------------------

class Insight(Base):
    __tablename__ = "insight"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    insight_log_id: Mapped[int] = mapped_column(Integer, ForeignKey("insight_log.id"), nullable=False)
    insight: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String)

    insight_log: Mapped["InsightLog"] = relationship("InsightLog", back_populates="insights")

# ----------------------------------------------------------------------------

class WeightLog(Base):
    __tablename__ = "weight_log"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="weight_logs")
