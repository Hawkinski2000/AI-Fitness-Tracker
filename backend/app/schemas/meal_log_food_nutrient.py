from pydantic import BaseModel, ConfigDict


class MealLogFoodNutrientBase(BaseModel):
    meal_log_food_id: int
    # nutrient_id: int
    amount: float

class MealLogFoodNutrientCreate(MealLogFoodNutrientBase):
    pass

class MealLogFoodNutrientResponse(MealLogFoodNutrientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
