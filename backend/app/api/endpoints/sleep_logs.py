from fastapi import Response, status, APIRouter
from app.schemas.sleep_log import SleepLog


router = APIRouter(prefix="/sleep-logs",
                   tags=['Sleep Logs'])

# Create a sleep log
@router.post("/")
def create_sleep_log(sleep_log: SleepLog):
    # TODO
    return {"data": "sleep log"}

# Get all sleep logs
@router.get("/")
def get_sleep_logs():
    # TODO
    return {"data": "sleep logs"}

# Get a sleep log
@router.get("/{id}")
def get_sleep_log(id: int):
    # TODO
    return {"data": "sleep log"}

# Update a sleep log
@router.put("/{id}")
def update_sleep_log(id: int, sleep_log: SleepLog):
    # TODO
    return {"data": "sleep log"}

# Delete a sleep log
@router.delete("/{id}")
def delete_sleep_log(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
