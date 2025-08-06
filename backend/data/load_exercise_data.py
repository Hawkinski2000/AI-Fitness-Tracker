from sqlalchemy.orm import Session
from sqlalchemy import text
import pandas as pd
import numpy as np
from app.models.models import Base, Exercise
from app.core.db import engine, get_db


def load_exercise_data():
    Base.metadata.create_all(bind=engine)

    df = pd.read_csv("data/gym_exercise_dataset/exercise.csv")

    df = df.replace({np.nan: None})

    df = df[["id",
             "Title",
             "Desc",
             "Type",
             "BodyPart",
             "Equipment",
             "Level"]]

    db_gen = get_db()
    db: Session = next(db_gen)

    for _, row in df.iterrows():
        if row["Equipment"] in (None, "Other", "Foam Roll", "Body Only", "Exercise Ball"):
            base_unit = None
        else:
            base_unit = "lbs"

        exercise = Exercise(
            id=int(row["id"]),
            name=row["Title"],
            description=row["Desc"],
            exercise_type=row["Type"],
            body_part=row["BodyPart"],
            equipment=row["Equipment"],
            level=row["Level"],
            base_unit=base_unit
        )
        db.add(exercise)
    db.flush()

    # Ensure when new exercises are created they use the next available id to avoid primary key conflicts.
    db.execute(text("SELECT setval('exercise_id_seq', (SELECT MAX(id) FROM exercise))"))

    db.commit()
    db.close()
