from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import weight_log
from app.crud import weight_logs as crud_weight_logs


router = APIRouter(prefix="/weight-logs",
                   tags=['Weight Logs'])

# Create a weight log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=weight_log.WeightLogResponse)
def create_weight_log(weight_log: weight_log.WeightLogCreate, db: Session = Depends(get_db)):
    new_weight_log = crud_weight_logs.create_weight_log(weight_log, db)
    return new_weight_log

# Get all weight logs
@router.get("/", response_model=list[weight_log.WeightLogResponse])
def get_weight_logs(db: Session = Depends(get_db)):
    weight_logs = crud_weight_logs.get_weight_logs(db)
    return weight_logs

# Get a weight log
@router.get("/{id}", response_model=weight_log.WeightLogResponse)
def get_weight_log(id: int, db: Session = Depends(get_db)):
    weight_log = crud_weight_logs.get_weight_log(id, db)
    return weight_log

# Update a weight log
@router.put("/{id}", response_model=weight_log.WeightLogResponse)
def update_weight_log(id: int, weight_log: weight_log.WeightLogCreate, db: Session = Depends(get_db)):
    updated_weight_log = crud_weight_logs.update_weight_log(id, weight_log, db)
    return updated_weight_log

# Delete a weight log
@router.delete("/{id}")
def delete_weight_log(id: int, db: Session = Depends(get_db)):
    crud_weight_logs.delete_weight_log(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
