# AI Talent Intelligence Platform

Production-grade SaaS starter for job seekers and recruiters with AI-powered resume analysis, job matching, hiring intelligence, and career preparation workflows.

## Stack

- Frontend: React (Vite), Tailwind CSS, Framer Motion, Recharts, React Router, Axios
- Backend: FastAPI, PostgreSQL, Redis, JWT auth
- AI/NLP: OpenAI API integration (optional), spaCy-based parsing/skill extraction
- Infra: Docker + Docker Compose

## Core Features Implemented

- Resume upload + PDF parsing + structured extraction
- Skill normalization + category mapping (frontend/backend/devops/soft)
- Job description analyzer (text + URL support)
- Weighted matching algorithm (skills > experience > keywords)
- ATS score simulator
- AI feedback + bullet rewrite generation with regenerate flow
- Multi-job comparison + best-fit ranking
- Resume version tracking + score trends
- Recruiter dashboard with filtering/sorting
- AI mock interview generator (technical + behavioral)
- Skill gap roadmap generator
- Role recommendations + notifications + analytics dashboards
- Mock external profile analyzer (GitHub/LinkedIn)
- Mock live job feed endpoint
- Career Preparation & Live Interview System:
  - Domain-based preparation tracks (Frontend, Backend, Full Stack, DevOps, Cybersecurity, Data Analyst)
  - MCQ + scenario practice tests with scoring and feedback
  - AI mock interview answer evaluation
  - Interview readiness score (resume + tests + interview)
  - Weekly study planner with daily tasks
  - Live interview sessions (create, list, book, join)
- Premium career module enhancements:
  - Course roadmap + coding/aptitude prep hub
  - Daily challenge + streak system
  - Job recommendation + bookmark engine
  - Floating AI career coach chat
  - Insights drawer + premium glassmorphism dark dashboard UI
- Optional admin users endpoint

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── Dockerfile
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── utils/
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Local Setup (without Docker)

### 1. Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

Recommended local backend `.env` for quick run without Docker services:

```env
SECRET_KEY=dev-local-secret
DATABASE_URL=sqlite:///./local_run.db
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

## Docker Setup (recommended)

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

## API Endpoints

Required routes:
- `POST /api/v1/upload-resume`
- `GET /api/v1/analyze-resume`
- `POST /api/v1/resume-improvement/analyze`
- `POST /api/v1/resume-improvement/one-click`
- `POST /api/v1/match-job`
- `GET|POST /api/v1/generate-feedback`
- `GET|POST /api/v1/compare-jobs`
- `POST /api/v1/recruiter-dashboard`

Career Preparation & Live Interview routes:
- `GET /api/v1/career/domains`
- `GET /api/v1/career/learning-content`
- `GET|POST /api/v1/career/progress`
- `GET /api/v1/career/tests`
- `POST /api/v1/career/tests/submit`
- `GET /api/v1/career/daily-challenges`
- `POST /api/v1/career/daily-challenges/complete`
- `GET /api/v1/career/streak`
- `POST /api/v1/career/mock-interview/questions`
- `POST /api/v1/career/mock-interview/evaluate`
- `POST /api/v1/career/coach-chat`
- `GET /api/v1/career/readiness`
- `POST /api/v1/career/planner/generate`
- `GET /api/v1/career/planner`
- `GET|POST /api/v1/career/bookmarked-jobs`
- `GET /api/v1/career/job-recommendations`
- `GET /api/v1/career/instructors`
- `POST /api/v1/career/sessions/create`
- `GET /api/v1/career/sessions`
- `POST /api/v1/career/sessions/book`
- `POST /api/v1/career/sessions/join`
- `GET /api/v1/career/sessions/my-bookings`

Additional routes:
- `POST /api/v1/job-description-analyze`
- `GET /api/v1/analyze-resume/versions`
- `POST /api/v1/interview/generate`
- `GET /api/v1/dashboard/*`
- `POST /api/v1/resume-auto-builder`
- `GET /api/v1/admin/users`

## Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- JWT bearer token required for protected endpoints.

## Notes

- Frontend API service is backend-ready and includes fallback mock data to keep the UI usable during integration.
- OpenAI integration is optional; when `OPENAI_API_KEY` is absent, deterministic mock AI output is returned.
- spaCy model loading falls back to `spacy.blank("en")` when `en_core_web_sm` is not available.

## Suggested Next Steps

1. Add Alembic migrations + seed scripts.
2. Replace mock live jobs and meeting links with real providers.
3. Add background workers (Celery/RQ) for heavy parsing/LLM tasks.
4. Add RBAC middleware for strict recruiter/instructor/admin isolation.
5. Add websocket signaling for true real-time interview rooms.

## Unified SPA Experience (Updated)

- Main app now runs as a single-page control panel at `/app/dashboard`.
- Authentication is integrated as an in-dashboard overlay (no separate auth page).
- Login/Register includes validation, password visibility toggle, role selection, and animated form switching.
- JWT + user profile persist in localStorage for auto-login.
- Sticky navbar includes profile summary + logout.
- Core modules are section-based via tabs/accordions, with modals, side drawer insights, and a floating quick-action upload button.
- Role-based module visibility:
  - `job_seeker`: resume tools, matching, prep, mock, readiness, sessions
  - `recruiter`: candidate ranking, analytics, live sessions
