from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
from app.models.models import Base, FoodNutrient, Food
from app.core.db import engine, get_db


def load_food_nutrient_data():
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("data/FoodData_Central_branded_food/food_nutrient_sample.csv")

    df = df.replace({np.nan: None})

    df = df[["id",
             "fdc_id",
             "nutrient_id",
             "amount"]]

    db_gen = get_db()
    db: Session = next(db_gen)

    for _, row in df.iterrows():
        food_nutrient = FoodNutrient(
            id=int(row["id"]),
            food_id=row["fdc_id"],
            nutrient_id=row["nutrient_id"],
            amount=row["amount"]
        )
        db.add(food_nutrient)

    db.commit()

    food_calorie_entries = (
        db.query(FoodNutrient.food_id, FoodNutrient.amount)
        .filter(FoodNutrient.nutrient_id == 1008)
        .all()
    )

    for food_id, calories in food_calorie_entries:
        db.query(Food).filter(Food.id == food_id).update({"calories": calories})

    db.commit()
    db.close()
