from fastapi import Response, status, APIRouter
from app.schemas.insight import Insight


router = APIRouter(prefix="/insights",
                   tags=['Insights'])

# Create an insight
@router.post("/")
def create_insight(insight: Insight):
    # TODO
    return {"data": "insight"}

# Get all insights
@router.get("/")
def get_insights():
    # TODO
    return {"data": "insights"}

# Get an insight
@router.get("/{id}")
def get_insight(id: int):
    # TODO
    return {"data": "insight"}

# Update an insight
@router.put("/{id}")
def update_insight(id: int, insight: Insight):
    # TODO
    return {"data": "insight"}

# Delete an insight
@router.delete("/{id}")
def delete_insight(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
