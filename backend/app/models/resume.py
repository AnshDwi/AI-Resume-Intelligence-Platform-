from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_text: Mapped[str] = mapped_column(Text, default="", nullable=False)
    structured_data: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    normalized_skills: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    ats_score: Mapped[float] = mapped_column(Float, default=0)
    match_score: Mapped[float] = mapped_column(Float, default=0)
    version_label: Mapped[str] = mapped_column(String(30), default="V1")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="resumes")
