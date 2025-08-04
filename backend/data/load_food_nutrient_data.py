import psycopg2
import pandas as pd
import numpy as np
from tqdm import tqdm
import os
from app.core.db import DATABASE_URL


"""
==============================================================================
Todo:
    - Nutrients are based on 100 g or 100 ml samples depending on if the food
      is solid or liquid. the amount column in food_nutrient needs to be
      adjusted based on the actual serving sizes in g or ml in branded_food.
      
      
======
"""

def load_food_nutrient_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM food;")
    valid_food_ids = set(row[0] for row in cursor.fetchall())

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

        chunk = chunk.rename(columns={
            "id": "id",
            "fdc_id": "food_id"
        })

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

    cursor.close()
    conn.close()
