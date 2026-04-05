from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.resume import Resume
from app.models.user import User
from app.services.external_analyzer import analyze_github_linkedin
from app.services.job_feed import get_live_jobs_mock

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview")
def dashboard_overview(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    latest = resumes[0] if resumes else None

    return {
        "metrics": [
            {"label": "ATS Score", "value": f"{round((latest.ats_score if latest else 0), 1)}%"},
            {"label": "Match Score", "value": f"{round((latest.match_score if latest else 0), 1)}%"},
            {"label": "Skills Extracted", "value": str(len(latest.normalized_skills) if latest else 0)},
            {"label": "Application Readiness", "value": f"{round(((latest.ats_score if latest else 0) * 0.8), 1)}%"},
        ],
        "skills": latest.normalized_skills if latest else [],
        "skillGap": [
            {"skill": "GraphQL", "current": 45, "required": 80},
            {"skill": "Kubernetes", "current": 30, "required": 74},
            {"skill": "System Design", "current": 60, "required": 86},
        ],
        "skillDistribution": [
            {"name": "Frontend", "value": 32},
            {"name": "Backend", "value": 28},
            {"name": "DevOps", "value": 20},
            {"name": "Soft Skills", "value": 20},
        ],
    }


@router.get("/seeker-analytics")
def seeker_analytics(current_user: User = Depends(get_current_user)):
    return {
        "readiness": 76,
        "trend": [
            {"month": "Jan", "match": 58, "ats": 61},
            {"month": "Feb", "match": 66, "ats": 72},
            {"month": "Mar", "match": 74, "ats": 79},
            {"month": "Apr", "match": 82, "ats": 87},
        ],
    }


@router.get("/recruiter-analytics")
def recruiter_analytics(current_user: User = Depends(get_current_user)):
    return {
        "funnel": [
            {"stage": "Applied", "count": 124},
            {"stage": "Screened", "count": 58},
            {"stage": "Interviewed", "count": 29},
            {"stage": "Offer", "count": 7},
        ],
        "qualityDistribution": [
            {"name": "Excellent", "value": 18},
            {"name": "Strong", "value": 42},
            {"name": "Average", "value": 30},
            {"name": "Low", "value": 10},
        ],
    }


@router.get("/role-recommendations")
def role_recommendations(current_user: User = Depends(get_current_user)):
    return [
        {"role": "Full Stack Engineer", "confidence": 0.91},
        {"role": "Senior Frontend Engineer", "confidence": 0.87},
        {"role": "Product Engineer", "confidence": 0.82},
    ]


@router.get("/notifications")
def notifications(current_user: User = Depends(get_current_user)):
    return [
        "New high-fit job posted for Full Stack Engineer (+8% match).",
        "Your ATS score improved after latest version update.",
        "Recruiter viewed your profile 2 times this week.",
    ]


@router.get("/live-jobs")
def live_jobs(current_user: User = Depends(get_current_user)):
    return get_live_jobs_mock()


@router.get("/profile-external-score")
def profile_external_score(
    github_url: str | None = None,
    linkedin_url: str | None = None,
    current_user: User = Depends(get_current_user),
):
    return analyze_github_linkedin(github_url, linkedin_url)
