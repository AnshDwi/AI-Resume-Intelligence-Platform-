from app.models.preparation import MockInterviewAttempt, TestAttempt
from app.models.resume import Resume


def calculate_interview_readiness(latest_resume: Resume | None, latest_test: TestAttempt | None, latest_mock: MockInterviewAttempt | None) -> dict:
    resume_score = latest_resume.ats_score if latest_resume else 0
    test_score = latest_test.score if latest_test else 0
    mock_score = latest_mock.score if latest_mock else 0

    readiness = (resume_score * 0.4) + (test_score * 0.3) + (mock_score * 0.3)
    return {
        "readiness_score": round(readiness, 2),
        "components": {
            "resume_score": round(resume_score, 2),
            "test_score": round(test_score, 2),
            "mock_interview_score": round(mock_score, 2),
        },
    }
