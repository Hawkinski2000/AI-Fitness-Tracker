from pydantic import BaseModel, ConfigDict


class NutrientBase(BaseModel):
    name: str
    unit_name: str

class NutrientCreate(NutrientBase):
    pass

class NutrientResponse(NutrientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
