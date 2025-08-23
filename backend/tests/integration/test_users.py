import pytest
from app.schemas import user


@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username",
          "email": "email@gmail.com",
          "password": "password"},
          201),
        ({"username": "username",
          "email": "email@gmail.com",
          "password": "password",
          "first_name": "first_name",
          "goal": "goal"},
          201)
    ]
)
def test_create_user(client, data, status_code):
    res = client.post("/users/", json=data)
    assert res.status_code == status_code
    new_user = user.UserResponse(**res.json())
    assert new_user.username == data["username"]
    assert new_user.email == data["email"]
    assert "password" not in res.json()
    assert new_user.input_tokens_remaining > 0
    assert new_user.output_tokens_remaining > 0

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"email": "email@gmail.com",
          "password": "password"},
          422),
        ({"username": "username",
          "password": "password"},
          422),
        ({"username": "username",
          "email": "email@gmail.com"},
          422),
        ({"username": "username",
          "email": "email",
          "password": "password"},
          422)
    ]
)
def test_invalid_create_user(client, data, status_code):
    res = client.post("/users/", json=data)
    assert res.status_code == status_code

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"username": "username",
          "email": "email2@gmail.com",
          "password": "password"},
          409),
        ({"username": "username2",
          "email": "email@gmail.com",
          "password": "password"},
          409)
    ]
)
def test_duplicate_create_user(client, user, data, status_code):
    res = client.post("/users/", json=data)
    assert res.status_code == status_code

# ----------------------------------------------------------------------------
