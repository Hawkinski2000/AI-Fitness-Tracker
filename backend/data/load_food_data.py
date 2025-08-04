import pandas as pd
import numpy as np
import psycopg2
from tqdm import tqdm
import os
from app.core.db import DATABASE_URL


def load_food_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    chunk_size = 500000
    chunk_iter = pd.read_csv(
        "data/FoodData_Central_branded_food/food.csv",
        usecols=["fdc_id", "description"],
        chunksize=chunk_size
    )

    total_rows = 1977397
    for chunk in tqdm(chunk_iter, total=total_rows // chunk_size + 1, desc="Loading food data"):
        chunk = chunk.replace({np.nan: None})
        chunk = chunk[chunk["description"].notnull()]

        chunk = chunk.rename(columns={"fdc_id": "id"})

        if chunk.empty:
            continue

        temp_csv_path = "temp_food.csv"
        chunk.to_csv(temp_csv_path, index=False, header=False)

        with open(temp_csv_path, "r", encoding="utf-8") as f:
            cursor.copy_expert(
                """
                    COPY food (
                        id,
                        description
                    )
                    FROM STDIN WITH CSV
                """,
                f
            )
        conn.commit()
        os.remove(temp_csv_path)

    cursor.close()
    conn.close()
