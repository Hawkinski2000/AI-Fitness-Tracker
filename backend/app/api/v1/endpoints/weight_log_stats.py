from fastapi import Response, status, APIRouter
from app.schemas.weight_log_stats import WeightLogStats


router = APIRouter(prefix="/api/weight-log-stats",
                   tags=['Weight Log Stats'])

# Create a weight log stats entry
@router.post("")
def create_weight_log_stats(weight_log_stats: WeightLogStats):
    # TODO
    return {"data": "weight log stats entry"}

# Get all weight log stats entries
@router.get("")
def get_all_weight_log_stats():
    # TODO
    return {"data": "weight log stats entries"}

# Get a weight log stats entry
@router.get("/{id}")
def get_weight_log_stats(id: int):
    # TODO
    return {"data": "weight log stats entry"}

# Update a weight log stats entry
@router.put("/{id}")
def update_weight_log_stats(id: int, weight_log_stats: WeightLogStats):
    # TODO
    return {"data": "weight log stats entry"}

# Delete a weight log stats entry
@router.delete("/{id}")
def delete_weight_log_stats(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
