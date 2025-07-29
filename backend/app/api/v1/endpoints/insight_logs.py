from fastapi import Response, status, APIRouter
from app.schemas.insight_log import InsightLog


router = APIRouter(prefix="/insight-logs",
                   tags=['Insight Logs'])

# Create an insight log
@router.post("/")
def create_insight_log(insight_log: InsightLog):
    # TODO
    return {"data": "insight log"}

# Get all insight logs
@router.get("/")
def get_insight_logs():
    # TODO
    return {"data": "insight logs"}

# Get an insight log
@router.get("/{id}")
def get_insight_log(id: int):
    # TODO
    return {"data": "insight log"}

# Update an insight log
@router.put("/{id}")
def update_insight_log(id: int, insight_log: InsightLog):
    # TODO
    return {"data": "insight log"}

# Delete an insight log
@router.delete("/{id}")
def delete_insight_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
