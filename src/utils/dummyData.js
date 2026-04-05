export const dashboardMock = {
  metrics: [
    { label: "ATS Score", value: "86%" },
    { label: "Match Score", value: "81%" },
    { label: "Skills Extracted", value: "28" },
    { label: "Application Readiness", value: "74%" }
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Redis",
    "Tailwind CSS",
    "Docker",
    "System Design"
  ],
  skillGap: [
    { skill: "GraphQL", current: 42, required: 82 },
    { skill: "Kubernetes", current: 35, required: 75 },
    { skill: "CI/CD", current: 66, required: 84 },
    { skill: "AWS", current: 49, required: 86 },
    { skill: "Leadership", current: 58, required: 80 }
  ],
  skillDistribution: [
    { name: "Frontend", value: 36 },
    { name: "Backend", value: 26 },
    { name: "DevOps", value: 18 },
    { name: "Data", value: 10 },
    { name: "Soft Skills", value: 10 }
  ],
  suggestions: [
    "Rewrite top 3 bullets to include measurable product impact.",
    "Increase keyword alignment for cloud infrastructure and CI/CD terms.",
    "Prioritize adding architecture ownership examples for senior roles."
  ]
};

export const jobMatchingMock = {
  score: 81,
  overlapScore: 76,
  matchingSkills: ["React", "TypeScript", "REST APIs", "Docker", "PostgreSQL"],
  missingSkills: ["Kubernetes", "GraphQL", "Microfrontends"],
  strengths: ["Component architecture", "Product collaboration", "Delivery velocity"],
  suggestions: [
    "Add examples of API schema design and distributed systems collaboration.",
    "Highlight production monitoring and incident response ownership.",
    "Include one bullet proving mentorship or team leadership."
  ]
};

export const multiJobComparisonMock = [
  { id: 1, role: "Senior Frontend Engineer", match: 84, missingSkills: "GraphQL, Cypress" },
  { id: 2, role: "Full Stack Engineer", match: 88, missingSkills: "Kubernetes, Golang" },
  { id: 3, role: "Product Engineer", match: 79, missingSkills: "Experimentation, Data analytics" },
  { id: 4, role: "Platform Engineer", match: 72, missingSkills: "Terraform, SRE practices" }
];

export const resumeVersionsMock = [
  { id: "v1", version: "V1", score: 62, date: "Jan 2026", summary: "Baseline upload with minimal keyword targeting." },
  { id: "v2", version: "V2", score: 71, date: "Feb 2026", summary: "Added quantified impact bullets and project details." },
  { id: "v3", version: "V3", score: 79, date: "Mar 2026", summary: "Reframed achievements by user and business outcomes." },
  { id: "v4", version: "V4", score: 86, date: "Apr 2026", summary: "ATS optimization and role-specific keyword tuning." }
];

export const aiFeedbackMock = {
  improvements: [
    "Move technical stack to the top third of the resume.",
    "Combine similar bullets and remove low-value repetition.",
    "Include one bullet per role that demonstrates cross-functional influence."
  ],
  bulletSuggestions: [
    "Drove a component library migration that reduced UI defect rate by 31%.",
    "Designed caching and pagination improvements that cut API latency by 43%.",
    "Partnered with product to improve onboarding conversion by 22%."
  ],
  roadmap: [
    { skill: "GraphQL", priority: "High", timeline: "3 weeks", sequence: 1 },
    { skill: "Kubernetes", priority: "High", timeline: "5 weeks", sequence: 2 },
    { skill: "System Design", priority: "Medium", timeline: "4 weeks", sequence: 3 }
  ]
};

export const recruiterCandidatesMock = [
  { id: 1, name: "Ava Thompson", matchScore: 92, skills: ["React", "TypeScript", "System Design"], stage: "Interview" },
  { id: 2, name: "Ethan Walker", matchScore: 85, skills: ["Vue", "Node.js", "AWS"], stage: "Screening" },
  { id: 3, name: "Liam Scott", matchScore: 79, skills: ["Angular", "RxJS", "Jest"], stage: "Review" },
  { id: 4, name: "Mia Harris", matchScore: 88, skills: ["React", "GraphQL", "Cypress"], stage: "Interview" }
];

