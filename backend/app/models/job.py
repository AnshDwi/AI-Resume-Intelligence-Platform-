from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(120), default="Untitled Role", nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    extracted_keywords: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    required_skills: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    seniority: Mapped[str] = mapped_column(String(30), default="mid")
    role_category: Mapped[str] = mapped_column(String(80), default="Software Engineering")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class MatchResult(Base):
    __tablename__ = "match_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id"), nullable=False, index=True)
    job_analysis_id: Mapped[int] = mapped_column(ForeignKey("job_analyses.id"), nullable=False, index=True)
    match_score: Mapped[float] = mapped_column(Float, nullable=False)
    overlap_skills: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    missing_skills: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    strengths: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    details: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
