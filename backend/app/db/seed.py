from app.models.preparation import InterviewSession
from app.models.user import User


def seed_demo_data(db):
    existing = db.query(User).count()
    if existing > 0:
        return

    users = [
        User(email="seeker@demo.ai", full_name="Demo Seeker", password_hash="seeded-demo-password", role="job_seeker"),
        User(email="recruiter@demo.ai", full_name="Demo Recruiter", password_hash="seeded-demo-password", role="recruiter"),
        User(email="instructor1@demo.ai", full_name="Priya Sharma", password_hash="seeded-demo-password", role="instructor"),
        User(email="instructor2@demo.ai", full_name="Aman Verma", password_hash="seeded-demo-password", role="instructor"),
    ]
    db.add_all(users)
    db.commit()

    instructors = db.query(User).filter(User.role == "instructor").all()
    if not instructors:
        return

    sessions = [
        InterviewSession(
            instructor_id=instructors[0].id,
            title="Frontend System Design Live",
            domain="Frontend Developer",
            session_date="2026-04-08",
            session_time="18:30",
            capacity=12,
            meeting_link="https://meet.example.com/frontend-system-design",
        ),
        InterviewSession(
            instructor_id=instructors[-1].id,
            title="Backend API Architecture Session",
            domain="Backend Developer",
            session_date="2026-04-10",
            session_time="20:00",
            capacity=10,
            meeting_link="https://meet.example.com/backend-api-architecture",
        ),
    ]
    db.add_all(sessions)
    db.commit()
