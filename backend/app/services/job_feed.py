from datetime import datetime, timezone


def get_live_jobs_mock() -> list[dict]:
    now = datetime.now(timezone.utc).isoformat()
    return [
        {"id": "job-1", "title": "Senior Full Stack Engineer", "company": "Nexora", "posted_at": now},
        {"id": "job-2", "title": "Frontend Platform Engineer", "company": "Bluewave", "posted_at": now},
        {"id": "job-3", "title": "AI Product Engineer", "company": "Aster Labs", "posted_at": now},
    ]
