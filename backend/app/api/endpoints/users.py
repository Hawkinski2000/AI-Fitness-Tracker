from fastapi import Response, status, APIRouter
from app.schemas.user import User


router = APIRouter(prefix="/users",
                   tags=['Users'])

# Create a user
@router.post("/")
def create_user(user: User):
    # TODO
    return {"data": "user"}

# Get all users
@router.get("/")
def get_users():
    # TODO
    return {"data": "users"}

# Get a user
@router.get("/{id}")
def get_user(id: int):
    # TODO
    return {"data": "user"}

# Update a user
@router.put("/{id}")
def update_user(id: int, user: User):
    # TODO
    return {"data": "user"}

# Delete a user
@router.delete("/{id}")
def delete_user(id: int):
    # TODO
    return Response(status_code=status.HTTP_204_NO_CONTENT)
