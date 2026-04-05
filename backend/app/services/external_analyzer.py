def analyze_github_linkedin(github_url: str | None = None, linkedin_url: str | None = None) -> dict:
    github_score = 78 if github_url else 0
    linkedin_score = 82 if linkedin_url else 0

    total = round((github_score + linkedin_score) / max((1 if github_url else 0) + (1 if linkedin_url else 0), 1), 2)
    return {
        "github_score": github_score,
        "linkedin_score": linkedin_score,
        "profile_strength_score": total,
        "insights": [
            "Consistent project activity increases recruiter trust.",
            "Profile summaries with outcomes improve conversion."
        ]
    }
