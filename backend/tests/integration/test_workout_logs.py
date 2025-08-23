import pytest
from app.schemas.workout_log import WorkoutLogResponse
from app.models.models import WorkoutLog
from datetime import datetime


@pytest.fixture
def workout_logs(user, another_user, session):
    workout_logs_data = [{
        "user_id": user["id"],
        "log_date": datetime.now().isoformat()
    }, {
        "user_id": user["id"],
        "log_date": datetime.now().isoformat()
    }, {
        "user_id": another_user["id"],
        "log_date": datetime.now().isoformat()
    }]

    def create_workout_log_model(workout_log):
        return WorkoutLog(**workout_log)

    workout_log_map = map(create_workout_log_model, workout_logs_data)
    new_workout_logs = list(workout_log_map)

    session.add_all(new_workout_logs)
    session.commit()

    workout_logs = session.query(WorkoutLog).all()

    return workout_logs

# ----------------------------------------------------------------------------

def test_create_workout_log(authorized_client, user):
    res = authorized_client.post("/workout-logs/", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 201
    new_workout_log = WorkoutLogResponse(**res.json())
    assert new_workout_log.user_id == user["id"]
    assert new_workout_log.workout_type is None
    assert new_workout_log.total_num_sets == 0
    assert new_workout_log.total_calories_burned is None

def test_create_workout_log_invalid(authorized_client):
    res = authorized_client.post("/workout-logs/", json={"log_date": ""})
    assert res.status_code == 422

def test_create_workout_log_unauthorized(client):
    res = client.post("/workout-logs/", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_workout_logs(authorized_client, workout_logs, user):
    res = authorized_client.get("/workout-logs/")
    assert res.status_code == 200
    workout_logs_list = [WorkoutLog(**workout_log) for workout_log in res.json()]
    user_workout_logs = [workout_log for workout_log in workout_logs if workout_log.user_id == user["id"]]
    assert len(workout_logs_list) == len(user_workout_logs)

def test_get_workout_logs_unauthorized(client, workout_logs):
    res = client.get("/workout-logs/")
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_workout_log(authorized_client, workout_logs, user):
    res = authorized_client.get(f"/workout-logs/{workout_logs[0].id}")
    assert res.status_code == 200
    workout_log = WorkoutLogResponse(**res.json())
    assert workout_log.user_id == user["id"]

def test_get_workout_log_unauthorized(client, workout_logs):
    res = client.get(f"/workout-logs/{workout_logs[0].id}")
    assert res.status_code == 401

def test_get_workout_log_not_owner(authorized_client, workout_logs):
    res = authorized_client.get(f"/workout-logs/{workout_logs[2].id}")
    assert res.status_code == 404

def test_workout_log_not_found(authorized_client, workout_logs, session):
    max_id = session.query(WorkoutLog.id).order_by(WorkoutLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/workout-logs/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_delete_workout_log(authorized_client, workout_logs):
    res = authorized_client.delete(f"/workout-logs/{workout_logs[0].id}")
    assert res.status_code == 204

def test_delete_workout_log_unauthorized(client, workout_logs):
    res = client.delete(f"/workout-logs/{workout_logs[0].id}")
    assert res.status_code == 401

def test_delete_workout_log_not_owner(authorized_client, workout_logs):
    res = authorized_client.delete(f"/workout-logs/{workout_logs[2].id}")
    assert res.status_code == 404

def test_delete_workout_log_not_found(authorized_client, workout_logs, session):
    max_id = session.query(WorkoutLog.id).order_by(WorkoutLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/workout-logs/{non_existent_id}")
    assert res.status_code == 404
