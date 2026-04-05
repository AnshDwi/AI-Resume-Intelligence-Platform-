from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):
    file_name: str
    ats_score: float
    normalized_skills: list[str]
    structured_data: dict


class ResumeVersionItem(BaseModel):
    id: int
    version: str
    score: float
    summary: str
    created_at: str


class ResumeImproveRequest(BaseModel):
    job_description: str = ""
