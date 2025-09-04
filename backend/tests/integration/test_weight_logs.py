import pytest
from app.schemas.weight_log import WeightLogResponse
from app.models.models import WeightLog
from datetime import datetime


@pytest.fixture
def weight_logs(user, another_user, session):
    weight_logs_data = [{
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
        "weight": 150,
        "unit": "lbs"
    }, {
        "user_id": user["id"],
        "log_date": datetime.now().isoformat(),
        "weight": 150,
        "unit": "lbs"
    }, {
        "user_id": another_user["id"],
        "log_date": datetime.now().isoformat(),
        "weight": 150,
        "unit": "lbs"
    }]

    def create_weight_log_model(weight_log):
        return WeightLog(**weight_log)

    weight_log_map = map(create_weight_log_model, weight_logs_data)
    new_weight_logs = list(weight_log_map)

    session.add_all(new_weight_logs)
    session.commit()

    weight_logs = session.query(WeightLog).all()

    return weight_logs

# ----------------------------------------------------------------------------

def test_create_weight_log(authorized_client, user):
    res = authorized_client.post("/api/weight-logs",
                                 json={"log_date": datetime.now().isoformat(),
                                       "weight": 150,
                                       "unit": "lbs"})
    assert res.status_code == 201
    new_weight_log = WeightLogResponse(**res.json())
    assert new_weight_log.user_id == user["id"]
    assert new_weight_log.weight
    assert new_weight_log.unit

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"weight": 150,
          "unit": "lbs"},
          422),
        ({"log_date": datetime.now().isoformat(),
          "unit": "lbs"},
          422),
        ({"log_date": datetime.now().isoformat(),
          "weight": 150},
          422),
        ({"log_date": "",
          "weight": 150,
          "unit": "lbs"},
          422)
    ]
)
def test_create_weight_log_invalid(authorized_client, data, status_code):
    res = authorized_client.post("/api/weight-logs", json=data)
    assert res.status_code == status_code

def test_create_weight_log_unauthorized(client):
    res = client.post("/api/weight-logs",
                      json={"log_date": datetime.now().isoformat(),
                            "weight": 150,
                            "unit": "lbs"})
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_weight_logs(authorized_client, weight_logs, user):
    res = authorized_client.get("/api/weight-logs")
    assert res.status_code == 200
    weight_logs_list = [WeightLog(**weight_log) for weight_log in res.json()]
    user_weight_logs = [weight_log for weight_log in weight_logs if weight_log.user_id == user["id"]]
    assert len(weight_logs_list) == len(user_weight_logs)

def test_get_weight_logs_unauthorized(client, weight_logs):
    res = client.get("/api/weight-logs")
    assert res.status_code == 401

# ----------------------------------------------------------------------------

def test_get_weight_log(authorized_client, weight_logs, user):
    res = authorized_client.get(f"/api/weight-logs/{weight_logs[0].id}")
    assert res.status_code == 200
    weight_log = WeightLogResponse(**res.json())
    assert weight_log.user_id == user["id"]

def test_get_weight_log_unauthorized(client, weight_logs):
    res = client.get(f"/api/weight-logs/{weight_logs[0].id}")
    assert res.status_code == 401

def test_get_weight_log_not_owner(authorized_client, weight_logs):
    res = authorized_client.get(f"/api/weight-logs/{weight_logs[2].id}")
    assert res.status_code == 404

def test_weight_log_not_found(authorized_client, weight_logs, session):
    max_id = session.query(WeightLog.id).order_by(WeightLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.get(f"/api/weight-logs/{non_existent_id}")
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_update_weight_log(authorized_client, weight_logs):
    res = authorized_client.put(f"/api/weight-logs/{weight_logs[0].id}",
                                json={"log_date": datetime.now().isoformat(),
                                      "weight": 150,
                                      "unit": "lbs"})
    assert res.status_code == 200

@pytest.mark.parametrize(
    "data, status_code",
    [
        ({"weight": 150,
          "unit": "lbs"},
          422),
        ({"log_date": datetime.now().isoformat(),
          "unit": "lbs"},
          422),
        ({"log_date": datetime.now().isoformat(),
          "weight": 150},
          422),
        ({"log_date": "",
          "weight": 150,
          "unit": "lbs"},
          422)
    ]
)
def test_update_weight_log_invalid(authorized_client, weight_logs, data, status_code):
    res = authorized_client.put(f"/api/weight-logs/{weight_logs[0].id}", json=data)
    assert res.status_code == status_code

def test_update_weight_log_unauthorized(client, weight_logs):
    res = client.put(f"/api/weight-logs/{weight_logs[0].id}",
                     json={"log_date": datetime.now().isoformat(),
                           "weight": 150,
                           "unit": "lbs"})
    assert res.status_code == 401

def test_update_weight_log_not_owner(authorized_client, weight_logs):
    res = authorized_client.put(f"/api/weight-logs/{weight_logs[2].id}",
                                json={"log_date": datetime.now().isoformat(),
                                      "weight": 150,
                                      "unit": "lbs"})
    assert res.status_code == 404

def test_update_weight_log_not_found(authorized_client, weight_logs, session):
    max_id = session.query(WeightLog.id).order_by(WeightLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.put(f"/api/weight-logs/{non_existent_id}",
                                json={"log_date": datetime.now().isoformat(),
                                      "weight": 150,
                                      "unit": "lbs"})
    assert res.status_code == 404

# ----------------------------------------------------------------------------

def test_delete_weight_log(authorized_client, weight_logs):
    res = authorized_client.delete(f"/api/weight-logs/{weight_logs[0].id}")
    assert res.status_code == 204

def test_delete_weight_log_unauthorized(client, weight_logs):
    res = client.delete(f"/api/weight-logs/{weight_logs[0].id}")
    assert res.status_code == 401

def test_delete_weight_log_not_owner(authorized_client, weight_logs):
    res = authorized_client.delete(f"/api/weight-logs/{weight_logs[2].id}")
    assert res.status_code == 404

def test_delete_weight_log_not_found(authorized_client, weight_logs, session):
    max_id = session.query(WeightLog.id).order_by(WeightLog.id.desc()).first()[0]
    non_existent_id = max_id + 1000
    res = authorized_client.delete(f"/api/weight-logs/{non_existent_id}")
    assert res.status_code == 404
