import pandas as pd
import numpy as np
import psycopg2
from tqdm import tqdm
import os
from app.core.db import DATABASE_URL


def load_branded_food_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM food")
    valid_food_ids = set(row[0] for row in cursor.fetchall())

    chunk_size = 100000
    chunk_iter = pd.read_csv(
        "data/FoodData_Central_branded_food/branded_food.csv",
        usecols=[
            "fdc_id",
            "brand_owner",
            "brand_name",
            "subbrand_name",
            "ingredients",
            "serving_size",
            "serving_size_unit",
            "branded_food_category",
        ],
        chunksize=chunk_size
    )

    total_rows = 1977397
    for chunk in tqdm(chunk_iter, total=total_rows // chunk_size + 1, desc="Loading branded_food data"):
        chunk = chunk.replace({np.nan: None})

        chunk = chunk[chunk["fdc_id"].isin(valid_food_ids)]

        if chunk.empty:
            continue

        chunk["serving_size_unit"] = chunk["serving_size_unit"].replace({
            "MC": "g",
            "GM": "g",
            "GRM": "g",
            "MG": "g",
            "IU": "g",
            "MLT": "ml"
        })

        chunk = chunk.rename(columns={
            "fdc_id": "food_id",
            "branded_food_category": "food_category"
        })

        temp_csv_path = f"temp_branded_food.csv"
        chunk.to_csv(temp_csv_path, index=False, header=False)

        with open(temp_csv_path, "r", encoding="utf-8") as f:
            cursor.copy_expert(
                """
                    COPY branded_food (
                        food_id,
                        brand_owner,
                        brand_name,
                        subbrand_name,
                        ingredients,
                        serving_size,
                        serving_size_unit,
                        food_category
                    )
                    FROM STDIN WITH CSV
                """,
                f
            )
        conn.commit()
        os.remove(temp_csv_path)

    cursor.close()
    conn.close()
