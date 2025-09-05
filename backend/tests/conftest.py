import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.config import settings
from app.models import models
from app.core.db import get_db
from app.core.oauth2 import create_access_token


"""
==============================================================================
---- Running Tests ----

To run all tests, in AI-Fitness-Tracker/backend, run:
    python -m pytest -v -s

To run all tests with warnings disabled, in AI-Fitness-Tracker/backend, run:
    python -m pytest -v -s --disable-warnings

==============================================================================
"""

TEST_DATABASE_URL = (
    f"postgresql://"
    f"{settings.database_username}:"
    f"{settings.database_password}@"
    f"{settings.database_hostname}:"
    f"{settings.database_port}/"
    f"{settings.database_name}_test"
)

engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def session():
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client(session):
    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db

    yield TestClient(app)

@pytest.fixture
def mock_recaptcha():
    with patch("app.crud.users.requests.post") as mock_post:
        mock_post.return_value.json.return_value = {"success": True}
        yield mock_post

@pytest.fixture
def user(client, mock_recaptcha):
    user_data = {"username": "username",
                 "email": "email@gmail.com",
                 "password": "password",
                 "recaptcha_token": "recaptcha_token"}

    res = client.post("/api/users", json=user_data)

    new_user = res.json()
    new_user["password"] = user_data["password"]

    return new_user

@pytest.fixture
def another_user(client, mock_recaptcha):
    user_data = {"username": "username2",
                 "email": "email2@gmail.com",
                 "password": "password2",
                 "recaptcha_token": "recaptcha_token"}

    res = client.post("/api/users", json=user_data)

    new_user = res.json()
    new_user["password"] = user_data["password"]
    
    return new_user

@pytest.fixture
def token(user):
    return create_access_token({"user_id": user["id"]})

@pytest.fixture
def authorized_client(client, token):
    client.headers = {"Authorization": f"Bearer {token}"}
    return client