export const interviewQuestionsByRole = {
  "Frontend Engineer": {
    technical: [
      "How would you debug re-render bottlenecks in a large React app?",
      "When would you split code by route vs component in Vite/React?",
      "How do you design resilient frontend error boundaries?"
    ],
    behavioral: [
      "Describe a time you disagreed with product priorities and how you handled it.",
      "How do you mentor junior engineers while shipping on time?"
    ]
  },
  "Full Stack Engineer": {
    technical: [
      "How do you design API contracts that evolve without breaking clients?",
      "Explain a caching strategy using Redis for read-heavy endpoints.",
      "How would you structure observability in a FastAPI + Postgres service?"
    ],
    behavioral: [
      "Tell me about a feature you owned end-to-end under tight deadlines.",
      "How do you communicate trade-offs to non-technical stakeholders?"
    ]
  },
  "Product Engineer": {
    technical: [
      "How would you instrument a new funnel and measure feature impact?",
      "What are your heuristics for balancing performance and speed of iteration?"
    ],
    behavioral: [
      "Describe how you handled a failed experiment and what you changed next.",
      "How do you align design, engineering, and growth teams?"
    ]
  }
};

export const seekerAnalyticsMock = {
  readiness: 74,
  trend: [
    { month: "Jan", match: 58, ats: 61 },
    { month: "Feb", match: 66, ats: 70 },
    { month: "Mar", match: 74, ats: 79 },
    { month: "Apr", match: 81, ats: 86 }
  ]
};

export const recruiterAnalyticsMock = {
  funnel: [
    { stage: "Applied", count: 120 },
    { stage: "Screened", count: 55 },
    { stage: "Interviewed", count: 24 },
    { stage: "Offer", count: 8 }
  ],
  qualityDistribution: [
    { name: "Excellent", value: 18 },
    { name: "Strong", value: 44 },
    { name: "Average", value: 28 },
    { name: "Low", value: 10 }
  ]
};

export const roleRecommendationsMock = [
  { role: "Full Stack Engineer", confidence: 0.92 },
  { role: "Senior Frontend Engineer", confidence: 0.88 },
  { role: "Product Engineer", confidence: 0.81 }
];

export const notificationsMock = [
  "A better match was found for Senior Full Stack Engineer (+7%).",
  "Your ATS score improved after version V4 update.",
  "New recruiter view: 3 candidates shortlisted for React role."
];

