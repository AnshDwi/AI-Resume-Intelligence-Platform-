from pydantic import BaseModel


class JobMatchRequest(BaseModel):
    job_description: str


class JobComparisonRequest(BaseModel):
    jobs: list[str]


class RecruiterDashboardRequest(BaseModel):
    job_description: str
    min_score: float = 0
    skill_filter: str = ""


class FeedbackRequest(BaseModel):
    context: str = ""


class InterviewRequest(BaseModel):
    role: str


class JDAnalyzeRequest(BaseModel):
    text: str | None = None
    url: str | None = None


class JobListingRequest(BaseModel):
    title: str
    description: str
    required_skills: list[str] = []
