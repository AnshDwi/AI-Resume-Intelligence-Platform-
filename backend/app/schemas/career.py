from pydantic import BaseModel, Field


class ProgressUpdateRequest(BaseModel):
    domain: str
    difficulty: str = "Beginner"
    completed_topics: list[str] = Field(default_factory=list)


class QuizSubmitRequest(BaseModel):
    domain: str
    test_type: str = "mcq"
    answers: dict[str, str]


class MockInterviewEvaluateRequest(BaseModel):
    role: str
    questions: list[str]
    answers: list[str]


class StudyPlanRequest(BaseModel):
    domain: str


class SessionCreateRequest(BaseModel):
    title: str
    domain: str
    session_date: str
    session_time: str
    capacity: int = 10


class SessionBookRequest(BaseModel):
    session_id: int


class JoinSessionRequest(BaseModel):
    booking_id: int


class BookingDecisionRequest(BaseModel):
    booking_id: int
    decision: str


class CoachChatRequest(BaseModel):
    message: str


class BookmarkJobRequest(BaseModel):
    title: str
    company: str
    match_score: float = 0
    url: str


class CompleteChallengeRequest(BaseModel):
    challenge_date: str
    domain: str
    title: str
    score: float = 0


class DSACodeRunRequest(BaseModel):
    domain: str
    question_id: str
    language: str
    code: str


class DSAQuestionsRequest(BaseModel):
    domain: str
    difficulty: str | None = None
