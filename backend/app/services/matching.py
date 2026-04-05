def calculate_match_score(
    resume_skills: list[str],
    job_skills: list[str],
    experience_years: int = 0,
    keyword_hits: int = 0,
) -> dict:
    resume_set = set(resume_skills)
    job_set = set(job_skills)

    overlap = sorted(list(resume_set.intersection(job_set)))
    missing = sorted(list(job_set.difference(resume_set)))

    skill_component = (len(overlap) / max(len(job_set), 1)) * 100
    experience_component = min(experience_years / 8, 1) * 100
    keyword_component = min(keyword_hits / 20, 1) * 100

    weighted = (skill_component * 0.6) + (experience_component * 0.25) + (keyword_component * 0.15)

    strengths = []
    if skill_component >= 70:
        strengths.append("Strong skill overlap")
    if experience_component >= 60:
        strengths.append("Relevant experience depth")
    if keyword_component >= 55:
        strengths.append("Good keyword alignment")
    if not strengths:
        strengths.append("Potential fit with targeted upskilling")

    return {
        "match_score": round(weighted, 2),
        "skill_overlap": overlap,
        "missing_skills": missing,
        "strengths": strengths,
        "components": {
            "skills": round(skill_component, 2),
            "experience": round(experience_component, 2),
            "keywords": round(keyword_component, 2),
        },
    }
