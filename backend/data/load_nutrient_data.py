from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
import numpy as np
from app.models.models import Base, Nutrient
from app.core.db import engine, get_db


def load_nutrient_data():
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("data/FoodData_Central_branded_food/nutrient.csv")

    df = df.replace({np.nan: None})

    df = df[["id",
             "name",
             "unit_name"]]

    db_gen = get_db()
    db: Session = next(db_gen)

    for _, row in df.iterrows():
        nutrient = Nutrient(
            id=int(row["id"]),
            name=row["name"],
            unit_name=row["unit_name"]
        )
        db.add(nutrient)
    db.flush()

    # Ensure when new nutrients are created they use the next available id to avoid primary key conflicts.
    db.execute(text("SELECT setval('nutrient_id_seq', (SELECT MAX(id) FROM nutrient))"))

    db.commit()
    db.close()
