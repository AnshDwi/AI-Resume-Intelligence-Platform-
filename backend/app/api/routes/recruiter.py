from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.preparation import JobListing
from app.models.resume import Resume
from app.models.user import User
from app.schemas.job import JobListingRequest, RecruiterDashboardRequest

router = APIRouter(tags=["recruiter"])


@router.post("/recruiter-dashboard")
def recruiter_dashboard(
    payload: RecruiterDashboardRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    base_query = (
        db.query(Resume)
        .join(User, Resume.user_id == User.id)
        .filter(User.role.in_(["job_seeker", "candidate"]))
    )

    candidates = base_query.all()
    results: list[dict] = []
    for item in candidates:
        score = item.match_score or item.ats_score
        if score < payload.min_score:
            continue
        skills = item.normalized_skills
        if payload.skill_filter and payload.skill_filter.lower() not in " ".join(skills).lower():
            continue

        results.append(
            {
                "id": item.user_id,
                "name": item.file_name.replace(".pdf", ""),
                "matchScore": round(score, 2),
                "skills": skills[:6],
                "stage": "Interview" if score > 85 else "Screening",
            }
        )

    return sorted(results, key=lambda row: row["matchScore"], reverse=True)


@router.post("/recruiter/jobs")
def create_job_listing(
    payload: JobListingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in {"recruiter", "admin"}:
        raise HTTPException(status_code=403, detail="Recruiter role required")

    listing = JobListing(
        recruiter_id=current_user.id,
        title=payload.title,
        description=payload.description,
        required_skills=payload.required_skills,
        status="open",
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "required_skills": listing.required_skills,
        "status": listing.status,
    }


@router.get("/recruiter/jobs")
def get_recruiter_jobs(
    search: str = "",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(JobListing)
    if current_user.role == "recruiter":
        query = query.filter(JobListing.recruiter_id == current_user.id)
    if search:
        query = query.filter(JobListing.title.ilike(f"%{search}%"))

    rows = query.order_by(JobListing.created_at.desc()).all()
    return [
        {
            "id": row.id,
            "title": row.title,
            "description": row.description,
            "required_skills": row.required_skills,
            "status": row.status,
        }
        for row in rows
    ]


@router.get("/recruiter/candidate/{candidate_id}")
def get_candidate_profile(candidate_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in {"recruiter", "admin", "instructor"}:
        raise HTTPException(status_code=403, detail="Access denied")

    user = db.query(User).filter(User.id == candidate_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Candidate not found")
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == candidate_id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    return {
        "id": user.id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "resume": {
            "ats_score": resume.ats_score if resume else 0,
            "match_score": resume.match_score if resume else 0,
            "skills": resume.normalized_skills if resume else [],
        },
    }
