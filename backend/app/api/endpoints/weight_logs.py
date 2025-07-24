from fastapi import Response, status, APIRouter
from app.schemas.weight_log import WeightLog


router = APIRouter(prefix="/weight-logs",
                   tags=['Weight Logs'])

# Create a weight log
@router.post("/")
def create_weight_log(weight_log: WeightLog):
    # TODO
    return {"data": "weight log"}

# Get all weight logs
@router.get("/")
def get_weight_logs():
    # TODO
    return {"data": "weight logs"}

# Get a weight log
@router.get("/{id}")
def get_weight_log(id: int):
    # TODO
    return {"data": "weight log"}

# Update a weight log
@router.put("/{id}")
def update_weight_log(id: int, weight_log: WeightLog):
    # TODO
    return {"data": "weight log"}

# Delete a weight log
@router.delete("/{id}")
def delete_weight_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
