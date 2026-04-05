import re
from collections import defaultdict

import spacy

SKILL_MAP = {
    "react.js": "React",
    "react": "React",
    "node.js": "Node.js",
    "node": "Node.js",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "aws": "AWS",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    "redis": "Redis",
    "fastapi": "FastAPI",
    "python": "Python",
    "communication": "Communication",
    "leadership": "Leadership",
}

CATEGORIES = {
    "Frontend": {"React", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js"},
    "Backend": {"Node.js", "FastAPI", "Python", "PostgreSQL", "GraphQL"},
    "DevOps": {"AWS", "Docker", "Kubernetes", "Redis", "CI/CD"},
    "Soft Skills": {"Communication", "Leadership", "Mentorship", "Collaboration"},
}


try:
    NLP = spacy.load("en_core_web_sm")
except Exception:
    NLP = spacy.blank("en")


def normalize_skills(skills: list[str]) -> list[str]:
    normalized: list[str] = []
    seen: set[str] = set()
    for skill in skills:
        cleaned = SKILL_MAP.get(skill.lower().strip(), skill.strip())
        if cleaned and cleaned not in seen:
            seen.add(cleaned)
            normalized.append(cleaned)
    return normalized


def categorize_skills(skills: list[str]) -> dict[str, list[str]]:
    buckets: dict[str, list[str]] = defaultdict(list)
    for skill in skills:
        placed = False
        for category, entries in CATEGORIES.items():
            if skill in entries:
                buckets[category].append(skill)
                placed = True
                break
        if not placed:
            buckets["Other"].append(skill)
    return dict(buckets)


def parse_resume_text(text: str) -> dict:
    doc = NLP(text)

    entities = {"education": [], "experience": [], "projects": []}
    for ent in doc.ents:
        if ent.label_ in {"ORG", "PRODUCT"}:
            entities["experience"].append(ent.text)
        if ent.label_ in {"DATE"}:
            entities["education"].append(ent.text)

    raw_skills = []
    lowered = text.lower()
    for candidate in SKILL_MAP:
        if re.search(rf"\b{re.escape(candidate)}\b", lowered):
            raw_skills.append(candidate)

    normalized_skills = normalize_skills(raw_skills)

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    projects = [line for line in lines if "project" in line.lower()][:5]

    return {
        "skills": normalized_skills,
        "skill_categories": categorize_skills(normalized_skills),
        "education": list(dict.fromkeys(entities["education"]))[:8],
        "experience": list(dict.fromkeys(entities["experience"]))[:8],
        "projects": projects,
    }
