from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import weight_log, token
from app.crud import weight_logs as crud_weight_logs
from app.core.oauth2 import get_current_user


router = APIRouter(prefix="/api/weight-logs",
                   tags=['Weight Logs'])

# Create a weight log
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=weight_log.WeightLogResponse)
def create_weight_log(weight_log: weight_log.WeightLogCreate, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    new_weight_log = crud_weight_logs.create_weight_log(weight_log, current_user.user_id, db)
    return new_weight_log

# Get all weight logs
@router.get("/", response_model=list[weight_log.WeightLogResponse])
def get_weight_logs(current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    weight_logs = crud_weight_logs.get_weight_logs(current_user.user_id, db)
    return weight_logs

# Get a weight log
@router.get("/{id}", response_model=weight_log.WeightLogResponse)
def get_weight_log(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    weight_log = crud_weight_logs.get_weight_log(id, current_user.user_id, db)
    return weight_log

# Update a weight log
@router.put("/{id}", response_model=weight_log.WeightLogResponse)
def update_weight_log(id: int, weight_log: weight_log.WeightLogCreate, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_weight_log = crud_weight_logs.update_weight_log(id, weight_log, current_user.user_id, db)
    return updated_weight_log

# Delete a weight log
@router.delete("/{id}")
def delete_weight_log(id: int, current_user: token.TokenData = Depends(get_current_user), db: Session = Depends(get_db)):
    crud_weight_logs.delete_weight_log(id, current_user.user_id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
