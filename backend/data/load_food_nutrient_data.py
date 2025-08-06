import psycopg2
import pandas as pd
import numpy as np
from tqdm import tqdm
import os
from app.core.db import DATABASE_URL


def load_food_nutrient_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM food;")
    valid_food_ids = set(row[0] for row in cursor.fetchall())

    cursor.execute("""
        SELECT food_id, serving_size, serving_size_unit
        FROM branded_food
        WHERE serving_size IS NOT NULL AND serving_size_unit IN ('g', 'ml');
    """)
    serving_size_map = {row[0]: row[1] for row in cursor.fetchall()}

    chunk_size = 1000000
    chunk_iter = pd.read_csv(
        "data/FoodData_Central_branded_food/food_nutrient.csv",
        usecols=["id", "fdc_id", "nutrient_id", "amount"],
        chunksize=chunk_size
    )

    total_rows = 25652682
    for chunk in tqdm(chunk_iter, total=total_rows // chunk_size + 1, desc="Loading food_nutrient data"):
        chunk = chunk.replace({np.nan: None})

        chunk = chunk[chunk["fdc_id"].isin(valid_food_ids)]

        if chunk.empty:
            continue

        chunk = chunk.rename(columns={"fdc_id": "food_id"})

        chunk["serving_size"] = chunk["food_id"].map(serving_size_map)
        chunk["amount"] = (chunk["amount"] * (chunk["serving_size"] / 100)).fillna(chunk["amount"])
        chunk = chunk.drop(columns=["serving_size"])

        temp_csv_path = "temp_food_nutrient.csv"
        chunk.to_csv(temp_csv_path, index=False, header=False)

        with open(temp_csv_path, "r", encoding="utf-8") as f:
            cursor.copy_expert(
                """
                    COPY food_nutrient (
                        id,
                        food_id,
                        nutrient_id,
                        amount
                    )
                    FROM STDIN WITH CSV
                """,
                f
            )
        conn.commit()
        os.remove(temp_csv_path)

    print("\nUpdating food calories...\n")
    cursor.execute("""
        WITH calories_cte AS (
            SELECT food_id, amount
            FROM food_nutrient
            WHERE nutrient_id = 1008
        )
        UPDATE food
        SET calories = calories_cte.amount
        FROM calories_cte
        WHERE food.id = calories_cte.food_id;
    """)
    conn.commit()

    # Ensure when new food_nutrients are created they use the next available id to avoid primary key conflicts.
    cursor.execute("SELECT setval('food_nutrient_id_seq', (SELECT MAX(id) FROM food_nutrient))")
    conn.commit()

    cursor.close()
    conn.close()
