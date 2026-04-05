import axios from "axios";
import {
  careerDomainsMock,
  coachWelcomeMock,
  dailyChallengesMock,
  aiFeedbackMock,
  dashboardMock,
  instructorProfilesMock,
  interviewQuestionsByRole,
  jobRecommendationsMock,
  jobMatchingMock,
  learningContentMock,
  learningRoadmapMock,
  liveInterviewSessionsMock,
  mockInterviewEvaluationMock,
  multiJobComparisonMock,
  notificationsMock,
  bookmarkedJobsMock,
  quizMock,
  readinessMock,
  recruiterAnalyticsMock,
  recruiterCandidatesMock,
  resumeImprovementMock,
  resumeVersionsMock,
  roleRecommendationsMock,
  seekerAnalyticsMock,
  streakMock,
  studyPlanMock,
  oneClickImproveMock,
  dsaQuestionsMock,
  dsaRunResultMock
} from "../utils/dummyData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const AUTH_TOKEN_KEY = "ati_access_token";
const AUTH_USER_KEY = "ati_user";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mockRequest = (payload, failRate = 0, delay = 800) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error("Something went wrong. Please try again."));
        return;
      }
      resolve(payload);
    }, delay);
  });

async function withFallback(apiCall, fallbackData) {
  try {
    const response = await apiCall();
    return response.data;
  } catch {
    return mockRequest(fallbackData);
  }
}

