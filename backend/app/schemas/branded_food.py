from pydantic import BaseModel, ConfigDict
from typing import Optional


class BrandedFoodBase(BaseModel):
    food_id: int
    brand_owner: Optional[str] = None
    brand_name: Optional[str] = None
    subbrand_name: Optional[str] = None
    ingredients: Optional[str] = None
    serving_size: Optional[float] = None
    serving_size_unit: Optional[str] = None
    food_category: Optional[str] = None

class BrandedFoodCreate(BrandedFoodBase):
    pass

class BrandedFoodResponse(BrandedFoodBase):
    pass

    model_config = ConfigDict(from_attributes=True)
