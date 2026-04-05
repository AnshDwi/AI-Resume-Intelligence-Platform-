from datetime import date, timedelta

DOMAIN_LIBRARY = {
    "Frontend Developer": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["HTML/CSS fundamentals", "JavaScript basics", "React component model"],
            "Intermediate": ["State management patterns", "Performance optimization", "Testing with Vitest/Jest"],
            "Advanced": ["Micro-frontends", "Design systems", "Frontend observability"],
        },
        "topics": {
            "concepts": ["Rendering lifecycle", "Accessibility", "Caching and hydration"],
            "interview_questions": ["Optimize a heavy dashboard", "Build scalable component architecture"],
            "coding_problems": ["Debounced search", "Virtualized table", "Form builder"],
            "mcq_technical": ["Hooks", "Reconciliation", "Bundle splitting"],
            "mcq_aptitude": ["Speed-time-distance", "Logical sequences", "Critical reasoning"],
        },
        "company_specific": ["Google frontend fundamentals", "Amazon LP frontend scenarios"],
    },
    "Backend Developer": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["HTTP + REST", "SQL fundamentals", "FastAPI basics"],
            "Intermediate": ["Caching", "Queues", "Auth and RBAC"],
            "Advanced": ["Distributed systems", "Scalability", "Observability"],
        },
        "topics": {
            "concepts": ["Transactions", "Rate limiting", "Resilience"],
            "interview_questions": ["Design URL shortener", "Build idempotent APIs"],
            "coding_problems": ["LRU cache", "Task scheduler", "API pagination"],
            "mcq_technical": ["Indexing", "CAP theorem", "Isolation levels"],
            "mcq_aptitude": ["Probability", "Data interpretation", "Syllogisms"],
        },
        "company_specific": ["Netflix API scalability", "Uber marketplace backend"],
    },
    "Full Stack": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["Frontend + backend basics", "Database modeling", "Git workflow"],
            "Intermediate": ["Auth systems", "State and cache sync", "Testing E2E"],
            "Advanced": ["System design", "Event-driven architecture", "Cost optimization"],
        },
        "topics": {
            "concepts": ["API-first design", "Client/server caching", "Monitoring"],
            "interview_questions": ["Design collaborative editor", "Scale notification service"],
            "coding_problems": ["Realtime chat", "Role-based CMS", "Analytics ingestion"],
            "mcq_technical": ["JWT", "WebSockets", "Normalization"],
            "mcq_aptitude": ["Ratios", "Puzzles", "Verbal analogies"],
        },
        "company_specific": ["Meta full-stack stack design", "Atlassian product engineering"],
    },
    "DevOps": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["Linux basics", "Docker basics", "CI pipelines"],
            "Intermediate": ["Kubernetes", "Infrastructure as code", "Monitoring"],
            "Advanced": ["SRE and incident response", "Security hardening", "Cost governance"],
        },
        "topics": {
            "concepts": ["Containers", "Cluster networking", "Release strategy"],
            "interview_questions": ["Blue-green deployment", "Incident postmortem process"],
            "coding_problems": ["CI pipeline YAML", "Terraform modules", "Autoscaling strategy"],
            "mcq_technical": ["K8s services", "Prometheus", "Helm"],
            "mcq_aptitude": ["Percentages", "Pattern matching", "Reading comprehension"],
        },
        "company_specific": ["AWS architecture challenge", "SRE troubleshooting drills"],
    },
    "Cybersecurity": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["Security fundamentals", "OWASP top 10", "Network basics"],
            "Intermediate": ["Threat modeling", "IAM", "SIEM fundamentals"],
            "Advanced": ["Incident response", "Security automation", "Red-team scenarios"],
        },
        "topics": {
            "concepts": ["Defense in depth", "Zero trust", "Secure SDLC"],
            "interview_questions": ["Secure an API gateway", "Respond to credential leak"],
            "coding_problems": ["Input validation", "Audit logging", "Token rotation"],
            "mcq_technical": ["XSS", "CSRF", "Encryption"],
            "mcq_aptitude": ["Number logic", "Deduction", "Vocabulary"],
        },
        "company_specific": ["SOC analyst triage", "Cloud security checklist"],
    },
    "Data Analyst": {
        "difficulty_levels": ["Beginner", "Intermediate", "Advanced"],
        "roadmap": {
            "Beginner": ["Excel/Sheets", "SQL basics", "Statistics essentials"],
            "Intermediate": ["BI dashboards", "A/B testing", "Data storytelling"],
            "Advanced": ["Predictive modeling", "Experiment design", "Data governance"],
        },
        "topics": {
            "concepts": ["Data cleaning", "Hypothesis testing", "Visualization best practices"],
            "interview_questions": ["Analyze retention drop", "Design KPI framework"],
            "coding_problems": ["SQL joins challenge", "Cohort analysis", "ETL validation"],
            "mcq_technical": ["Window functions", "P-values", "Data quality"],
            "mcq_aptitude": ["Percentiles", "Logical series", "Verbal inference"],
        },
        "company_specific": ["Product analytics case", "Marketing funnel case"],
    },
}

