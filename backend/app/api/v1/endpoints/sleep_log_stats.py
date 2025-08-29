from fastapi import Response, status, APIRouter
from app.schemas.sleep_log_stats import SleepLogStats


router = APIRouter(prefix="/api/sleep-log-stats",
                   tags=['Sleep Log Stats'])

# Create a sleep log stats entry
@router.post("/")
def create_sleep_log_stats(sleep_log_stats: SleepLogStats):
    # TODO
    return {"data": "sleep log stats entry"}

# Get all sleep log stats entries
@router.get("/")
def get_all_sleep_log_stats():
    # TODO
    return {"data": "sleep log stats entries"}

# Get a sleep log stats entry
@router.get("/{id}")
def get_sleep_log_stats(id: int):
    # TODO
    return {"data": "sleep log stats entry"}

# Update a sleep log stats entry
@router.put("/{id}")
def update_sleep_log_stats(id: int, sleep_log_stats: SleepLogStats):
    # TODO
    return {"data": "sleep log stats entry"}

# Delete a sleep log stats entry
@router.delete("/{id}")
def delete_sleep_log_stats(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
