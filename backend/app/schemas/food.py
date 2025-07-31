from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class FoodBase(BaseModel):
    description: str
    calories: Optional[int] = None

class FoodCreate(FoodBase):
    pass

class FoodResponse(FoodBase):
    id: int
    user_created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