QUIZ_BANK = {
    "Frontend Developer": {
        "mcq": [
            {
                "id": "q1",
                "question": "What improves list render stability in React?",
                "options": ["keys", "inline styles", "context", "portals"],
                "answer": "keys",
                "category": "technical",
            },
            {
                "id": "q2",
                "question": "Which hook memoizes expensive derived values?",
                "options": ["useMemo", "useRef", "useEffect", "useLayoutEffect"],
                "answer": "useMemo",
                "category": "technical",
            },
            {
                "id": "q3",
                "question": "A train travels 120 km in 2 hours. Speed?",
                "options": ["40", "50", "60", "80"],
                "answer": "60",
                "category": "aptitude",
            },
        ],
        "scenario": [
            {
                "id": "s1",
                "question": "A dashboard with 50k rows is slow. Best first move?",
                "options": ["Switch framework", "Virtualize table", "Increase retries", "Add Redux"],
                "answer": "Virtualize table",
                "category": "technical",
            }
        ],
    }
}

DAILY_CHALLENGES = [
    {
        "id": "daily-1",
        "title": "Rewrite 2 resume bullets with measurable outcomes",
        "type": "resume",
        "points": 20,
    },
    {
        "id": "daily-2",
        "title": "Solve 3 aptitude MCQs and explain one solution",
        "type": "aptitude",
        "points": 25,
    },
    {
        "id": "daily-3",
        "title": "Answer 1 mock interview question in STAR format",
        "type": "interview",
        "points": 30,
    },
]

INSTRUCTOR_PROFILES = [
    {
        "id": 9001,
        "name": "Priya Sharma",
        "domain": "Frontend Developer",
        "experience_years": 8,
        "rating": 4.9,
    },
    {
        "id": 9002,
        "name": "Aman Verma",
        "domain": "Backend Developer",
        "experience_years": 10,
        "rating": 4.8,
    },
    {
        "id": 9003,
        "name": "Sara Khan",
        "domain": "DevOps",
        "experience_years": 9,
        "rating": 4.7,
    },
]

PLATFORM_LINKS = [
    {"name": "HackerRank", "url": "https://www.hackerrank.com/dashboard"},
    {"name": "Coding Ninjas", "url": "https://www.codingninjas.com/codestudio"},
    {"name": "LeetCode", "url": "https://leetcode.com/problemset/"},
]

DSA_QUESTION_BANK = {
    "Frontend Developer": [
        {
            "id": "fe-easy-1",
            "title": "Two Sum",
            "difficulty": "easy",
            "prompt": "Given an array of integers and a target, return indices of two numbers that add up to target.",
            "starter": {
                "python": "def solve(nums, target):\n    # return [i, j]\n    pass",
                "javascript": "function solve(nums, target) {\n  // return [i, j]\n}",
                "java": "class Solution { int[] solve(int[] nums, int target) { return new int[]{-1,-1}; } }",
            },
            "tests": [
                {"input": "nums=[2,7,11,15], target=9", "expected": "[0,1]"},
                {"input": "nums=[3,2,4], target=6", "expected": "[1,2]"},
            ],
            "required_tokens": ["for", "target"],
        },
        {
            "id": "fe-medium-1",
            "title": "Longest Substring Without Repeating Characters",
            "difficulty": "medium",
            "prompt": "Return the length of the longest substring without repeating characters.",
            "starter": {
                "python": "def solve(s):\n    # return int\n    pass",
                "javascript": "function solve(s) {\n  // return number\n}",
                "java": "class Solution { int solve(String s) { return 0; } }",
            },
            "tests": [{"input": "s='abcabcbb'", "expected": "3"}],
            "required_tokens": ["while", "set"],
        },
        {
            "id": "fe-hard-1",
            "title": "Merge K Sorted Lists",
            "difficulty": "hard",
            "prompt": "Merge k sorted linked lists and return a single sorted list.",
            "starter": {
                "python": "def solve(lists):\n    # return merged list\n    pass",
                "javascript": "function solve(lists) {\n  // return merged array/list\n}",
                "java": "class Solution { Object solve(Object lists) { return null; } }",
            },
            "tests": [{"input": "lists=[[1,4,5],[1,3,4],[2,6]]", "expected": "[1,1,2,3,4,4,5,6]"}],
            "required_tokens": ["heap", "while"],
        },
    ]
}


def _domain_default() -> dict:
    return DOMAIN_LIBRARY["Frontend Developer"]


def get_domains() -> list[dict]:
    payload = []
    for domain, details in DOMAIN_LIBRARY.items():
        payload.append(
            {
                "domain": domain,
                "difficulty_levels": details["difficulty_levels"],
                "learning_path": [
                    "Beginner foundations",
                    "Intermediate projects",
                    "Advanced interview mastery",
                ],
                "topics": details["topics"]["concepts"],
            }
        )
    return payload