export async function registerUser(payload) {
  const data = await withFallback(
    () => apiClient.post("/auth/register", payload),
    {
      access_token: "mock-token",
      token_type: "bearer",
      user: { id: 1, email: payload.email, full_name: payload.full_name, role: payload.role || "job_seeker" }
    }
  );
  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function loginUser(payload) {
  const data = await withFallback(
    () => apiClient.post("/auth/login", payload),
    {
      access_token: "mock-token",
      token_type: "bearer",
      user: { id: 1, email: payload.email, full_name: "Demo User", role: "job_seeker" }
    }
  );
  localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  return data;
}

export function logoutUser() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser() {
  try {
    const value = localStorage.getItem(AUTH_USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function hasAuthToken() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export async function getDashboardData() {
  return withFallback(() => apiClient.get("/dashboard/overview"), dashboardMock);
}

export async function getSeekerAnalytics() {
  return withFallback(() => apiClient.get("/dashboard/seeker-analytics"), seekerAnalyticsMock);
}

export async function getRoleRecommendations() {
  return withFallback(() => apiClient.get("/dashboard/role-recommendations"), roleRecommendationsMock);
}

export async function getNotifications() {
  return withFallback(() => apiClient.get("/dashboard/notifications"), notificationsMock);
}

export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  return withFallback(
    () => apiClient.post("/upload-resume", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    {
      status: "analyzed",
      fileName: file?.name || "resume.pdf",
      message: "Resume parsed and scored successfully.",
      score: 86
    }
  );
}

export async function getResumeImprovementAnalysis(jobDescription = "") {
  return withFallback(
    () => apiClient.post("/resume-improvement/analyze", { job_description: jobDescription }),
    resumeImprovementMock
  );
}

export async function oneClickImproveResume(jobDescription = "") {
  return withFallback(
    () => apiClient.post("/resume-improvement/one-click", { job_description: jobDescription }),
    oneClickImproveMock
  );
}

export async function matchResumeToJob(jobDescription) {
  return withFallback(
    () => apiClient.post("/match-job", { job_description: jobDescription }),
    jobMatchingMock
  );
}

export async function compareJobs(jobDescriptions) {
  return withFallback(() => apiClient.post("/compare-jobs", { jobs: jobDescriptions }), multiJobComparisonMock);
}

export async function getMultiJobComparison() {
  return withFallback(() => apiClient.get("/compare-jobs"), multiJobComparisonMock);
}

export async function getResumeVersions() {
  return withFallback(() => apiClient.get("/analyze-resume/versions"), resumeVersionsMock);
}

export async function getAIFeedback() {
  return withFallback(() => apiClient.get("/generate-feedback"), aiFeedbackMock);
}

export async function regenerateAIFeedback(context = "") {
  return withFallback(() => apiClient.post("/generate-feedback", { context }), aiFeedbackMock);
}

export async function getRecruiterCandidates(jobDescription, minScore = 0, skill = "") {
  const fallback = recruiterCandidatesMock
    .filter((item) => item.matchScore >= minScore)
    .filter((item) => (skill ? item.skills.some((entry) => entry.toLowerCase().includes(skill.toLowerCase())) : true))
    .sort((a, b) => b.matchScore - a.matchScore);

  return withFallback(
    () =>
      apiClient.post("/recruiter-dashboard", {
        job_description: jobDescription,
        min_score: minScore,
        skill_filter: skill
      }),
    fallback
  );
}

export async function getRecruiterAnalytics() {
  return withFallback(() => apiClient.get("/dashboard/recruiter-analytics"), recruiterAnalyticsMock);
}

export async function getInterviewQuestions(role) {
  return withFallback(
    () => apiClient.post("/interview/generate", { role }),
    interviewQuestionsByRole[role] || { technical: [], behavioral: [] }
  );
}

export async function getCareerDomains() {
  return withFallback(() => apiClient.get("/career/domains"), careerDomainsMock);
}

export async function getLearningContent(domain) {
  return withFallback(
    () => apiClient.get("/career/learning-content", { params: { domain } }),
    { ...learningContentMock, domain }
  );
}

export async function getLearningRoadmap(domain) {
  return withFallback(
    () => apiClient.get("/career/learning-roadmap", { params: { domain } }),
    { ...learningRoadmapMock, domain }
  );
}

export async function getDSAQuestions(domain, difficulty = "") {
  return withFallback(
    () => apiClient.get("/career/dsa/questions", { params: { domain, ...(difficulty ? { difficulty } : {}) } }),
    { ...dsaQuestionsMock, domain }
  );
}

export async function runDSACode(payload) {
  return withFallback(() => apiClient.post("/career/dsa/run", payload), dsaRunResultMock);
}

export async function getCareerProgress() {
  return withFallback(() => apiClient.get("/career/progress"), []);
}

export async function updateCareerProgress(payload) {
  return withFallback(() => apiClient.post("/career/progress", payload), { status: "updated", completion_percent: 40 });
}

export async function getPracticeTest(domain, testType) {
  return withFallback(() => apiClient.get("/career/tests", { params: { domain, test_type: testType } }), { ...quizMock, domain, test_type: testType });
}

export async function submitPracticeTest(payload) {
  const total = Object.keys(payload.answers || {}).length || 1;
  const syntheticScore = Math.min(100, Math.round((total / 3) * 100));
  return withFallback(
    () => apiClient.post("/career/tests/submit", payload),
    { score: syntheticScore, correct: Math.round(total * 0.7), total, feedback: "Practice completed", details: [] }
  );
}

export async function generateMockInterviewQuestions(role) {
  return withFallback(
    () => apiClient.post("/career/mock-interview/questions", null, { params: { role } }),
    interviewQuestionsByRole[role] || { technical: [], behavioral: [] }
  );
}

export async function evaluateMockInterview(payload) {
  return withFallback(() => apiClient.post("/career/mock-interview/evaluate", payload), mockInterviewEvaluationMock);
}

export async function getInterviewReadiness() {
  return withFallback(() => apiClient.get("/career/readiness"), readinessMock);
}

export async function generateStudyPlan(domain) {
  return withFallback(() => apiClient.post("/career/planner/generate", { domain }), studyPlanMock);
}

export async function getStudyPlans() {
  return withFallback(() => apiClient.get("/career/planner"), [studyPlanMock]);
}

export async function getDailyChallenges(challengeDate = "") {
  return withFallback(
    () => apiClient.get("/career/daily-challenges", { params: challengeDate ? { challenge_date: challengeDate } : {} }),
    dailyChallengesMock
  );
}

export async function completeDailyChallenge(payload) {
  return withFallback(() => apiClient.post("/career/daily-challenges/complete", payload), { status: "completed" });
}

export async function getStreak() {
  return withFallback(() => apiClient.get("/career/streak"), streakMock);
}

export async function getJobRecommendations() {
  return withFallback(() => apiClient.get("/career/job-recommendations"), jobRecommendationsMock);
}

export async function getBookmarkedJobs() {
  return withFallback(() => apiClient.get("/career/bookmarked-jobs"), bookmarkedJobsMock);
}

export async function bookmarkJob(payload) {
  return withFallback(() => apiClient.post("/career/bookmarked-jobs", payload), { status: "saved" });
}

export async function getInstructorProfiles() {
  return withFallback(() => apiClient.get("/career/instructors"), instructorProfilesMock);
}

export async function chatCareerCoach(message) {
  return withFallback(() => apiClient.post("/career/coach-chat", { message }), coachWelcomeMock);
}

export async function getInterviewSessions() {
  return withFallback(() => apiClient.get("/career/sessions"), liveInterviewSessionsMock);
}

export async function createInterviewSession(payload) {
  return withFallback(() => apiClient.post("/career/sessions/create", payload), { id: Date.now(), ...payload, meeting_link: "https://meet.example.com/new-session" });
}

export async function bookInterviewSession(sessionId) {
  return withFallback(() => apiClient.post("/career/sessions/book", { session_id: sessionId }), { status: "booked", booking_id: Date.now(), session_link: "https://meet.example.com/booked-session" });
}

export async function joinInterviewSession(bookingId) {
  return withFallback(() => apiClient.post("/career/sessions/join", { booking_id: bookingId }), { status: "joined", meeting_link: "https://meet.example.com/live-room" });
}

export async function getMyInterviewBookings() {
  return withFallback(() => apiClient.get("/career/sessions/my-bookings"), []);
}

export async function createJobListing(payload) {
  return withFallback(() => apiClient.post("/recruiter/jobs", payload), { id: Date.now(), ...payload, status: "open" });
}

export async function getJobListings(search = "") {
  return withFallback(() => apiClient.get("/recruiter/jobs", { params: { search } }), []);
}

export async function getCandidateProfile(candidateId) {
  return withFallback(
    () => apiClient.get(`/recruiter/candidate/${candidateId}`),
    { id: candidateId, name: "Candidate", email: "candidate@example.com", role: "job_seeker", resume: { ats_score: 80, match_score: 75, skills: [] } }
  );
}

export async function getInstructorSessions() {
  return withFallback(() => apiClient.get("/career/sessions/instructor"), []);
}

export async function getSessionBookings(sessionId) {
  return withFallback(() => apiClient.get(`/career/sessions/${sessionId}/bookings`), []);
}

export async function decideSessionBooking(bookingId, decision) {
  return withFallback(() => apiClient.post("/career/sessions/booking/decision", { booking_id: bookingId, decision }), { status: decision, booking_id: bookingId });
}
