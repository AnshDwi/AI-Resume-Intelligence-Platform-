from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.preparation import (
    DailyChallengeProgress,
    DomainProgress,
    InterviewSession,
    JobBookmark,
    MockInterviewAttempt,
    SessionBooking,
    StudyPlan,
    TestAttempt,
)
from app.models.resume import Resume
from app.models.user import User
from app.schemas.career import (
    BookmarkJobRequest,
    CoachChatRequest,
    CompleteChallengeRequest,
    DSACodeRunRequest,
    JoinSessionRequest,
    BookingDecisionRequest,
    MockInterviewEvaluateRequest,
    ProgressUpdateRequest,
    QuizSubmitRequest,
    SessionBookRequest,
    SessionCreateRequest,
    StudyPlanRequest,
)
from app.services.ai_engine import career_coach_chat, evaluate_mock_interview_answers, generate_interview_questions
from app.services.career_prep import (
    create_weekly_plan,
    evaluate_quiz,
    get_dsa_questions,
    get_daily_challenges,
    get_domains,
    get_instructor_profiles,
    get_learning_content,
    get_learning_roadmap,
    get_quiz,
    run_dsa_code,
)
from app.services.readiness import calculate_interview_readiness

router = APIRouter(prefix="/career", tags=["career-preparation"])


@router.get("/domains")
def list_domains(current_user: User = Depends(get_current_user)):
    return get_domains()


@router.get("/learning-content")
def learning_content(domain: str, current_user: User = Depends(get_current_user)):
    return get_learning_content(domain)


@router.get("/learning-roadmap")
def learning_roadmap(domain: str, current_user: User = Depends(get_current_user)):
    return get_learning_roadmap(domain)


@router.get("/dsa/questions")
def dsa_questions(
    domain: str,
    difficulty: str | None = None,
    current_user: User = Depends(get_current_user),
):
    return {"domain": domain, "questions": get_dsa_questions(domain, difficulty)}


@router.post("/dsa/run")
def dsa_run(payload: DSACodeRunRequest, current_user: User = Depends(get_current_user)):
    return run_dsa_code(payload.domain, payload.question_id, payload.language, payload.code)


@router.post("/progress")
def update_domain_progress(
    payload: ProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(DomainProgress)
        .filter(DomainProgress.user_id == current_user.id, DomainProgress.domain == payload.domain)
        .first()
    )
    completion = min((len(payload.completed_topics) / 5) * 100, 100)

    if existing:
        existing.difficulty = payload.difficulty
        existing.completed_topics = payload.completed_topics
        existing.completion_percent = completion
        db.commit()
        db.refresh(existing)
        return {"status": "updated", "completion_percent": existing.completion_percent}

    entry = DomainProgress(
        user_id=current_user.id,
        domain=payload.domain,
        difficulty=payload.difficulty,
        completed_topics=payload.completed_topics,
        completion_percent=completion,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"status": "created", "completion_percent": entry.completion_percent}


@router.get("/progress")
def get_domain_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entries = db.query(DomainProgress).filter(DomainProgress.user_id == current_user.id).all()
    return [
        {
            "domain": item.domain,
            "difficulty": item.difficulty,
            "completed_topics": item.completed_topics,
            "completion_percent": item.completion_percent,
        }
        for item in entries
    ]


@router.get("/tests")
def get_tests(domain: str, test_type: str = "mcq", current_user: User = Depends(get_current_user)):
    return {"domain": domain, "test_type": test_type, "questions": get_quiz(domain, test_type)}


