import pytest
from app.schemas.user import UserResponse
from app.models.models import User


@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username",
          "email": "email@gmail.com",
          "password": "password",
          "recaptcha_token": "recaptcha_token"},
          201),
        ({"username": "username",
          "email": "email@gmail.com",
          "password": "password",
          "recaptcha_token": "recaptcha_token",
          "first_name": "first_name",
          "goal": "goal"},
          201)
    ]
)
def test_create_user(client, data, mock_recaptcha, status_code):
    res = client.post("/api/users", json=data)
    assert res.status_code == status_code
    new_user = UserResponse(**res.json())
    assert new_user.username == data["username"]
    assert new_user.email == data["email"]
    assert "password" not in res.json()
    assert new_user.input_tokens_remaining > 0
    assert new_user.output_tokens_remaining > 0

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"email": [],
          "password": "password",
          "recaptcha_token": "recaptcha_token"},
          422),
        ({"username": "username",
          "password": [],
          "recaptcha_token": "recaptcha_token"},
          422)
    ]
)
def test_create_user_invalid(client, data, mock_recaptcha, status_code):
    res = client.post("/api/users", json=data)
    assert res.status_code == status_code

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username",
          "email": "email2@gmail.com",
          "password": "password",
          "recaptcha_token": "recaptcha_token"},
          409),
        ({"username": "username2",
          "email": "email@gmail.com",
          "password": "password",
          "recaptcha_token": "recaptcha_token"},
          409)
    ]
)
def test_create_user_duplicate(client, user, data, mock_recaptcha, status_code):
    res = client.post("/api/users", json=data)
    assert res.status_code == status_code

# ----------------------------------------------------------------------------

def test_get_user(authorized_client, user):
    res = authorized_client.get(f"/api/users/{user["id"]}")
    assert res.status_code == 200
    user = UserResponse(**res.json())

def test_get_user_unauthorized(client, user):
    res = client.get(f"/api/users/{user["id"]}")
    assert res.status_code == 401

def test_get_user_not_owner(authorized_client, another_user):
    res = authorized_client.get(f"/api/users/{another_user["id"]}")
    assert res.status_code == 404

def test_get_user_not_found(authorized_client, session):
    max_id = session.query(User.id).order_by(User.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/api/users/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "new_username"},
          200),
        ({"username": "username",
          "first_name": "first_name",
          "goal": "new_goal"},
          200)
    ]
)
def test_update_user(authorized_client, user, data, status_code):
    res = authorized_client.patch("/api/users", json=data)
    assert res.status_code == status_code
    new_user = UserResponse(**res.json())
    assert new_user.username == data["username"]
    assert "email" in res.json()
    assert "password" not in res.json()
    assert new_user.input_tokens_remaining > 0
    assert new_user.output_tokens_remaining > 0

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username",
          "email": "email@gmail.com"},
          422)
    ]
)
def test_update_user_invalid(authorized_client, user, data, status_code):
    res = authorized_client.patch("/api/users", json=data)
    assert res.status_code == status_code

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username2"},
          409)
    ]
)
def test_update_user_duplicate(authorized_client, another_user, data, status_code):
    res = authorized_client.patch("/api/users", json=data)
    assert res.status_code == status_code

def test_update_user_unauthorized(client, user):
    res = client.patch(f"/api/users",
                     json={"username": "username"})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_delete_user(authorized_client, user):
    res = authorized_client.delete(f"/api/users/{user["id"]}")
    assert res.status_code == 204

def test_delete_user_unauthorized(client, user):
    res = client.delete(f"/api/users/{user["id"]}")
    assert res.status_code == 401

def test_delete_user_not_owner(authorized_client, another_user):
    res = authorized_client.delete(f"/api/users/{another_user["id"]}")
    assert res.status_code == 404

def test_delete_user_not_found(authorized_client, session):
    max_id = session.query(User.id).order_by(User.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/api/users/{non_existent_id}")
    assert res.status_code == 404
