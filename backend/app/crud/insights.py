from sqlalchemy.orm import Session
from app.schemas import insight
from app.models.models import Insight
import app.agent.agent as agent


def create_insight(insight: insight.InsightCreate, db: Session):
    new_insight = Insight(**insight.model_dump(exclude_unset=True))

    new_insight.insight = agent.generate_insight()

    agent.get_history()

    db.add(new_insight)
    db.commit()
    db.refresh(new_insight)
    return new_insight

def get_insights(db: Session):
    insights = db.query(Insight).all()
    return insights

def get_insight(id: int, db: Session):
    insight = db.query(Insight).filter(Insight.id == id).first()
    return insight

def update_insight(id: int, insight: insight.InsightCreate, db: Session):
    insight_query = db.query(Insight).filter(Insight.id == id)
    insight_query.update(insight.model_dump(), synchronize_session=False)
    db.commit()
    updated_insight = insight_query.first()
    return updated_insight

def delete_insight(id: int, db: Session):
    insight_query = db.query(Insight).filter(Insight.id == id)
    insight_query.delete(synchronize_session=False)
    db.commit()
