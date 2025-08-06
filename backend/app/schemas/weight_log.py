from pydantic import BaseModel, ConfigDict
from datetime import datetime


class WeightLogBase(BaseModel):
    user_id: int
    log_date: datetime
    weight: float
    unit: str

class WeightLogCreate(WeightLogBase):
    pass

class WeightLogResponse(WeightLogBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
