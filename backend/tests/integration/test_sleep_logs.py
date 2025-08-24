import pytest
from app.schemas.sleep_log import SleepLogResponse
from app.models.models import SleepLog
from datetime import datetime


@pytest.fixture
def sleep_logs(user, another_user, session):
    sleep_logs_data = [{
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
        "time_to_bed": datetime.now().isoformat(),
        "time_awake": datetime.now().isoformat()
    }, {
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
        "time_to_bed": datetime.now().isoformat(),
        "time_awake": datetime.now().isoformat(),
        "duration": 480
    }, {
        "user_id": another_user["id"],
        "log_date": datetime.now().isoformat(),
        "time_to_bed": datetime.now().isoformat(),
        "time_awake": datetime.now().isoformat(),
        "sleep_score": 100
    }]

    def create_sleep_log_model(sleep_log):
        return SleepLog(**sleep_log)

    sleep_log_map = map(create_sleep_log_model, sleep_logs_data)
    new_sleep_logs = list(sleep_log_map)

    session.add_all(new_sleep_logs)
    session.commit()

    sleep_logs = session.query(SleepLog).all()

    return sleep_logs

# ----------------------------------------------------------------------------

def test_create_sleep_log(authorized_client, user):
    res = authorized_client.post("/sleep-logs/",
                                 json={"log_date": datetime.now().isoformat(),
                                       "time_to_bed": datetime.now().isoformat(),
                                       "time_awake": datetime.now().isoformat()})
    assert res.status_code == 201
    new_sleep_log = SleepLogResponse(**res.json())
    assert new_sleep_log.user_id == user["id"]
    assert new_sleep_log.duration is None
    assert new_sleep_log.sleep_score is None
    assert new_sleep_log.notes is None

def test_create_sleep_log_invalid(authorized_client):
    res = authorized_client.post("/sleep-logs/",
                                 json={"log_date": datetime.now().isoformat(),
                                       "time_to_bed": datetime.now().isoformat()})
    assert res.status_code == 422

def test_create_sleep_log_unauthorized(client):
    res = client.post("/sleep-logs/",
                      json={"log_date": datetime.now().isoformat(),
                            "time_to_bed": datetime.now().isoformat()})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_sleep_logs(authorized_client, sleep_logs, user):
    res = authorized_client.get("/sleep-logs/")
    assert res.status_code == 200
    sleep_logs_list = [SleepLog(**sleep_log) for sleep_log in res.json()]
    user_sleep_logs = [sleep_log for sleep_log in sleep_logs if sleep_log.user_id == user["id"]]
    assert len(sleep_logs_list) == len(user_sleep_logs)

def test_get_sleep_logs_unauthorized(client, sleep_logs):
    res = client.get("/sleep-logs/")
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_sleep_log(authorized_client, sleep_logs, user):
    res = authorized_client.get(f"/sleep-logs/{sleep_logs[0].id}")
    assert res.status_code == 200
    sleep_log = SleepLogResponse(**res.json())
    assert sleep_log.user_id == user["id"]

def test_get_sleep_log_unauthorized(client, sleep_logs):
    res = client.get(f"/sleep-logs/{sleep_logs[0].id}")
    assert res.status_code == 401

def test_get_sleep_log_not_owner(authorized_client, sleep_logs):
    res = authorized_client.get(f"/sleep-logs/{sleep_logs[2].id}")
    assert res.status_code == 404

def test_sleep_log_not_found(authorized_client, sleep_logs, session):
    max_id = session.query(SleepLog.id).order_by(SleepLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/sleep-logs/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_delete_sleep_log(authorized_client, sleep_logs):
    res = authorized_client.delete(f"/sleep-logs/{sleep_logs[0].id}")
    assert res.status_code == 204

def test_delete_sleep_log_unauthorized(client, sleep_logs):
    res = client.delete(f"/sleep-logs/{sleep_logs[0].id}")
    assert res.status_code == 401

def test_delete_sleep_log_not_owner(authorized_client, sleep_logs):
    res = authorized_client.delete(f"/sleep-logs/{sleep_logs[2].id}")
    assert res.status_code == 404

def test_delete_sleep_log_not_found(authorized_client, sleep_logs, session):
    max_id = session.query(SleepLog.id).order_by(SleepLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/sleep-logs/{non_existent_id}")
    assert res.status_code == 404
