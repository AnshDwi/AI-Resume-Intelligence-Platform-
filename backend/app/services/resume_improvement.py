import re
from collections import Counter

from app.services.jd_analyzer import analyze_job_description

ACTION_VERBS = {
    "built",
    "designed",
    "implemented",
    "optimized",
    "led",
    "developed",
    "improved",
    "delivered",
    "scaled",
    "reduced",
    "increased",
}

SECTION_HEADERS = {"summary", "experience", "education", "projects", "skills", "certifications"}


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z][a-zA-Z+#.]{2,}", text.lower())


def _bounded(value: float) -> float:
    return round(max(0, min(100, value)), 2)


def compute_ats_breakdown(resume: dict, raw_text: str, job_description: str) -> dict:
    jd = analyze_job_description(job_description or "")
    resume_skills = set(resume.get("skills", []))
    required_skills = set(jd.get("required_skills", []))
    skills_match = (len(resume_skills.intersection(required_skills)) / max(len(required_skills), 1)) * 100

    experience_items = resume.get("experience", [])
    experience_score = min(len(experience_items) * 18, 100)

    resume_tokens = set(_tokenize(raw_text))
    jd_keywords = set(jd.get("keywords", []))
    keyword_match = (len(resume_tokens.intersection(jd_keywords)) / max(len(jd_keywords), 1)) * 100

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    header_count = sum(1 for line in lines if line.lower().strip(":") in SECTION_HEADERS)
    bullet_count = sum(1 for line in lines if line.startswith(("-", "*", "•")))
    formatting_score = min((header_count * 20) + (bullet_count * 3), 100)

    projects_count = len(resume.get("projects", []))
    projects_score = min(projects_count * 30, 100)

    return {
        "skills_match": _bounded(skills_match),
        "experience": _bounded(experience_score),
        "keyword_match": _bounded(keyword_match),
        "formatting": _bounded(formatting_score),
        "projects": _bounded(projects_score),
    }


def compute_keyword_gap(raw_text: str, job_description: str) -> dict:
    jd = analyze_job_description(job_description or "")
    resume_tokens = set(_tokenize(raw_text))
    keywords = jd.get("keywords", [])[:20]
    present = [item for item in keywords if item in resume_tokens]
    missing = [item for item in keywords if item not in resume_tokens]
    return {"present_keywords": present, "missing_keywords": missing}


def compute_missing_skills(resume: dict, job_description: str) -> list[dict]:
    jd = analyze_job_description(job_description or "")
    resume_skills = set(resume.get("skills", []))
    required = jd.get("required_skills", [])
    missing = [skill for skill in required if skill not in resume_skills]
    results = []
    for idx, skill in enumerate(missing):
        importance = "high" if idx < 2 else "medium" if idx < 5 else "low"
        results.append(
            {
                "skill": skill,
                "importance": importance,
                "prep_link": f"/app/dashboard?tab=prep&domain={skill.replace(' ', '%20')}",
            }
        )
    return results


def build_heatmap(raw_text: str) -> list[dict]:
    rows = []
    for line in [entry.strip() for entry in raw_text.splitlines() if entry.strip()]:
        lowered = line.lower()
        has_action = any(verb in lowered for verb in ACTION_VERBS)
        has_metric = bool(re.search(r"\b\d+%?\b", line))
        if has_action and has_metric:
            status = "strong"
            color = "green"
            reason = "Impact-focused and measurable."
        elif has_action or has_metric:
            status = "improve"
            color = "yellow"
            reason = "Partially strong, can be improved with clearer impact."
        else:
            status = "weak"
            color = "red"
            reason = "Missing strong action verb and measurable result."
        rows.append({"text": line, "status": status, "color": color, "reason": reason})
    return rows


def generate_bullet_suggestions(raw_text: str) -> list[dict]:
    bullets = [line.strip("-•* ").strip() for line in raw_text.splitlines() if line.strip().startswith(("-", "*", "•"))]
    suggestions = []
    for bullet in bullets[:8]:
        improved = bullet
        if not re.search(r"\b\d+%?\b", improved):
            improved = f"{improved} resulting in a measurable 25% improvement."
        if not any(verb in improved.lower() for verb in ACTION_VERBS):
            improved = f"Led and optimized: {improved}"
        suggestions.append(
            {
                "original": bullet,
                "suggestion": improved,
                "tips": "Use strong action verbs and quantified outcomes.",
            }
        )
    return suggestions


def build_improvement_roadmap(breakdown: dict, missing_skills: list[dict], keyword_gap: dict) -> list[dict]:
    tasks = [
        {
            "priority": 1,
            "title": "Close high-priority missing skills",
            "detail": f"Target: {', '.join(item['skill'] for item in missing_skills[:3]) or 'None'}",
        },
        {
            "priority": 2,
            "title": "Improve keyword alignment",
            "detail": f"Add these keywords naturally: {', '.join(keyword_gap['missing_keywords'][:6]) or 'N/A'}",
        },
        {
            "priority": 3,
            "title": "Strengthen weak bullet points",
            "detail": "Add quantified impact and ownership language to weak lines.",
        },
    ]
    if breakdown.get("formatting", 0) < 70:
        tasks.append(
            {
                "priority": 4,
                "title": "Improve section formatting",
                "detail": "Use clear sections and concise bullet point structure.",
            }
        )
    return tasks


def build_before_after(suggestions: list[dict]) -> list[dict]:
    return [{"before": item["original"], "after": item["suggestion"]} for item in suggestions[:6]]


def one_click_improve(raw_text: str, suggestions: list[dict]) -> str:
    updated = raw_text
    for row in suggestions[:6]:
        if row["original"] and row["original"] in updated:
            updated = updated.replace(row["original"], row["suggestion"])
    return updated


def semantic_similarity_score(raw_text: str, job_description: str) -> float:
    resume_counter = Counter(_tokenize(raw_text))
    job_counter = Counter(_tokenize(job_description or ""))
    overlap = sum((resume_counter & job_counter).values())
    total = max(sum(job_counter.values()), 1)
    return _bounded((overlap / total) * 100)
