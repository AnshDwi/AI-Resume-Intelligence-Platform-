from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeImproveRequest, ResumeVersionItem
from app.services.ai_engine import generate_resume_feedback
from app.services.ats import calculate_ats_score
from app.services.resume_improvement import (
    build_before_after,
    build_heatmap,
    build_improvement_roadmap,
    compute_ats_breakdown,
    compute_keyword_gap,
    compute_missing_skills,
    generate_bullet_suggestions,
    one_click_improve,
    semantic_similarity_score,
)
from app.services.resume_parser import parse_resume_text
from app.utils.pdf import extract_text_from_pdf

router = APIRouter(tags=["resume"])


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    content = await file.read()
    text = extract_text_from_pdf(content)
    parsed = parse_resume_text(text)
    ats = calculate_ats_score(text, parsed["skills"])

    existing_count = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    version_label = f"V{existing_count + 1}"

    resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        raw_text=text,
        structured_data=parsed,
        normalized_skills=parsed["skills"],
        ats_score=ats["ats_score"],
        version_label=version_label,
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "file_name": resume.file_name,
        "ats_score": resume.ats_score,
        "normalized_skills": resume.normalized_skills,
        "structured_data": resume.structured_data,
    }


@router.get("/analyze-resume")
def analyze_latest_resume(
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
        raise HTTPException(status_code=404, detail="Resume not found")

    return {
        "file_name": resume.file_name,
        "ats_score": resume.ats_score,
        "normalized_skills": resume.normalized_skills,
        "structured_data": resume.structured_data,
    }


@router.get("/analyze-resume/versions", response_model=list[ResumeVersionItem])
def get_resume_versions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.asc())
        .all()
    )

    return [
        ResumeVersionItem(
            id=item.id,
            version=item.version_label,
            score=item.ats_score,
            summary=f"{len(item.normalized_skills)} extracted skills",
            created_at=item.created_at.isoformat(),
        )
        for item in resumes
    ]


@router.post("/resume-auto-builder")
def resume_auto_builder(
    payload: dict,
    current_user: User = Depends(get_current_user),
):
    summary = payload.get("summary", "Impact-driven software engineer.")
    experience = payload.get("experience", [])
    skills = payload.get("skills", [])

    return {
      "full_name": current_user.full_name,
      "summary": summary,
      "experience": experience,
      "skills": skills,
      "template": "ATS_CLASSIC_V1",
      "export_hint": "Convert this structured JSON into PDF using your preferred renderer."
    }


@router.post("/resume-improvement/analyze")
async def analyze_resume_improvement(
    payload: ResumeImproveRequest,
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
        raise HTTPException(status_code=404, detail="Resume not found")

    structured = resume.structured_data or {}
    breakdown = compute_ats_breakdown(structured, resume.raw_text, payload.job_description)
    keyword_gap = compute_keyword_gap(resume.raw_text, payload.job_description)
    missing_skills = compute_missing_skills(structured, payload.job_description)
    heatmap = build_heatmap(resume.raw_text)
    bullet_suggestions = generate_bullet_suggestions(resume.raw_text)

    ai_feedback = await generate_resume_feedback(
        f"Job description: {payload.job_description}\nResume:\n{resume.raw_text[:4000]}"
    )
    roadmap = build_improvement_roadmap(breakdown, missing_skills, keyword_gap)

    return {
        "resume_file_name": resume.file_name,
        "raw_text": resume.raw_text,
        "ats_score": resume.ats_score,
        "semantic_match": semantic_similarity_score(resume.raw_text, payload.job_description),
        "ats_breakdown": breakdown,
        "heatmap": heatmap,
        "keyword_gap": keyword_gap,
        "missing_skills": missing_skills,
        "bullet_suggestions": bullet_suggestions,
        "ai_suggestions": ai_feedback.get("improvements", []),
        "ai_bullet_rewrites": ai_feedback.get("bullet_rewrites", []),
        "improvement_roadmap": roadmap,
    }


@router.post("/resume-improvement/one-click")
async def one_click_resume_improve(
    payload: ResumeImproveRequest,
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
        raise HTTPException(status_code=404, detail="Resume not found")

    bullet_suggestions = generate_bullet_suggestions(resume.raw_text)
    improved_text = one_click_improve(resume.raw_text, bullet_suggestions)
    before_after = build_before_after(bullet_suggestions)

    ai_feedback = await generate_resume_feedback(
        f"Rewrite for clarity and impact.\nJob description: {payload.job_description}\nResume:\n{resume.raw_text[:3500]}"
    )

    return {
        "original_text": resume.raw_text,
        "improved_text": improved_text,
        "before_after": before_after,
        "extra_ai_rewrites": ai_feedback.get("bullet_rewrites", []),
        "message": "Resume improved with stronger verbs and measurable impact language.",
    }
