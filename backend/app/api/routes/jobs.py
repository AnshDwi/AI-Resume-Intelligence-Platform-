import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.redis import redis_client
from app.db.session import get_db
from app.models.job import JobAnalysis, MatchResult
from app.models.resume import Resume
from app.models.user import User
from app.schemas.job import JDAnalyzeRequest, JobComparisonRequest, JobMatchRequest
from app.services.ats import calculate_ats_score
from app.services.jd_analyzer import analyze_job_description, resolve_jd_from_url
from app.services.matching import calculate_match_score
from app.services.roadmap import build_skill_gap_roadmap

router = APIRouter(tags=["jobs"])


def safe_cache_get(cache_key: str):
    try:
        return redis_client.get(cache_key)
    except Exception:
        return None


def safe_cache_set(cache_key: str, payload: dict):
    try:
        redis_client.setex(cache_key, 180, json.dumps(payload))
    except Exception:
        return None


@router.post("/job-description-analyze")
async def analyze_job_description_endpoint(payload: JDAnalyzeRequest):
    text = payload.text or ""
    if payload.url and not text:
        text = await resolve_jd_from_url(payload.url)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Provide job description text or valid URL")
    return analyze_job_description(text)


@router.post("/match-job")
def match_job(
    payload: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cache_key = f"match:{current_user.id}:{hash(payload.job_description)}"
    cached = safe_cache_get(cache_key)
    if cached:
        return json.loads(cached)

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Upload a resume first")

    job_analysis = analyze_job_description(payload.job_description)
    experience_years = 3 + len(resume.structured_data.get("experience", [])) // 2
    keyword_hits = sum(1 for keyword in job_analysis["keywords"] if keyword in resume.raw_text.lower())

    match = calculate_match_score(
        resume.normalized_skills,
        job_analysis["required_skills"],
        experience_years=experience_years,
        keyword_hits=keyword_hits,
    )

    ats = calculate_ats_score(resume.raw_text, job_analysis["keywords"])
    roadmap = build_skill_gap_roadmap(match["missing_skills"])

    job_record = JobAnalysis(
        user_id=current_user.id,
        title=job_analysis["role_category"],
        description=payload.job_description,
        extracted_keywords=job_analysis["keywords"],
        required_skills=job_analysis["required_skills"],
        seniority=job_analysis["seniority"],
        role_category=job_analysis["role_category"],
    )
    db.add(job_record)
    db.flush()

    result_record = MatchResult(
        resume_id=resume.id,
        job_analysis_id=job_record.id,
        match_score=match["match_score"],
        overlap_skills=match["skill_overlap"],
        missing_skills=match["missing_skills"],
        strengths=match["strengths"],
        details=match["components"],
    )
    db.add(result_record)

    resume.match_score = match["match_score"]
    db.commit()

    response = {
        "score": match["match_score"],
        "matchingSkills": match["skill_overlap"],
        "missingSkills": match["missing_skills"],
        "strengths": match["strengths"],
        "componentScores": match["components"],
        "ats": ats,
        "seniority": job_analysis["seniority"],
        "roleCategory": job_analysis["role_category"],
        "roadmap": roadmap,
        "suggestions": [
            "Add quantified outcomes for each relevant project.",
            "Close top-priority skill gaps listed in roadmap.",
            "Align summary with the role category and seniority level."
        ],
    }
    safe_cache_set(cache_key, response)
    return response


@router.get("/compare-jobs")
def compare_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        return []

    recent_jobs = (
        db.query(JobAnalysis)
        .filter(JobAnalysis.user_id == current_user.id)
        .order_by(JobAnalysis.created_at.desc())
        .limit(8)
        .all()
    )

    output: list[dict] = []
    for idx, job in enumerate(recent_jobs, start=1):
        compared = calculate_match_score(resume.normalized_skills, job.required_skills)
        output.append(
            {
                "id": idx,
                "role": job.role_category,
                "match": compared["match_score"],
                "missingSkills": ", ".join(compared["missing_skills"][:3]) or "None",
            }
        )
    return output


@router.post("/compare-jobs")
def compare_jobs_payload(
    payload: JobComparisonRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Upload a resume first")

    results: list[dict] = []
    for index, jd in enumerate(payload.jobs, start=1):
        parsed = analyze_job_description(jd)
        compared = calculate_match_score(resume.normalized_skills, parsed["required_skills"])
        results.append(
            {
                "id": index,
                "role": parsed["role_category"],
                "match": compared["match_score"],
                "missingSkills": ", ".join(compared["missing_skills"][:4]) or "None",
            }
        )
    return sorted(results, key=lambda item: item["match"], reverse=True)
