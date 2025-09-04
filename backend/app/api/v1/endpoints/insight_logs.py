from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import insight_log
from app.crud import insight_logs as crud_insight_logs


router = APIRouter(prefix="/api/insight-logs",
                   tags=['Insight Logs'])

# Create an insight log
@router.post("", status_code=status.HTTP_201_CREATED, response_model=insight_log.InsightLogResponse)
def create_insight_log(insight_log: insight_log.InsightLogCreate, db: Session = Depends(get_db)):
    new_insight_log = crud_insight_logs.create_insight_log(insight_log, db)
    return new_insight_log

# Get all insight logs
@router.get("", response_model=list[insight_log.InsightLogResponse])
def get_insight_logs(db: Session = Depends(get_db)):
    insight_logs = crud_insight_logs.get_insight_logs(db)
    return insight_logs

# Get an insight log
@router.get("/{id}", response_model=insight_log.InsightLogResponse)
def get_insight_log(id: int, db: Session = Depends(get_db)):
    insight_log = crud_insight_logs.get_insight_log(id, db)
    return insight_log

# Update an insight log
@router.put("/{id}", response_model=insight_log.InsightLogResponse)
def update_insight_log(id: int, insight_log: insight_log.InsightLogCreate, db: Session = Depends(get_db)):
    updated_insight_log = crud_insight_logs.update_insight_log(id, insight_log, db)
    return updated_insight_log

# Delete an insight log
@router.delete("/{id}")
def delete_insight_log(id: int, db: Session = Depends(get_db)):
    crud_insight_logs.delete_insight_log(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