def get_learning_content(domain: str) -> dict:
    library = DOMAIN_LIBRARY.get(domain, _domain_default())
    return {
        "domain": domain,
        "difficulty_levels": library["difficulty_levels"],
        "course_roadmap": library["roadmap"],
        "topics": library["topics"],
        "coding_practice": {
            "dsa": [
                {"level": "easy", "problem": "Two Sum variant"},
                {"level": "medium", "problem": "LRU cache design"},
                {"level": "hard", "problem": "Distributed rate limiter"},
            ],
            "company_specific": library["company_specific"],
            "platforms": PLATFORM_LINKS,
        },
        "aptitude_tracks": ["Quantitative", "Logical reasoning", "Verbal"],
    }


def get_learning_roadmap(domain: str) -> dict:
    library = DOMAIN_LIBRARY.get(domain, _domain_default())
    return {
        "domain": domain,
        "roadmap": library["roadmap"],
        "topics": library["topics"],
        "platforms": PLATFORM_LINKS,
    }


def get_dsa_questions(domain: str, difficulty: str | None = None) -> list[dict]:
    dataset = DSA_QUESTION_BANK.get(domain) or DSA_QUESTION_BANK["Frontend Developer"]
    if difficulty:
        return [item for item in dataset if item["difficulty"] == difficulty.lower()]
    return dataset


def run_dsa_code(domain: str, question_id: str, language: str, code: str) -> dict:
    questions = get_dsa_questions(domain)
    question = next((item for item in questions if item["id"] == question_id), None)
    if not question:
        return {
            "status": "error",
            "message": "Question not found.",
            "passed": 0,
            "total": 0,
            "results": [],
        }

    normalized = (code or "").lower()
    required_tokens = question.get("required_tokens", [])
    token_hits = sum(1 for token in required_tokens if token in normalized)
    pass_ratio = token_hits / max(len(required_tokens), 1)
    total = len(question["tests"])
    passed = round(total * pass_ratio)
    failed = total - passed
    status = "passed" if passed == total and total > 0 else "partial" if passed > 0 else "failed"

    test_results = []
    for index, test in enumerate(question["tests"]):
        test_results.append(
            {
                "test_case": index + 1,
                "input": test["input"],
                "expected": test["expected"],
                "status": "passed" if index < passed else "failed",
            }
        )

    return {
        "status": status,
        "message": (
            "All tests passed. Great work!"
            if status == "passed"
            else "Some tests passed. Refine your edge-case handling."
            if status == "partial"
            else "No tests passed. Revisit the approach and complexity."
        ),
        "language": language,
        "passed": passed,
        "failed": failed,
        "total": total,
        "results": test_results,
    }


def get_quiz(domain: str, test_type: str) -> list[dict]:
    default_set = QUIZ_BANK.get(domain) or QUIZ_BANK["Frontend Developer"]
    return default_set.get(test_type, default_set["mcq"])


def evaluate_quiz(questions: list[dict], answers: dict[str, str]) -> dict:
    correct = 0
    details = []
    for question in questions:
        qid = question["id"]
        expected = question["answer"].strip().lower()
        received = answers.get(qid, "").strip().lower()
        is_correct = expected == received
        if is_correct:
            correct += 1
        details.append(
            {
                "id": qid,
                "question": question["question"],
                "correct_answer": question["answer"],
                "your_answer": answers.get(qid, ""),
                "is_correct": is_correct,
                "category": question.get("category", "technical"),
            }
        )

    total = len(questions)
    score = round((correct / max(total, 1)) * 100, 2)
    feedback = "Excellent momentum." if score >= 80 else "Focus on weak topics before next mock."
    return {"score": score, "correct": correct, "total": total, "feedback": feedback, "details": details}


def create_weekly_plan(domain: str) -> dict:
    today = date.today()
    library = DOMAIN_LIBRARY.get(domain, _domain_default())
    core_topics = library["topics"]["concepts"]
    tasks = []
    for offset in range(7):
        current = today + timedelta(days=offset)
        topic = core_topics[offset % len(core_topics)]
        tasks.append(
            {
                "date": current.isoformat(),
                "task": f"{domain}: {topic}",
                "completed": False,
                "focus": "learning" if offset < 4 else "practice",
            }
        )
    return {"week_start": today.isoformat(), "tasks": tasks, "progress_percent": 0}


def get_daily_challenges(challenge_date: str | None = None) -> dict:
    return {
        "date": challenge_date or date.today().isoformat(),
        "streak_hint": "Complete at least one challenge daily to maintain streak.",
        "challenges": DAILY_CHALLENGES,
    }


def get_instructor_profiles() -> list[dict]:
    return INSTRUCTOR_PROFILES
