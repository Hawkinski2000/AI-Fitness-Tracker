from fastapi import Response, status, APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.schemas import insight
from app.crud import insights as crud_insights


router = APIRouter(prefix="/api/insights",
                   tags=['Insights'])

# Create an insight
@router.post("", status_code=status.HTTP_201_CREATED, response_model=insight.InsightResponse)
def create_insight(insight: insight.InsightCreate, db: Session = Depends(get_db)):
    new_insight = crud_insights.create_insight(insight, db)
    return new_insight

# Get all insights
@router.get("", response_model=list[insight.InsightResponse])
def get_insights(db: Session = Depends(get_db)):
    insights = crud_insights.get_insights(db)
    return insights

# Get an insight
@router.get("/{id}", response_model=insight.InsightResponse)
def get_insight(id: int, db: Session = Depends(get_db)):
    insight = crud_insights.get_insight(id, db)
    return insight

# Update an insight
@router.put("/{id}", response_model=insight.InsightResponse)
def update_insight(id: int, insight: insight.InsightCreate, db: Session = Depends(get_db)):
    updated_insight = crud_insights.update_insight(id, insight, db)
    return updated_insight

# Delete an insight
@router.delete("/{id}")
def delete_insight(id: int, db: Session = Depends(get_db)):
    crud_insights.delete_insight(id, db)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
