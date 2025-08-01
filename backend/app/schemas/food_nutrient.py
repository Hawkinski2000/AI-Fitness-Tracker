from pydantic import BaseModel, ConfigDict


class FoodNutrientBase(BaseModel):
    food_id: int
    # nutrient_id: int
    amount: float

class FoodNutrientCreate(FoodNutrientBase):
    pass

class FoodNutrientResponse(FoodNutrientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
