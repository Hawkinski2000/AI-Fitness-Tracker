from pydantic import BaseModel, ConfigDict
from datetime import datetime


class WeightLogBase(BaseModel):
    log_date: datetime
    weight: float
    unit: str

class WeightLogCreate(WeightLogBase):
    pass

class WeightLogUpdate(BaseModel):
    weight: float
    unit: str

class WeightLogResponse(WeightLogBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
