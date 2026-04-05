from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.job import InterviewRequest
from app.services.ai_engine import generate_interview_questions

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/generate")
async def generate_questions(payload: InterviewRequest, current_user: User = Depends(get_current_user)):
    return await generate_interview_questions(payload.role)
