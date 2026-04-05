from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.job import FeedbackRequest
from app.services.ai_engine import generate_resume_feedback

router = APIRouter(tags=["feedback"])


@router.get("/generate-feedback")
async def get_feedback(current_user: User = Depends(get_current_user)):
    return await generate_resume_feedback(f"role={current_user.role}")


@router.post("/generate-feedback")
async def regenerate_feedback(
    payload: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = f"user={current_user.full_name}; role={current_user.role}; context={payload.context}"
    return await generate_resume_feedback(context)
