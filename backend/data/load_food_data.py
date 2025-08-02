from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
from app.models.models import Base, Food
from app.core.db import engine, get_db


def load_food_data():
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("data/FoodData_Central_branded_food/food_sample.csv")

    df = df.replace({np.nan: None})

    df = df[["fdc_id", "description"]]

    db_gen = get_db()
    db: Session = next(db_gen)

    for _, row in df.iterrows():
        food = Food(
            id=int(row["fdc_id"]),
            description=row["description"],
        )
        db.add(food)

    db.commit()
    db.close()
