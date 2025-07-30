from pydantic import BaseModel
from typing import Optional


class Nutrient(BaseModel):
    id: Optional[int] = None
    name: str
    unit_name: str
