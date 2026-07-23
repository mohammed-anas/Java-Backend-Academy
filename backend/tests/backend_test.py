"""Backend API tests for CODECRAFT."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://blog-mobile-fix.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# --- Root ---
def test_root(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("service") == "codecraft-api"
    assert data.get("ok") is True


# --- Leads ---
def test_create_lead_valid(s):
    payload = {
        "name": "TEST User",
        "email": "test_user@example.com",
        "phone": "+91 99999 88888",
        "course": "01 — Java Mastery",
        "message": "Please share the next cohort dates.",
    }
    r = s.post(f"{API}/leads", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str)
    assert "created_at" in data
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    pytest.created_lead_id = data["id"]


def test_create_lead_invalid_email(s):
    payload = {"name": "TEST X", "email": "not-an-email", "message": "hello there"}
    r = s.post(f"{API}/leads", json=payload)
    assert 400 <= r.status_code < 500


def test_create_lead_missing_fields(s):
    r = s.post(f"{API}/leads", json={"email": "a@b.com"})
    assert 400 <= r.status_code < 500

    r2 = s.post(f"{API}/leads", json={"name": "TEST", "message": "hi there"})
    assert 400 <= r2.status_code < 500

    r3 = s.post(f"{API}/leads", json={"name": "TEST", "email": "a@b.com"})
    assert 400 <= r3.status_code < 500


def test_list_leads_contains_created(s):
    r = s.get(f"{API}/leads")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    ids = [d.get("id") for d in data]
    assert getattr(pytest, "created_lead_id", None) in ids


# --- Status (legacy) ---
def test_status_post_get(s):
    r = s.post(f"{API}/status", json={"client_name": "TEST_client"})
    assert r.status_code == 200
    d = r.json()
    assert d["client_name"] == "TEST_client"
    assert "id" in d

    r2 = s.get(f"{API}/status")
    assert r2.status_code == 200
    assert isinstance(r2.json(), list)