@router.post("/tests/submit")
def submit_test(
    payload: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    questions = get_quiz(payload.domain, payload.test_type)
    evaluated = evaluate_quiz(questions, payload.answers)

    attempt = TestAttempt(
        user_id=current_user.id,
        domain=payload.domain,
        test_type=payload.test_type,
        score=evaluated["score"],
        total_questions=evaluated["total"],
        correct_answers=evaluated["correct"],
        feedback=evaluated["feedback"],
        answers=payload.answers,
    )
    db.add(attempt)
    db.commit()

    return evaluated


@router.get("/daily-challenges")
def daily_challenges(
    challenge_date: str | None = None,
    current_user: User = Depends(get_current_user),
):
    return get_daily_challenges(challenge_date)


@router.post("/daily-challenges/complete")
def complete_daily_challenge(
    payload: CompleteChallengeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(DailyChallengeProgress)
        .filter(
            DailyChallengeProgress.user_id == current_user.id,
            DailyChallengeProgress.challenge_date == payload.challenge_date,
            DailyChallengeProgress.title == payload.title,
        )
        .first()
    )
    if existing:
        existing.completed = True
        existing.score = payload.score
        db.commit()
        return {"status": "updated", "id": existing.id}

    row = DailyChallengeProgress(
        user_id=current_user.id,
        challenge_date=payload.challenge_date,
        domain=payload.domain,
        title=payload.title,
        completed=True,
        score=payload.score,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "completed", "id": row.id}


@router.get("/streak")
def challenge_streak(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    attempts = (
        db.query(DailyChallengeProgress)
        .filter(DailyChallengeProgress.user_id == current_user.id, DailyChallengeProgress.completed.is_(True))
        .all()
    )
    unique_days = {entry.challenge_date for entry in attempts}
    return {"streak_days": len(unique_days), "completed_total": len(attempts)}


@router.post("/mock-interview/questions")
async def generate_mock_questions(role: str, current_user: User = Depends(get_current_user)):
    return await generate_interview_questions(role)


@router.post("/mock-interview/evaluate")
async def evaluate_mock_interview(
    payload: MockInterviewEvaluateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if len(payload.questions) != len(payload.answers):
        raise HTTPException(status_code=400, detail="Questions and answers length mismatch")

    evaluated = await evaluate_mock_interview_answers(payload.role, payload.questions, payload.answers)

    attempt = MockInterviewAttempt(
        user_id=current_user.id,
        role=payload.role,
        score=evaluated["overall_score"],
        question_set={"questions": payload.questions},
        answer_set={"answers": payload.answers},
        feedback=evaluated,
    )
    db.add(attempt)
    db.commit()

    return evaluated


@router.get("/readiness")
def get_readiness(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    latest_resume = (
        db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    )
    latest_test = (
        db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).order_by(TestAttempt.created_at.desc()).first()
    )
    latest_mock = (
        db.query(MockInterviewAttempt)
        .filter(MockInterviewAttempt.user_id == current_user.id)
        .order_by(MockInterviewAttempt.created_at.desc())
        .first()
    )
    return calculate_interview_readiness(latest_resume, latest_test, latest_mock)


@router.post("/coach-chat")
async def coach_chat(payload: CoachChatRequest, current_user: User = Depends(get_current_user)):
    return await career_coach_chat(payload.message, role=current_user.role)


@router.post("/planner/generate")
def generate_study_plan(
    payload: StudyPlanRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = create_weekly_plan(payload.domain)
    entry = StudyPlan(
        user_id=current_user.id,
        domain=payload.domain,
        plan_week=plan["week_start"],
        tasks=plan["tasks"],
        progress_percent=plan["progress_percent"],
    )
    db.add(entry)
    db.commit()
    return plan


@router.get("/planner")
def get_study_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).order_by(StudyPlan.created_at.desc()).all()
    return [
        {
            "id": item.id,
            "domain": item.domain,
            "plan_week": item.plan_week,
            "tasks": item.tasks,
            "progress_percent": item.progress_percent,
        }
        for item in plans
    ]


@router.get("/job-recommendations")
def job_recommendations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    skills = set(resume.normalized_skills if resume else [])
    recommendations = [
        {"title": "Frontend Engineer", "company": "Nebula Labs", "match_score": 86, "url": "https://jobs.example.com/fe-1"},
        {"title": "Full Stack Developer", "company": "Orbit AI", "match_score": 82, "url": "https://jobs.example.com/fs-2"},
        {"title": "Backend Engineer", "company": "ScaleGrid", "match_score": 79, "url": "https://jobs.example.com/be-3"},
    ]
    if "Kubernetes" in skills:
        recommendations.insert(
            0,
            {
                "title": "Platform Engineer",
                "company": "CloudMesh",
                "match_score": 89,
                "url": "https://jobs.example.com/pe-4",
            },
        )
    return recommendations


@router.get("/bookmarked-jobs")
def get_bookmarked_jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = (
        db.query(JobBookmark)
        .filter(JobBookmark.user_id == current_user.id)
        .order_by(JobBookmark.created_at.desc())
        .all()
    )
    return [
        {
            "id": row.id,
            "title": row.title,
            "company": row.company,
            "match_score": row.match_score,
            "url": row.url,
        }
        for row in rows
    ]


@router.post("/bookmarked-jobs")
def add_bookmarked_job(
    payload: BookmarkJobRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = JobBookmark(
        user_id=current_user.id,
        title=payload.title,
        company=payload.company,
        match_score=payload.match_score,
        url=payload.url,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "saved", "id": row.id}


@router.post("/sessions/create")
def create_interview_session(
    payload: SessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in {"recruiter", "instructor", "admin"}:
        raise HTTPException(status_code=403, detail="Instructor role required")

    session = InterviewSession(
        instructor_id=current_user.id,
        title=payload.title,
        domain=payload.domain,
        session_date=payload.session_date,
        session_time=payload.session_time,
        capacity=payload.capacity,
        meeting_link=f"https://meet.example.com/{payload.domain.lower().replace(' ', '-')}-{payload.session_date}",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {
        "id": session.id,
        "title": session.title,
        "domain": session.domain,
        "session_date": session.session_date,
        "session_time": session.session_time,
        "capacity": session.capacity,
        "meeting_link": session.meeting_link,
    }


@router.get("/sessions")
def list_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(InterviewSession).order_by(InterviewSession.created_at.desc()).all()
    response = []
    for session in sessions:
        bookings = db.query(SessionBooking).filter(SessionBooking.session_id == session.id).count()
        response.append(
            {
                "id": session.id,
                "title": session.title,
                "domain": session.domain,
                "session_date": session.session_date,
                "session_time": session.session_time,
                "capacity": session.capacity,
                "booked": bookings,
                "meeting_link": session.meeting_link,
            }
        )
    return response


@router.post("/sessions/book")
def book_session(
    payload: SessionBookRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = db.query(InterviewSession).filter(InterviewSession.id == payload.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    existing = (
        db.query(SessionBooking)
        .filter(SessionBooking.session_id == payload.session_id, SessionBooking.student_id == current_user.id)
        .first()
    )
    if existing:
        return {"status": "already_booked", "booking_id": existing.id}

    count = db.query(SessionBooking).filter(SessionBooking.session_id == payload.session_id).count()
    if count >= session.capacity:
        raise HTTPException(status_code=400, detail="Session is full")

    booking = SessionBooking(session_id=payload.session_id, student_id=current_user.id, status="booked")
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {"status": "booked", "booking_id": booking.id, "session_link": session.meeting_link}


@router.post("/sessions/join")
def join_session(
    payload: JoinSessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    booking = (
        db.query(SessionBooking)
        .filter(SessionBooking.id == payload.booking_id, SessionBooking.student_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    session = db.query(InterviewSession).filter(InterviewSession.id == booking.session_id).first()
    booking.joined = True
    booking.status = "joined"
    db.commit()

    return {
        "status": "joined",
        "session_id": session.id,
        "title": session.title,
        "meeting_link": session.meeting_link,
    }


@router.get("/sessions/my-bookings")
def get_my_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(SessionBooking).filter(SessionBooking.student_id == current_user.id).all()
    response = []
    for booking in bookings:
        session = db.query(InterviewSession).filter(InterviewSession.id == booking.session_id).first()
        if session:
            response.append(
                {
                    "booking_id": booking.id,
                    "status": booking.status,
                    "joined": booking.joined,
                    "session": {
                        "id": session.id,
                        "title": session.title,
                        "domain": session.domain,
                        "session_date": session.session_date,
                        "session_time": session.session_time,
                        "meeting_link": session.meeting_link,
                    },
                }
            )
    return response


@router.get("/sessions/instructor")
def get_instructor_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in {"instructor", "admin", "recruiter"}:
        raise HTTPException(status_code=403, detail="Instructor role required")

    sessions = (
        db.query(InterviewSession)
        .filter(InterviewSession.instructor_id == current_user.id)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )
    return [
        {
            "id": item.id,
            "title": item.title,
            "domain": item.domain,
            "session_date": item.session_date,
            "session_time": item.session_time,
            "capacity": item.capacity,
        }
        for item in sessions
    ]


@router.get("/sessions/{session_id}/bookings")
def get_session_bookings(session_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if current_user.role not in {"instructor", "admin", "recruiter"} and session.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    bookings = db.query(SessionBooking).filter(SessionBooking.session_id == session_id).all()
    results = []
    for booking in bookings:
        candidate = db.query(User).filter(User.id == booking.student_id).first()
        results.append(
            {
                "booking_id": booking.id,
                "session_id": booking.session_id,
                "student_id": booking.student_id,
                "student_name": candidate.full_name if candidate else "Unknown",
                "status": booking.status,
                "joined": booking.joined,
            }
        )
    return results


@router.post("/sessions/booking/decision")
def decide_booking(
    payload: BookingDecisionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in {"instructor", "admin", "recruiter"}:
        raise HTTPException(status_code=403, detail="Instructor role required")

    booking = db.query(SessionBooking).filter(SessionBooking.id == payload.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if payload.decision not in {"accepted", "rejected"}:
        raise HTTPException(status_code=400, detail="Decision must be accepted or rejected")

    booking.status = payload.decision
    db.commit()
    return {"status": booking.status, "booking_id": booking.id}


@router.get("/instructors")
def list_instructors(current_user: User = Depends(get_current_user)):
    return get_instructor_profiles()
