from app.services.resume_parser import categorize_skills


def build_skill_gap_roadmap(missing_skills: list[str]) -> list[dict]:
    categorized = categorize_skills(missing_skills)
    roadmap: list[dict] = []
    sequence = 1
    for category, skills in categorized.items():
        for skill in skills:
            timeline = "2 weeks" if category in {"Frontend", "Backend"} else "3 weeks"
            roadmap.append(
                {
                    "skill": skill,
                    "category": category,
                    "priority": "High" if sequence <= 2 else "Medium",
                    "estimated_time": timeline,
                    "sequence": sequence,
                }
            )
            sequence += 1
    return roadmap
