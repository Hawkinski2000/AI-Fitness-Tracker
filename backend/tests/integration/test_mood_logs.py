import pytest
from app.schemas.mood_log import MoodLogResponse
from app.models.models import MoodLog
from datetime import datetime


@pytest.fixture
def mood_logs(user, another_user, session):
    mood_logs_data = [{
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
    }, {
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
        "mood_score": 9
    }, {
        "user_id": another_user["id"],
        "log_date": datetime.now().isoformat()
    }]

    def create_mood_log_model(mood_log):
        return MoodLog(**mood_log)

    mood_log_map = map(create_mood_log_model, mood_logs_data)
    new_mood_logs = list(mood_log_map)

    session.add_all(new_mood_logs)
    session.commit()

    mood_logs = session.query(MoodLog).all()

    return mood_logs

# ----------------------------------------------------------------------------

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"log_date": datetime.now().isoformat()},
          201),
        ({"log_date": datetime.now().isoformat(),
          "mood_score": 9},
          201),
    ]
)
def test_create_mood_log(authorized_client, user, data, status_code):
    res = authorized_client.post("/api/mood-logs/", json=data)
    assert res.status_code == status_code
    new_mood_log = MoodLogResponse(**res.json())
    assert new_mood_log.user_id == user["id"]

def test_create_mood_log_invalid(authorized_client):
    res = authorized_client.post("/api/mood-logs/", json={"log_date": ""})
    assert res.status_code == 422

def test_create_mood_log_unauthorized(client):
    res = client.post("/api/mood-logs/",
                      json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_mood_logs(authorized_client, mood_logs, user):
    res = authorized_client.get("/api/mood-logs/")
    assert res.status_code == 200
    mood_logs_list = [MoodLog(**mood_log) for mood_log in res.json()]
    user_mood_logs = [mood_log for mood_log in mood_logs if mood_log.user_id == user["id"]]
    assert len(mood_logs_list) == len(user_mood_logs)

def test_get_mood_logs_unauthorized(client, mood_logs):
    res = client.get("/api/mood-logs/")
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_mood_log(authorized_client, mood_logs, user):
    res = authorized_client.get(f"/api/mood-logs/{mood_logs[0].id}")
    assert res.status_code == 200
    mood_log = MoodLogResponse(**res.json())
    assert mood_log.user_id == user["id"]

def test_get_mood_log_unauthorized(client, mood_logs):
    res = client.get(f"/api/mood-logs/{mood_logs[0].id}")
    assert res.status_code == 401

def test_get_mood_log_not_owner(authorized_client, mood_logs):
    res = authorized_client.get(f"/api/mood-logs/{mood_logs[2].id}")
    assert res.status_code == 404

def test_mood_log_not_found(authorized_client, mood_logs, session):
    max_id = session.query(MoodLog.id).order_by(MoodLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/api/mood-logs/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"log_date": datetime.now().isoformat()},
          200),
        ({"log_date": datetime.now().isoformat(),
          "mood_score": 9},
          200),
    ]
)
def test_update_mood_log(authorized_client, mood_logs, data, status_code):
    res = authorized_client.put(f"/api/mood-logs/{mood_logs[0].id}", json=data)
    assert res.status_code == status_code

def test_update_mood_log_invalid(authorized_client, mood_logs):
    res = authorized_client.put(f"/api/mood-logs/{mood_logs[0].id}", json={"log_date": ""})
    assert res.status_code == 422

def test_update_mood_log_unauthorized(client, mood_logs):
    res = client.put(f"/api/mood-logs/{mood_logs[0].id}", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 401

def test_update_mood_log_not_owner(authorized_client, mood_logs):
    res = authorized_client.put(f"/api/mood-logs/{mood_logs[2].id}", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 404

def test_update_mood_log_not_found(authorized_client, mood_logs, session):
    max_id = session.query(MoodLog.id).order_by(MoodLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.put(f"/api/mood-logs/{non_existent_id}", json={"log_date": datetime.now().isoformat()})
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_delete_mood_log(authorized_client, mood_logs):
    res = authorized_client.delete(f"/api/mood-logs/{mood_logs[0].id}")
    assert res.status_code == 204

def test_delete_mood_log_unauthorized(client, mood_logs):
    res = client.delete(f"/api/mood-logs/{mood_logs[0].id}")
    assert res.status_code == 401

def test_delete_mood_log_not_owner(authorized_client, mood_logs):
    res = authorized_client.delete(f"/api/mood-logs/{mood_logs[2].id}")
    assert res.status_code == 404

def test_delete_mood_log_not_found(authorized_client, mood_logs, session):
    max_id = session.query(MoodLog.id).order_by(MoodLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/api/mood-logs/{non_existent_id}")
    assert res.status_code == 404