export const careerDomainsMock = [
  {
    domain: "Software Developer",
    topics: ["DSA", "System Design", "OOP", "APIs", "Testing"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Core language + problem solving", "Week 2: APIs + databases", "Week 3: Architecture + testing"]
  },
  {
    domain: "Backend Developer",
    topics: ["FastAPI", "SQL", "Caching", "Scalability", "Security"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Backend basics", "Week 2: DB + Redis", "Week 3: Security + scale"]
  },
  {
    domain: "Frontend Developer",
    topics: ["React", "State Management", "Performance", "Accessibility", "Testing"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Components + hooks", "Week 2: State + architecture", "Week 3: Performance + testing"]
  },
  {
    domain: "DevOps Engineer",
    topics: ["Linux", "Docker", "Kubernetes", "CI/CD", "Monitoring"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Containers", "Week 2: CI/CD", "Week 3: K8s + observability"]
  },
  {
    domain: "Cybersecurity",
    topics: ["OWASP", "Network Security", "IAM", "Threat Modeling", "Incident Response"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Security fundamentals", "Week 2: AppSec", "Week 3: Incident workflow"]
  },
  {
    domain: "Data Science",
    topics: ["Python", "Statistics", "Machine Learning", "Data Visualization", "Model Deployment"],
    difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
    learning_path: ["Week 1: Data foundations", "Week 2: ML workflow", "Week 3: Deployment basics"]
  }
];

export const quizMock = {
  domain: "Frontend Developer",
  test_type: "mcq",
  questions: [
    {
      id: "q1",
      question: "What primarily improves list rendering performance in React?",
      options: ["useEffect", "Keys", "Context", "CSS Modules"],
      answer: "Keys"
    },
    {
      id: "q2",
      question: "Which hook memoizes computed values?",
      options: ["useMemo", "useRef", "useCallback", "useLayoutEffect"],
      answer: "useMemo"
    },
    {
      id: "q3",
      question: "A dashboard rerenders slowly with 10k rows. Best first step?",
      options: ["Add Redux", "Virtualize list", "Switch CSS framework", "Use class components"],
      answer: "Virtualize list"
    }
  ]
};

export const mockInterviewEvaluationMock = {
  overall_score: 78,
  feedback: [
    "Use STAR format for behavioral answers.",
    "Quantify impact more explicitly.",
    "Add architecture trade-off explanation."
  ],
  question_feedback: [
    {
      question: "How would you optimize rendering in React?",
      answer_score: 75,
      comment: "Good baseline; discuss profiling and memoization trade-offs."
    }
  ]
};

export const readinessMock = {
  readiness_score: 81,
  components: {
    resume_score: 86,
    test_score: 79,
    mock_interview_score: 78
  }
};

export const studyPlanMock = {
  week_start: "2026-04-03",
  progress_percent: 28,
  tasks: [
    { date: "2026-04-03", task: "Study React performance patterns", completed: true },
    { date: "2026-04-04", task: "Practice system design mock", completed: true },
    { date: "2026-04-05", task: "Solve 3 scenario-based questions", completed: false },
    { date: "2026-04-06", task: "Review security checklist basics", completed: false },
    { date: "2026-04-07", task: "Mock interview with peer", completed: false },
    { date: "2026-04-08", task: "Revise ATS keyword sections", completed: false },
    { date: "2026-04-09", task: "Take weekly assessment", completed: false }
  ]
};

export const liveInterviewSessionsMock = [
  {
    id: 1,
    title: "Frontend System Design Live",
    domain: "Frontend Developer",
    session_date: "2026-04-06",
    session_time: "18:30",
    capacity: 12,
    booked: 6,
    meeting_link: "https://meet.example.com/frontend-live"
  },
  {
    id: 2,
    title: "Backend API Review Session",
    domain: "Backend Developer",
    session_date: "2026-04-07",
    session_time: "20:00",
    capacity: 10,
    booked: 4,
    meeting_link: "https://meet.example.com/backend-live"
  }
];

export const learningContentMock = {
  domain: "Frontend Developer",
  difficulty_levels: ["Beginner", "Intermediate", "Advanced"],
  course_roadmap: {
    Beginner: ["HTML/CSS essentials", "JavaScript foundations", "React basics"],
    Intermediate: ["State architecture", "Performance tuning", "Component testing"],
    Advanced: ["Microfrontends", "Design systems", "Observability"]
  },
  topics: {
    concepts: ["Rendering lifecycle", "Accessibility", "Caching strategies"],
    interview_questions: ["Build scalable UI architecture", "Debug hydration mismatch"],
    coding_problems: ["Virtualized list", "Debounced search", "Realtime chart"],
    mcq_technical: ["Hooks", "Reconciliation", "Memoization"],
    mcq_aptitude: ["Speed-distance", "Logical sequencing", "Verbal critical reasoning"]
  },
  coding_practice: {
    dsa: [
      { level: "easy", problem: "Two Sum variant" },
      { level: "medium", problem: "LRU cache" },
      { level: "hard", problem: "Distributed throttling" }
    ],
    company_specific: ["Google UI architecture round", "Amazon frontend LP round"]
    ,
    platforms: [
      { name: "HackerRank", url: "https://www.hackerrank.com/dashboard" },
      { name: "Coding Ninjas", url: "https://www.codingninjas.com/codestudio" },
      { name: "LeetCode", url: "https://leetcode.com/problemset/" }
    ]
  },
  aptitude_tracks: ["Quantitative", "Logical reasoning", "Verbal"]
};

export const learningRoadmapMock = {
  domain: "Frontend Developer",
  roadmap: {
    Beginner: ["HTML/CSS basics", "JavaScript fundamentals", "React basics"],
    Intermediate: ["State patterns", "Performance", "Unit testing"],
    Advanced: ["Design systems", "Microfrontends", "Observability"]
  },
  topics: learningContentMock.topics,
  platforms: learningContentMock.coding_practice.platforms
};

export const dsaQuestionsMock = {
  domain: "Frontend Developer",
  questions: [
    {
      id: "fe-easy-1",
      title: "Two Sum",
      difficulty: "easy",
      prompt: "Given an array and target, return indices of two numbers adding to target.",
      starter: {
        python: "def solve(nums, target):\n    pass",
        javascript: "function solve(nums, target) {\n}",
        java: "class Solution { int[] solve(int[] nums, int target) { return new int[]{-1,-1}; } }"
      },
      tests: [{ input: "nums=[2,7,11,15], target=9", expected: "[0,1]" }]
    },
    {
      id: "fe-medium-1",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "medium",
      prompt: "Return length of longest substring without repeated characters.",
      starter: {
        python: "def solve(s):\n    pass",
        javascript: "function solve(s) {\n}",
        java: "class Solution { int solve(String s) { return 0; } }"
      },
      tests: [{ input: "s='abcabcbb'", expected: "3" }]
    }
  ]
};

export const dsaRunResultMock = {
  status: "partial",
  message: "Some tests passed. Refine edge cases.",
  language: "python",
  passed: 1,
  failed: 1,
  total: 2,
  results: [
    { test_case: 1, input: "nums=[2,7,11,15], target=9", expected: "[0,1]", status: "passed" },
    { test_case: 2, input: "nums=[3,2,4], target=6", expected: "[1,2]", status: "failed" }
  ]
};

export const dailyChallengesMock = {
  date: "2026-04-05",
  streak_hint: "Complete at least one challenge daily to maintain streak.",
  challenges: [
    { id: "daily-1", title: "Rewrite 2 resume bullets with measurable impact", type: "resume", points: 20 },
    { id: "daily-2", title: "Solve 3 aptitude MCQs", type: "aptitude", points: 25 },
    { id: "daily-3", title: "Answer 1 mock interview question in STAR format", type: "interview", points: 30 }
  ]
};

export const streakMock = {
  streak_days: 5,
  completed_total: 12
};

export const bookmarkedJobsMock = [
  { id: 1, title: "Senior Frontend Engineer", company: "Nebula Labs", match_score: 87, url: "https://jobs.example.com/nebula-fe" },
  { id: 2, title: "Full Stack Engineer", company: "Orbit AI", match_score: 83, url: "https://jobs.example.com/orbit-fs" }
];

export const jobRecommendationsMock = [
  { title: "Platform Engineer", company: "CloudMesh", match_score: 89, url: "https://jobs.example.com/cloudmesh-platform" },
  { title: "Frontend Engineer", company: "Nebula Labs", match_score: 86, url: "https://jobs.example.com/nebula-fe" },
  { title: "Backend Engineer", company: "ScaleGrid", match_score: 79, url: "https://jobs.example.com/scalegrid-be" }
];

export const instructorProfilesMock = [
  { id: 9001, name: "Priya Sharma", domain: "Frontend Developer", experience_years: 8, rating: 4.9 },
  { id: 9002, name: "Aman Verma", domain: "Backend Developer", experience_years: 10, rating: 4.8 },
  { id: 9003, name: "Sara Khan", domain: "DevOps", experience_years: 9, rating: 4.7 }
];

export const coachWelcomeMock = {
  reply: "Focus today on one resume improvement, one targeted interview answer, and one coding challenge.",
  next_actions: [
    "Rewrite one bullet with business impact.",
    "Practice one technical and one behavioral interview answer.",
    "Complete one daily challenge to extend your streak."
  ]
};

export const resumeImprovementMock = {
  resume_file_name: "resume.pdf",
  raw_text: `John Doe
Frontend Engineer

EXPERIENCE
- Built reusable React components that improved release speed by 30%
- Worked on APIs and bug fixes for dashboard
- Responsible for tasks in team

PROJECTS
- Portfolio platform for job seekers with analytics dashboard

SKILLS
React, TypeScript, Node.js, PostgreSQL, Docker`,
  ats_score: 84,
  semantic_match: 77,
  ats_breakdown: {
    skills_match: 81,
    experience: 74,
    keyword_match: 69,
    formatting: 88,
    projects: 72
  },
  heatmap: [
    { text: "Built reusable React components that improved release speed by 30%", status: "strong", color: "green", reason: "Impact-focused and measurable." },
    { text: "Worked on APIs and bug fixes for dashboard", status: "improve", color: "yellow", reason: "Needs clearer impact metrics." },
    { text: "Responsible for tasks in team", status: "weak", color: "red", reason: "Missing action verb and measurable result." }
  ],
  keyword_gap: {
    present_keywords: ["react", "typescript", "api", "testing"],
    missing_keywords: ["graphql", "kubernetes", "caching", "monitoring"]
  },
  missing_skills: [
    { skill: "GraphQL", importance: "high", prep_link: "/app/dashboard?tab=prep&domain=GraphQL" },
    { skill: "Kubernetes", importance: "high", prep_link: "/app/dashboard?tab=prep&domain=Kubernetes" },
    { skill: "Monitoring", importance: "medium", prep_link: "/app/dashboard?tab=prep&domain=Monitoring" }
  ],
  bullet_suggestions: [
    {
      original: "Worked on APIs and bug fixes for dashboard",
      suggestion: "Optimized dashboard APIs and resolved priority defects, reducing customer-reported issues by 24%.",
      tips: "Use strong action verbs and quantified outcomes."
    }
  ],
  ai_suggestions: [
    "Add one quantified bullet per role showing business impact.",
    "Align top summary keywords with the target job."
  ],
  ai_bullet_rewrites: [
    "Led frontend architecture improvements that reduced regression defects by 31%."
  ],
  improvement_roadmap: [
    { priority: 1, title: "Close high-priority missing skills", detail: "Target: GraphQL, Kubernetes" },
    { priority: 2, title: "Improve keyword alignment", detail: "Add missing keywords naturally across experience bullets." }
  ]
};

export const oneClickImproveMock = {
  original_text: "Worked on APIs and bug fixes for dashboard",
  improved_text: "Optimized dashboard APIs and resolved priority defects, reducing customer-reported issues by 24%.",
  before_after: [
    {
      before: "Worked on APIs and bug fixes for dashboard",
      after: "Optimized dashboard APIs and resolved priority defects, reducing customer-reported issues by 24%."
    }
  ],
  extra_ai_rewrites: ["Delivered reusable architecture that improved release quality by 22%."],
  message: "Resume improved with stronger verbs and measurable impact language."
};
