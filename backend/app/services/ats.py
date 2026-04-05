def calculate_ats_score(resume_text: str, required_keywords: list[str]) -> dict:
    lowered = resume_text.lower()
    found = [keyword for keyword in required_keywords if keyword.lower() in lowered]

    keyword_density = (len(found) / max(len(required_keywords), 1)) * 100

    sections = {
        "summary": int("summary" in lowered),
        "experience": int("experience" in lowered),
        "education": int("education" in lowered),
        "skills": int("skills" in lowered),
        "projects": int("project" in lowered),
    }
    section_completeness = (sum(sections.values()) / len(sections)) * 100

    formatting_quality = 85 if len(resume_text.splitlines()) > 20 else 62
    ats_score = (keyword_density * 0.45) + (section_completeness * 0.35) + (formatting_quality * 0.2)

    return {
        "ats_score": round(ats_score, 2),
        "keyword_density": round(keyword_density, 2),
        "section_completeness": round(section_completeness, 2),
        "formatting_quality": formatting_quality,
        "found_keywords": found,
    }
