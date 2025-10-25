from pydantic import BaseModel, ConfigDict
from typing import Optional
from app.schemas.nutrient import NutrientResponse


class FoodNutrientBase(BaseModel):
    food_id: int
    nutrient_id: int
    amount: float

class FoodNutrientCreate(FoodNutrientBase):
    pass

class FoodNutrientResponse(FoodNutrientBase):
    id: int
    nutrient: Optional[NutrientResponse] = None

    model_config = ConfigDict(from_attributes=True)
