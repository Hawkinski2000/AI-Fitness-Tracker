import pytest
from app.schemas.meal_log import MealLogResponse
from app.models.models import MealLog
from datetime import datetime


@pytest.fixture
def meal_logs(user, another_user, session):
    meal_logs_data = [{
        "user_id": user["id"],
        "log_date": datetime.now().isoformat()
    }, {
        "user_id": user["id"],
        "log_date": datetime.now().isoformat()
    }, {
        "user_id": another_user["id"],
        "log_date": datetime.now().isoformat()
    }]

    def create_meal_log_model(meal_log):
        return MealLog(**meal_log)

    meal_log_map = map(create_meal_log_model, meal_logs_data)
    new_meal_logs = list(meal_log_map)

    session.add_all(new_meal_logs)
    session.commit()

    meal_logs = session.query(MealLog).all()

    return meal_logs

# ----------------------------------------------------------------------------

def test_create_meal_log(authorized_client, user):
    res = authorized_client.post("/api/meal-logs/", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 201
    new_meal_log = MealLogResponse(**res.json())
    assert new_meal_log.user_id == user["id"]
    assert new_meal_log.total_calories is None

def test_create_meal_log_invalid(authorized_client):
    res = authorized_client.post("/api/meal-logs/", json={"log_date": ""})
    assert res.status_code == 422

def test_create_meal_log_unauthorized(client):
    res = client.post("/api/meal-logs/", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_meal_logs(authorized_client, meal_logs, user):
    res = authorized_client.get("/api/meal-logs/")
    assert res.status_code == 200
    meal_logs_list = [MealLogResponse(**meal_log) for meal_log in res.json()]
    user_meal_logs = [meal_log for meal_log in meal_logs if meal_log.user_id == user["id"]]
    assert len(meal_logs_list) == len(user_meal_logs)

def test_get_meal_logs_unauthorized(client, meal_logs):
    res = client.get("/api/meal-logs/")
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_meal_log(authorized_client, meal_logs, user):
    res = authorized_client.get(f"/api/meal-logs/{meal_logs[0].id}")
    assert res.status_code == 200
    meal_log = MealLogResponse(**res.json())
    assert meal_log.user_id == user["id"]

def test_get_meal_log_unauthorized(client, meal_logs):
    res = client.get(f"/api/meal-logs/{meal_logs[0].id}")
    assert res.status_code == 401

def test_get_meal_log_not_owner(authorized_client, meal_logs):
    res = authorized_client.get(f"/api/meal-logs/{meal_logs[2].id}")
    assert res.status_code == 404

def test_meal_log_not_found(authorized_client, meal_logs, session):
    max_id = session.query(MealLog.id).order_by(MealLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/api/meal-logs/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_delete_meal_log(authorized_client, meal_logs):
    res = authorized_client.delete(f"/api/meal-logs/{meal_logs[0].id}")
    assert res.status_code == 204

def test_delete_meal_log_unauthorized(client, meal_logs):
    res = client.delete(f"/api/meal-logs/{meal_logs[0].id}")
    assert res.status_code == 401

def test_delete_meal_log_not_owner(authorized_client, meal_logs):
    res = authorized_client.delete(f"/api/meal-logs/{meal_logs[2].id}")
    assert res.status_code == 404

def test_delete_meal_log_not_found(authorized_client, meal_logs, session):
    max_id = session.query(MealLog.id).order_by(MealLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/api/meal-logs/{non_existent_id}")
    assert res.status_code == 404
