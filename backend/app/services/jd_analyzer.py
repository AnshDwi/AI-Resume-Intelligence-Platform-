import re
from urllib.parse import urlparse

import httpx

from app.services.resume_parser import SKILL_MAP, normalize_skills

ROLE_KEYWORDS = {
    "Frontend Engineer": ["frontend", "react", "ui", "javascript"],
    "Backend Engineer": ["backend", "api", "database", "python"],
    "Full Stack Engineer": ["full stack", "frontend", "backend", "system"],
    "DevOps Engineer": ["devops", "kubernetes", "docker", "aws"],
}

SENIORITY_MAP = {
    "senior": "senior",
    "lead": "senior",
    "principal": "senior",
    "mid": "mid",
    "junior": "junior",
    "intern": "junior",
}


def detect_seniority(text: str) -> str:
    lowered = text.lower()
    for key, value in SENIORITY_MAP.items():
        if key in lowered:
            return value
    return "mid"


def detect_role_category(text: str) -> str:
    lowered = text.lower()
    best_role = "Software Engineer"
    best_hits = 0
    for role, keywords in ROLE_KEYWORDS.items():
        hits = sum(1 for item in keywords if item in lowered)
        if hits > best_hits:
            best_hits = hits
            best_role = role
    return best_role


def extract_keywords(text: str) -> list[str]:
    tokens = re.findall(r"[A-Za-z][A-Za-z+.#-]{2,}", text.lower())
    stopwords = {"the", "and", "with", "for", "you", "our", "your", "are", "will", "this", "that"}
    filtered = [token for token in tokens if token not in stopwords]
    unique = []
    seen = set()
    for token in filtered:
        if token not in seen:
            seen.add(token)
            unique.append(token)
    return unique[:40]


async def resolve_jd_from_url(url: str) -> str:
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return ""

    try:
        async with httpx.AsyncClient(timeout=7.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.text[:15000]
    except Exception:
        return ""


def analyze_job_description(text: str) -> dict:
    lowered = text.lower()
    extracted = [skill for skill in SKILL_MAP if re.search(rf"\b{re.escape(skill)}\b", lowered)]
    normalized = normalize_skills(extracted)

    return {
        "required_skills": normalized,
        "keywords": extract_keywords(text),
        "seniority": detect_seniority(text),
        "role_category": detect_role_category(text),
    }
