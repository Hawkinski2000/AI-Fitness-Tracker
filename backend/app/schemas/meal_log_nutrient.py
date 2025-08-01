from pydantic import BaseModel, ConfigDict


class MealLogNutrientBase(BaseModel):
    meal_log_id: int
    nutrient_id: int
    amount: float

class MealLogNutrientCreate(MealLogNutrientBase):
    pass

class MealLogNutrientResponse(MealLogNutrientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
