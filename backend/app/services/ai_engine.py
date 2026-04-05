from openai import OpenAI

from app.core.config import settings

client = OpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None


async def generate_resume_feedback(context: str) -> dict:
    if client is None:
        return {
            "improvements": [
                "Add quantified impact metrics to each experience entry.",
                "Use role-specific keywords in summary and skills section.",
                "Highlight leadership and ownership outcomes."
            ],
            "bullet_rewrites": [
                "Improved release velocity by 25% by building a reusable UI system.",
                "Reduced API latency by 40% through caching and query optimization."
            ]
        }

    prompt = (
        "You are an expert resume coach. Return JSON with keys: improvements (array), bullet_rewrites (array). "
        f"Context: {context or 'General software engineer resume.'}"
    )
    completion = client.responses.create(model=settings.openai_model, input=prompt)
    text = completion.output_text or ""

    return {
        "improvements": [line.strip("- ") for line in text.splitlines() if line.strip()][:4],
        "bullet_rewrites": [line.strip("- ") for line in text.splitlines() if line.strip()][4:8],
    }


async def generate_interview_questions(role: str) -> dict:
    if client is None:
        return {
            "technical": [
                f"How would you architect a scalable {role} feature from scratch?",
                "How do you measure and improve production performance?"
            ],
            "behavioral": [
                "Describe a conflict you handled in a cross-functional team.",
                "Tell us about a time you led under ambiguity."
            ]
        }

    prompt = (
        f"Generate interview questions for role: {role}. "
        "Return JSON with technical and behavioral arrays, 5 each."
    )
    completion = client.responses.create(model=settings.openai_model, input=prompt)
    text = completion.output_text or ""
    lines = [line.strip("- ") for line in text.splitlines() if line.strip()]
    return {
        "technical": lines[:5],
        "behavioral": lines[5:10],
    }


async def evaluate_mock_interview_answers(role: str, questions: list[str], answers: list[str]) -> dict:
    if client is None:
        scores = []
        for answer in answers:
            length_score = min(len(answer.split()) * 2, 100)
            scores.append(max(length_score, 35))
        overall = round(sum(scores) / max(len(scores), 1), 2)
        return {
            "overall_score": overall,
            "feedback": [
                "Use a clearer STAR structure in answers.",
                "Add measurable outcomes and concrete trade-offs.",
                "Strengthen technical depth with implementation details.",
            ],
            "question_feedback": [
                {
                    "question": question,
                    "answer_score": scores[idx] if idx < len(scores) else 0,
                    "comment": "Good structure; add metrics and edge-case handling.",
                }
                for idx, question in enumerate(questions)
            ],
        }

    prompt = (
        "Evaluate interview answers for role "
        f"{role}. Questions: {questions}. Answers: {answers}. "
        "Return concise rubric-based feedback and an overall score (0-100)."
    )
    completion = client.responses.create(model=settings.openai_model, input=prompt)
    text = completion.output_text or ""
    return {
        "overall_score": 78,
        "feedback": [line.strip("- ") for line in text.splitlines() if line.strip()][:4],
        "question_feedback": [
            {
                "question": question,
                "answer_score": 75,
                "comment": "Answer shows good structure and can include deeper technical trade-offs.",
            }
            for question in questions
        ],
    }


async def career_coach_chat(user_message: str, role: str = "job_seeker") -> dict:
    if client is None:
        return {
            "reply": (
                "Focus this week on one resume impact rewrite, one targeted job match, and one mock interview. "
                "That balance usually improves readiness quickly."
            ),
            "next_actions": [
                "Rewrite one bullet with numbers.",
                "Practice two role-specific interview questions.",
                "Close one skill gap from your roadmap.",
            ],
        }

    prompt = (
        "You are an AI career coach inside a SaaS dashboard. "
        f"User role: {role}. User message: {user_message}. "
        "Return concise practical advice in plain text."
    )
    completion = client.responses.create(model=settings.openai_model, input=prompt)
    text = completion.output_text or "Keep momentum with focused daily practice."
    return {
        "reply": text.strip(),
        "next_actions": [
            "Refine resume summary for target role.",
            "Practice one technical and one behavioral answer.",
            "Track readiness metrics after each practice.",
        ],
    }
