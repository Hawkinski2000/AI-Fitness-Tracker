from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
from app.models.models import Base, BrandedFood
from app.core.db import engine, get_db


def load_branded_food_data():
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("data/FoodData_Central_branded_food/branded_food_sample.csv")

    df = df.replace({np.nan: None})

    df = df[["fdc_id",
             "brand_owner",
             "brand_name",
             "subbrand_name",
             "ingredients",
             "serving_size",
             "serving_size_unit",
             "branded_food_category"]]

    db_gen = get_db()
    db: Session = next(db_gen)

    for _, row in df.iterrows():
        branded_food = BrandedFood(
            food_id=int(row["fdc_id"]),
            brand_owner=row["brand_owner"],
            brand_name=row["brand_name"],
            subbrand_name=row["subbrand_name"],
            ingredients=row["ingredients"],
            serving_size=row["serving_size"],
            serving_size_unit=row["serving_size_unit"],
            food_category=row["branded_food_category"]
        )
        db.add(branded_food)

    db.commit()
    db.close()
