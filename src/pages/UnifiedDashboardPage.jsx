import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  GaugeCircle,
  MessageSquare,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ProgressCircle from "../components/ProgressCircle";
import SkillGapBarChart from "../components/charts/SkillGapBarChart";
import ScoreLineChart from "../components/charts/ScoreLineChart";
import SkillDistributionPieChart from "../components/charts/SkillDistributionPieChart";
import AuthOverlay from "../components/auth/AuthOverlay";
import {
  analyzeResume,
  bookmarkJob,
  bookInterviewSession,
  chatCareerCoach,
  completeDailyChallenge,
  evaluateMockInterview,
  generateMockInterviewQuestions,
  generateStudyPlan,
  getAIFeedback,
  getBookmarkedJobs,
  getCareerDomains,
  getDashboardData,
  getDailyChallenges,
  getDSAQuestions,
  getInterviewReadiness,
  getInterviewSessions,
  getJobRecommendations,
  getLearningContent,
  getLearningRoadmap,
  getMultiJobComparison,
  getNotifications,
  getPracticeTest,
  getResumeImprovementAnalysis,
  getResumeVersions,
  getStreak,
  getStudyPlans,
  joinInterviewSession,
  matchResumeToJob,
  oneClickImproveResume,
  runDSACode,
  submitPracticeTest
} from "../services/api";

function Tooltip({ label, children }) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 opacity-0 transition group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
}

function monthGrid(dateObj) {
  const start = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  const end = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
  const leading = (start.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < leading; i += 1) cells.push(null);
  for (let day = 1; day <= end.getDate(); day += 1) cells.push(new Date(dateObj.getFullYear(), dateObj.getMonth(), day));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const formatYmd = (dateObj) => `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;

function MetricProgress({ label, value, hint }) {
  const tone = value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-200">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.35 }} className={`h-2 rounded-full ${tone}`} />
      </div>
      {hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
}

function HeatmapLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-emerald-100">Strong</span>
      <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-2 py-0.5 text-amber-100">Improve</span>
      <span className="rounded-full border border-rose-400/30 bg-rose-500/15 px-2 py-0.5 text-rose-100">Weak/Missing</span>
    </div>
  );
}

function UnifiedDashboardPage({ forcedTab = null, pageTitle = "", pageSubtitle = "" }) {
  const { user, authenticated, setUser, setAuthenticated } = useOutletContext();

  const [activeTab, setActiveTab] = useState("resume");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{ id: 1, who: "assistant", text: "Ask me anything about resume strategy, prep, or interviews." }]);

  const [dashboard, setDashboard] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [versions, setVersions] = useState([]);
  const [comparison, setComparison] = useState([]);
  const [domains, setDomains] = useState([]);
  const [learningContent, setLearningContent] = useState(null);
  const [learningRoadmap, setLearningRoadmap] = useState(null);
  const [dsaQuestions, setDsaQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [codeInput, setCodeInput] = useState("");
  const [dsaDifficulty, setDsaDifficulty] = useState("");
  const [dsaRunResult, setDsaRunResult] = useState(null);
  const [dsaRunning, setDsaRunning] = useState(false);
  const [plans, setPlans] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [streak, setStreak] = useState({ streak_days: 0 });
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [resumeEngine, setResumeEngine] = useState(null);
  const [improvedResume, setImprovedResume] = useState(null);
  const [resumeJobDescription, setResumeJobDescription] = useState("");

  const [selectedDomain, setSelectedDomain] = useState("Frontend Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [jobResult, setJobResult] = useState(null);
  const [testType, setTestType] = useState("mcq");
  const [quiz, setQuiz] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const [mockRole, setMockRole] = useState("Frontend Engineer");
  const [mockSet, setMockSet] = useState({ technical: [], behavioral: [] });
  const [mockAnswers, setMockAnswers] = useState([]);
  const [mockEval, setMockEval] = useState(null);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [bookingModal, setBookingModal] = useState({ open: false, session: null });

  const fileRef = useRef(null);

  const tabs = [
    { id: "resume", label: "Resume", icon: Sparkles },
    { id: "matching", label: "Matching", icon: Target },
    { id: "ats", label: "ATS", icon: BarChart3 },
    { id: "feedback", label: "AI Feedback", icon: Sparkles },
    { id: "prep", label: "Prep", icon: BookOpen },
    { id: "interviews", label: "Interviews", icon: CalendarDays },
    { id: "learning", label: "Learning", icon: BookOpen },
    { id: "analytics", label: "Analytics", icon: BarChart3 }
  ];

  useEffect(() => {
    if (forcedTab) setActiveTab(forcedTab);
  }, [forcedTab]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [d, r, f, v, c, dm, p, s, n, challengeRes, streakRes, recJobs, savedJobs] = await Promise.all([
        getDashboardData(),
        getInterviewReadiness(),
        getAIFeedback(),
        getResumeVersions(),
        getMultiJobComparison(),
        getCareerDomains(),
        getStudyPlans(),
        getInterviewSessions(),
        getNotifications(),
        getDailyChallenges(),
        getStreak(),
        getJobRecommendations(),
        getBookmarkedJobs()
      ]);
      setDashboard(d);
      setReadiness(r);
      setFeedback(f);
      setVersions(v);
      setComparison(c);
      setDomains(dm);
      setPlans(p);
      setSessions(s);
      setNotifications(n);
      setDailyChallenges(challengeRes.challenges || []);
      setStreak(streakRes);
      setRecommendedJobs(recJobs);
      setBookmarkedJobs(savedJobs);
      const [content, roadmap, questionsRes] = await Promise.all([
        getLearningContent(selectedDomain),
        getLearningRoadmap(selectedDomain),
        getDSAQuestions(selectedDomain)
      ]);
      setLearningContent(content);
      setLearningRoadmap(roadmap);
      const questions = questionsRes.questions || [];
      setDsaQuestions(questions);
      if (questions.length > 0) {
        setSelectedQuestion(questions[0]);
        setCodeInput(questions[0]?.starter?.[codeLanguage] || "");
      }
    } catch {
      toast.error("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authenticated) return undefined;
    loadAll();
    const id = setInterval(loadAll, 30000);
    return () => clearInterval(id);
  }, [authenticated, selectedDomain]);

  useEffect(() => {
    if (!selectedQuestion) return;
    setCodeInput(selectedQuestion?.starter?.[codeLanguage] || "");
  }, [codeLanguage, selectedQuestion]);

  const sessionsByDate = useMemo(() => {
    const map = new Map();
    sessions.forEach((session) => {
      if (!map.has(session.session_date)) map.set(session.session_date, []);
      map.get(session.session_date).push(session);
    });
    return map;
  }, [sessions]);
  const calendarWeeks = useMemo(() => monthGrid(calendarDate), [calendarDate]);

  const topCards = useMemo(() => {
    if (!dashboard || !readiness) return [];
    const getMetric = (label, fallback = "0%") => dashboard.metrics?.find((m) => m.label === label)?.value || fallback;
    return [
      { label: "ATS Score", value: getMetric("ATS Score"), icon: GaugeCircle, tint: "from-indigo-500/25 to-purple-500/25" },
      { label: "Match Score", value: getMetric("Match Score"), icon: Target, tint: "from-cyan-500/25 to-indigo-500/25" },
      { label: "Readiness Score", value: `${Math.round(readiness.readiness_score || 0)}%`, icon: ShieldCheck, tint: "from-purple-500/25 to-cyan-500/25" },
      { label: "Profile Strength", value: getMetric("Application Readiness"), icon: Activity, tint: "from-indigo-500/25 to-cyan-500/25" }
    ];
  }, [dashboard, readiness]);

  const onAuthSuccess = (nextUser) => {
    setUser(nextUser);
    setAuthenticated(true);
    toast.success("Welcome back");
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await analyzeResume(file);
    toast.success("Resume analyzed");
    await loadAll();
  };

  const runResumeEngine = async () => {
    try {
      const result = await getResumeImprovementAnalysis(resumeJobDescription);
      setResumeEngine(result);
      toast.success("Detailed resume analysis ready");
    } catch {
      toast.error("Run analysis after uploading a resume");
    }
  };

  const runOneClickImprove = async () => {
    try {
      const result = await oneClickImproveResume(resumeJobDescription);
      setImprovedResume(result);
      toast.success("AI improved resume generated");
    } catch {
      toast.error("Unable to generate improved resume");
    }
  };

  const runMatch = async () => {
    setJobResult(await matchResumeToJob(jobDescription || "Frontend role requiring React and TypeScript"));
  };

  const loadQuiz = async () => {
    const result = await getPracticeTest(selectedDomain, testType);
    setQuiz(result.questions || []);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const submitQuizHandler = async () => {
    const result = await submitPracticeTest({ domain: selectedDomain, test_type: testType, answers: quizAnswers });
    setQuizResult(result);
  };

  const generateMock = async () => {
    const result = await generateMockInterviewQuestions(mockRole);
    const all = [...(result.technical || []), ...(result.behavioral || [])];
    setMockSet(result);
    setMockAnswers(new Array(all.length).fill(""));
  };

  const evaluateMockHandler = async () => {
    const questions = [...(mockSet.technical || []), ...(mockSet.behavioral || [])];
    setMockEval(await evaluateMockInterview({ role: mockRole, questions, answers: mockAnswers }));
    await loadAll();
  };

  const completeChallengeHandler = async (challenge) => {
    await completeDailyChallenge({
      challenge_date: new Date().toISOString().slice(0, 10),
      domain: selectedDomain,
      title: challenge.title,
      score: challenge.points
    });
    setStreak(await getStreak());
    toast.success("Challenge completed");
  };

  const sendCoach = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { id: Date.now(), who: "user", text }]);
    const response = await chatCareerCoach(text);
    setChatMessages((prev) => [...prev, { id: Date.now() + 1, who: "assistant", text: response.reply }]);
  };

  const loadDSAByDifficulty = async (difficulty) => {
    setDsaDifficulty(difficulty);
    const response = await getDSAQuestions(selectedDomain, difficulty);
    const items = response.questions || [];
    setDsaQuestions(items);
    const first = items[0] || null;
    setSelectedQuestion(first);
    setCodeInput(first?.starter?.[codeLanguage] || "");
    setDsaRunResult(null);
  };

  const runCodeForQuestion = async () => {
    if (!selectedQuestion) return;
    setDsaRunning(true);
    try {
      const result = await runDSACode({
        domain: selectedDomain,
        question_id: selectedQuestion.id,
        language: codeLanguage,
        code: codeInput
      });
      setDsaRunResult(result);
      toast.success("Code executed");
    } catch {
      toast.error("Run failed");
    } finally {
      setDsaRunning(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="relative min-h-[82vh] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(168,85,247,0.15),transparent_30%)]" />
        <div className="relative grid min-h-[82vh] place-items-center text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Premium AI SaaS</p>
            <h2 className="mt-2 text-4xl font-bold">AI Career Intelligence Ecosystem</h2>
          </div>
        </div>
        <AuthOverlay onAuthenticated={onAuthSuccess} />
      </div>
    );
  }

  return (
    <motion.div
      key={forcedTab || activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {loading && <LoadingSkeleton className="h-24 w-full" />}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-r from-pink-300/18 via-violet-300/18 to-sky-300/18 p-5 shadow-2xl shadow-violet-900/30"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-44 w-44 rounded-full bg-sky-300/28 blur-3xl" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Workspace</p>
            <h2 className="mt-2 bg-gradient-to-r from-indigo-200 via-cyan-200 to-purple-200 bg-clip-text text-3xl font-bold text-transparent">
              {pageTitle || "AI Resume Intelligence Platform"}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{pageSubtitle || "Modern AI career control panel"}</p>
          </div>
          <button type="button" onClick={() => setDrawerOpen(true)} className="btn-secondary-glass">Insights Drawer</button>
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {topCards.map((card) => {
          const Icon = card.icon;
          return (
          <Card key={card.label} interactive className={`bg-gradient-to-br ${card.tint} hover:shadow-[0_14px_42px_rgba(244,114,182,0.26)]`}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{card.label}</p>
              <span className="rounded-lg bg-gradient-to-r from-pink-300/30 via-violet-300/25 to-sky-300/25 p-2 text-white"><Icon size={14} /></span>
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
          </Card>
          );
        })}
      </div>

      {!forcedTab && <div className="sticky top-16 z-10 -mx-2 overflow-x-auto rounded-2xl border border-white/25 bg-gradient-to-r from-pink-300/14 via-violet-300/12 to-sky-300/14 px-2 py-2 backdrop-blur-2xl">
        <div className="flex w-max gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`premium-tab ${activeTab === tab.id ? "premium-tab-active" : ""}`}>
                <span className="inline-flex items-center gap-2"><Icon size={14} /> {tab.label}</span>
                {activeTab === tab.id ? (
                  <motion.span
                    layoutId="tab-underline"
                    className="mt-2 block h-0.5 w-full rounded-full bg-gradient-to-r from-pink-300 via-violet-300 to-sky-300"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>}

      {notifications.length > 0 && (
        <Card title="Notifications" subtitle="Realtime product signals" className="border-cyan-300/20 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10">
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                {n}
              </div>
            ))}
          </div>
        </Card>
      )}
      {notifications.length === 0 && (
        <Card title="Notifications" subtitle="Realtime product signals">
          <p className="text-sm text-slate-300">No new notifications right now.</p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Score Trend Snapshot" subtitle="Quick view" interactive>
          {versions.length > 0 ? (
            <ScoreLineChart data={versions.map((v) => ({ version: v.version, score: v.score }))} />
          ) : (
            <p className="text-sm text-slate-300">No trend data yet. Upload resume versions to populate this chart.</p>
          )}
        </Card>
        <Card title="System Status" subtitle="Workspace health" interactive>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><FileText size={14} /> Resume Engine</span>
              <span className="text-emerald-300">Active</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-200"><Target size={14} /> Job Matching</span>
              <span className="text-emerald-300">Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {user?.role === "job_seeker" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Progress Tracking" subtitle="Your weekly momentum" interactive>
            <MetricProgress label="Resume Optimization" value={Math.min(100, Math.round((versions.length || 0) * 20))} />
            <div className="mt-3" />
            <MetricProgress label="Practice Completion" value={Math.min(100, Math.round((streak?.completed_total || 0) * 8))} />
          </Card>
          <Card title="Learning Suggestions" subtitle="Recommended next focus" interactive>
            <ul className="space-y-2 text-sm text-slate-200">
              {(learningContent?.topics?.concepts || []).slice(0, 3).map((topic) => (
                <li key={topic} className="rounded-lg border border-white/10 bg-white/5 p-2">{topic}</li>
              ))}
              {(learningContent?.coding_practice?.company_specific || []).slice(0, 2).map((item) => (
                <li key={item} className="rounded-lg border border-white/10 bg-white/5 p-2">{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeTab === "resume" && (
        <Card title="Full Resume Improvement Engine" interactive>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={uploadResume} />
          <div className="grid gap-3 lg:grid-cols-[auto,1fr,1fr]">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary-glow">
              <span className="inline-flex items-center gap-2"><Upload size={14} /> Upload Resume</span>
            </button>
            <button type="button" onClick={runResumeEngine} className="btn-secondary-glass">
              Analyze Full Resume
            </button>
            <button type="button" onClick={runOneClickImprove} className="btn-primary-glow">
              One-click AI Improve
            </button>
          </div>

          <textarea
            value={resumeJobDescription}
            onChange={(e) => setResumeJobDescription(e.target.value)}
            rows={4}
            className="mt-3 w-full rounded-xl border border-white/15 bg-slate-900 p-3 text-sm"
            placeholder="Paste job description for keyword/skill gap analysis"
          />

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <Card title="Resume Improvement History"><ScoreLineChart data={versions.map((v) => ({ version: v.version, score: v.score }))} /></Card>
            <Card title="Version Comparison">
              <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{versions[versions.length - 1]?.summary || "No version yet."}</p>
            </Card>
          </div>

          {resumeEngine && (
            <div className="mt-4 space-y-4">
              <details open className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-200">ATS Score Breakdown</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Tooltip label="Match of extracted resume skills vs role requirements"><div><MetricProgress label="Skills Match" value={resumeEngine.ats_breakdown.skills_match} /></div></Tooltip>
                  <Tooltip label="Coverage and relevance of listed work experience"><div><MetricProgress label="Experience" value={resumeEngine.ats_breakdown.experience} /></div></Tooltip>
                  <Tooltip label="Keyword overlap between resume and job description"><div><MetricProgress label="Keyword Match" value={resumeEngine.ats_breakdown.keyword_match} /></div></Tooltip>
                  <Tooltip label="Resume section and bullet structure quality"><div><MetricProgress label="Formatting" value={resumeEngine.ats_breakdown.formatting} /></div></Tooltip>
                  <Tooltip label="Project section depth and relevance"><div><MetricProgress label="Projects" value={resumeEngine.ats_breakdown.projects} /></div></Tooltip>
                  <Tooltip label="Approximate semantic similarity to target role"><div><MetricProgress label="Semantic Similarity" value={resumeEngine.semantic_match} /></div></Tooltip>
                </div>
              </details>

              <details open className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-200">Resume Heatmap</summary>
                <div className="mt-3 grid gap-4 xl:grid-cols-[240px,1fr]">
                  <Card title="Heatmap Guide">
                    <HeatmapLegend />
                    <p className="mt-3 text-xs text-slate-300">
                      Inline highlighting below maps each resume line to quality strength,
                      so weak bullets are visible in context of the full resume.
                    </p>
                  </Card>
                  <Card title="Full Resume Preview">
                    <div className="max-h-[520px] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-xs leading-6">
                      {(resumeEngine.heatmap || []).map((line, idx) => (
                        <Tooltip key={`${line.text}-${idx}`} label={line.reason}>
                          <p
                            className={`mb-1 rounded px-2 py-0.5 transition ${
                              line.color === "green"
                                ? "bg-emerald-500/15 text-emerald-100"
                                : line.color === "yellow"
                                  ? "bg-amber-500/15 text-amber-100"
                                  : "bg-rose-500/15 text-rose-100"
                            }`}
                          >
                            {line.text}
                          </p>
                        </Tooltip>
                      ))}
                    </div>
                    {resumeEngine.raw_text ? (
                      <p className="mt-2 text-[11px] text-slate-400">
                        {resumeEngine.raw_text.split("\n").filter((line) => line.trim()).length} lines analyzed
                      </p>
                    ) : null}
                  </Card>
                </div>
              </details>

              <details open className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-200">Keyword Gap + Missing Skills</summary>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <Card title="Present Keywords">
                    <div className="flex flex-wrap gap-2">{(resumeEngine.keyword_gap?.present_keywords || []).map((k) => <BadgeTag key={k} label={k} tone="success" />)}</div>
                  </Card>
                  <Card title="Missing Keywords">
                    <div className="flex flex-wrap gap-2">{(resumeEngine.keyword_gap?.missing_keywords || []).map((k) => <BadgeTag key={k} label={k} tone="warning" />)}</div>
                  </Card>
                </div>
                <div className="mt-3 space-y-2">
                  {(resumeEngine.missing_skills || []).map((item) => (
                    <div key={item.skill} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <span>{item.skill}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        item.importance === "high" ? "bg-rose-500/20 text-rose-100" : item.importance === "medium" ? "bg-amber-500/20 text-amber-100" : "bg-emerald-500/20 text-emerald-100"
                      }`}>
                        {item.importance}
                      </span>
                    </div>
                  ))}
                </div>
              </details>

              <details open className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-cyan-200">AI Suggestions + Improvement Roadmap</summary>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <Card title="Bullet-level Suggestions">
                    <div className="space-y-2">
                      {(resumeEngine.bullet_suggestions || []).map((item, idx) => (
                        <div key={`${item.original}-${idx}`} className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs">
                          <p className="text-slate-400">Before: {item.original}</p>
                          <p className="mt-1 text-cyan-100">After: {item.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card title="Roadmap">
                    <div className="space-y-2">
                      {(resumeEngine.improvement_roadmap || []).map((step) => (
                        <div key={step.priority} className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs">
                          <p className="font-semibold text-cyan-100">P{step.priority}: {step.title}</p>
                          <p className="text-slate-300">{step.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </details>
            </div>
          )}

          {improvedResume && (
            <details open className="mt-4 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-cyan-100">Before vs After Comparison</summary>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(improvedResume.before_after || []).map((row, index) => (
                  <div key={index} className="space-y-2 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-xs">
                    <p className="text-rose-200">Before: {row.before}</p>
                    <p className="text-emerald-200">After: {row.after}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </Card>
      )}

      {activeTab === "matching" && (
        <Card title="Job Matching + Recommendations" interactive>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={5} className="w-full rounded-xl border border-white/15 bg-slate-900 p-3 text-sm" placeholder="Paste job description" />
          <button type="button" onClick={runMatch} className="btn-primary-glow mt-3">Match Resume</button>
          {jobResult && (
            <div className="mt-4 grid gap-4 md:grid-cols-[170px,1fr]">
              <ProgressCircle value={jobResult.score} label="Match" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Matching Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">{(jobResult.matchingSkills || []).map((s) => <BadgeTag key={s} label={s} tone="success" />)}</div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">Missing Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">{(jobResult.missingSkills || []).map((s) => <BadgeTag key={s} label={s} tone="warning" />)}</div>
              </div>
            </div>
          )}
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {recommendedJobs.length === 0 && <p className="text-sm text-slate-300">No recommendations yet. Run a match to generate suggestions.</p>}
            {recommendedJobs.map((job) => (
              <Card key={`${job.title}-${job.company}`} interactive>
                <p className="text-sm font-semibold text-slate-100">{job.title}</p>
                <p className="text-xs text-slate-400">{job.company}</p>
                <p className="mt-1 text-xs text-cyan-300">Match {job.match_score}%</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={async () => {
                    await bookmarkJob(job);
                    setBookmarkedJobs(await getBookmarkedJobs());
                    toast.success("Bookmarked");
                  }} className="rounded-lg border border-white/15 px-2 py-1 text-xs">Bookmark</button>
                  <a href={job.url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 px-2 py-1 text-xs"><span className="inline-flex items-center gap-1">Open <ExternalLink size={12} /></span></a>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "ats" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card title="Skill Gap Analysis" interactive><SkillGapBarChart data={dashboard?.skillGap || []} /></Card>
          <Card title="Skill Distribution" interactive><SkillDistributionPieChart data={dashboard?.skillDistribution || []} /></Card>
        </div>
      )}

      {activeTab === "feedback" && (
        <Card title="AI Resume Improver" interactive>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-2">{(feedback?.improvements || []).map((item) => <p key={item} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{item}</p>)}</div>
            <div className="space-y-2">{(feedback?.bulletSuggestions || feedback?.bullet_rewrites || []).map((item) => <p key={item} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{item}</p>)}</div>
          </div>
        </Card>
      )}

      {activeTab === "prep" && (
        <Card title="Interview Preparation Hub" interactive>
          <div className="grid gap-3 md:grid-cols-4">
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm">{domains.map((d) => <option key={d.domain}>{d.domain}</option>)}</select>
            <select value={testType} onChange={(e) => setTestType(e.target.value)} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"><option value="mcq">MCQ</option><option value="scenario">Scenario</option></select>
            <button type="button" onClick={loadQuiz} className="btn-primary-glow">Load Test</button>
            <button type="button" onClick={async () => {
              await generateStudyPlan(selectedDomain);
              setPlans(await getStudyPlans());
            }} className="btn-secondary-glass">Generate Plan</button>
          </div>
          {quiz.length > 0 && (
            <div className="mt-4 space-y-3">
              {quiz.map((q) => (
                <Card key={q.id} title={q.question}>
                  <div className="grid gap-2 sm:grid-cols-2">{q.options?.map((option) => <button key={option} type="button" onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: option }))} className={`rounded-lg border px-3 py-2 text-left text-sm ${quizAnswers[q.id] === option ? "border-cyan-300 bg-cyan-500/20" : "border-white/10 bg-white/5"}`}>{option}</button>)}</div>
                </Card>
              ))}
              <button type="button" onClick={submitQuizHandler} className="btn-primary-glow">Submit Test</button>
              {quizResult && <p className="text-sm text-slate-200">Score {quizResult.score}% | {quizResult.feedback}</p>}
            </div>
          )}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card title="Daily Challenges" subtitle={`Streak: ${streak.streak_days || 0} days`}>
              {dailyChallenges.map((challenge) => (
                <div key={challenge.id} className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <span>{challenge.title}</span>
                  <button type="button" onClick={() => completeChallengeHandler(challenge)} className="rounded-lg bg-white/10 px-2 py-1 text-xs">Complete</button>
                </div>
              ))}
            </Card>
            <Card title="Weekly Study Planner">
              {(plans[0]?.tasks || []).slice(0, 5).map((task) => <p key={`${task.date}-${task.task}`} className="mb-1 rounded-lg border border-white/10 bg-white/5 p-2 text-sm">{task.date}: {task.task}</p>)}
            </Card>
          </div>
        </Card>
      )}

      {activeTab === "interviews" && (
        <Card title="Mock + Live Interview System" interactive>
          <div className="flex flex-wrap gap-2">
            <select value={mockRole} onChange={(e) => setMockRole(e.target.value)} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"><option>Frontend Engineer</option><option>Backend Engineer</option><option>DevOps Engineer</option></select>
            <button type="button" onClick={generateMock} className="btn-primary-glow">Generate Mock Questions</button>
          </div>
          {[...(mockSet.technical || []), ...(mockSet.behavioral || [])].map((question, index) => (
            <textarea key={`${question}-${index}`} rows={2} value={mockAnswers[index] || ""} onChange={(e) => setMockAnswers((prev) => {
              const next = [...prev];
              next[index] = e.target.value;
              return next;
            })} className="mt-3 w-full rounded-xl border border-white/15 bg-slate-900 p-3 text-sm" placeholder={question} />
          ))}
          {mockAnswers.length > 0 && <button type="button" onClick={evaluateMockHandler} className="btn-primary-glow mt-3">Evaluate</button>}
          {mockEval && <p className="mt-2 text-sm text-slate-200">Mock Interview Score: {mockEval.overall_score}%</p>}

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,1fr]">
            <Card title="Live Session Calendar">
              <div className="mb-3 flex items-center justify-between">
                <button type="button" onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="rounded-lg border border-white/15 p-1.5"><ChevronLeft size={16} /></button>
                <p className="text-sm font-semibold">{calendarDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
                <button type="button" onClick={() => setCalendarDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="rounded-lg border border-white/15 p-1.5"><ChevronRight size={16} /></button>
              </div>
              {calendarWeeks.map((week, index) => (
                <div key={index} className="mb-1 grid grid-cols-7 gap-1">
                  {week.map((day, idx) => {
                    if (!day) return <div key={`${index}-${idx}`} className="h-14 rounded-lg bg-white/5" />;
                    const key = formatYmd(day);
                    const daySessions = sessionsByDate.get(key) || [];
                    return (
                      <button key={`${key}-${idx}`} type="button" onClick={() => daySessions.length && setBookingModal({ open: true, session: daySessions[0] })} className={`h-14 rounded-lg border p-1 text-left text-xs ${daySessions.length ? "border-cyan-300/40 bg-cyan-500/20" : "border-white/10 bg-white/5"}`}>
                        <p>{day.getDate()}</p>
                      </button>
                    );
                  })}
                </div>
              ))}
            </Card>
            <Card title="Upcoming Sessions">
              {sessions.length === 0 && <p className="mb-2 text-sm text-slate-300">No live sessions available.</p>}
              {sessions.map((session) => (
                <div key={session.id} className="mb-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="font-semibold">{session.title}</p>
                  <p className="text-xs text-slate-400">{session.session_date} {session.session_time}</p>
                  <button type="button" onClick={() => setBookingModal({ open: true, session })} className="mt-2 rounded-lg bg-cyan-500 px-2 py-1 text-xs font-semibold text-slate-950">Book</button>
                </div>
              ))}
            </Card>
          </div>
        </Card>
      )}

      {activeTab === "learning" && (
        <Card title="Learning Roadmaps & Practice System" interactive>
          <div className="grid gap-4 xl:grid-cols-[1fr,1.1fr]">
            <Card title={`${selectedDomain} Roadmap`}>
              {(learningRoadmap?.roadmap ? Object.keys(learningRoadmap.roadmap) : []).map((level) => (
                <div key={level} className="mb-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="font-semibold">{level}</p>
                  {(learningRoadmap.roadmap[level] || []).map((item) => <p key={item}>{item}</p>)}
                </div>
              ))}
              <div className="mt-3 flex flex-wrap gap-2">
                {(learningRoadmap?.platforms || learningContent?.coding_practice?.platforms || []).map((platform) => (
                  <a key={platform.name} href={platform.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-100 hover:bg-white/15">
                    {platform.name}
                  </a>
                ))}
              </div>
            </Card>

            <Card title="DSA Practice Workspace">
              <div className="mb-3 grid gap-2 md:grid-cols-3">
                <select value={dsaDifficulty} onChange={(e) => loadDSAByDifficulty(e.target.value)} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm">
                  <option value="">All levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select value={selectedQuestion?.id || ""} onChange={(e) => {
                  const item = dsaQuestions.find((q) => q.id === e.target.value) || null;
                  setSelectedQuestion(item);
                  setCodeInput(item?.starter?.[codeLanguage] || "");
                  setDsaRunResult(null);
                }} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm">
                  {(dsaQuestions || []).map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
                </select>
                <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm">
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                </select>
              </div>

              {selectedQuestion ? (
                <>
                  <p className="mb-2 text-sm text-slate-200">{selectedQuestion.prompt}</p>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    rows={12}
                    className="w-full rounded-xl border border-white/15 bg-slate-950/75 p-3 font-mono text-xs text-slate-100"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={runCodeForQuestion} disabled={dsaRunning} className="btn-primary-glow">
                      {dsaRunning ? "Running..." : "Run & Test"}
                    </button>
                  </div>
                  {dsaRunResult && (
                    <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-3 text-xs">
                      <p className="font-semibold text-slate-100">{dsaRunResult.message}</p>
                      <p className="mt-1 text-slate-300">Passed: {dsaRunResult.passed}/{dsaRunResult.total}</p>
                      <div className="mt-2 space-y-1">
                        {(dsaRunResult.results || []).map((result) => (
                          <p key={`${result.test_case}-${result.input}`} className={result.status === "passed" ? "text-emerald-300" : "text-rose-300"}>
                            Test {result.test_case}: {result.status}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-300">No DSA question available for this filter.</p>
              )}
            </Card>
          </div>

          <Card title="Aptitude Tracks" className="mt-4">
            <div className="mb-2 flex flex-wrap gap-2">{(learningContent?.aptitude_tracks || []).map((track) => <BadgeTag key={track} label={track} tone="info" />)}</div>
            <div className="flex flex-wrap gap-2">{(learningContent?.coding_practice?.dsa || []).map((problem) => <BadgeTag key={problem.problem} label={`${problem.level}: ${problem.problem}`} />)}</div>
          </Card>
          <Card title="Domain Study Focus" className="mt-4">
            <div className="grid gap-2 md:grid-cols-3">
              {(domains || []).map((domain) => (
                <button
                  key={domain.domain}
                  type="button"
                  onClick={() => setSelectedDomain(domain.domain)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                    selectedDomain === domain.domain
                      ? "border-cyan-300/40 bg-cyan-500/20 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">{domain.domain}</p>
                  <p className="text-xs opacity-80">{(domain.topics || []).slice(0, 2).join(" • ")}</p>
                </button>
              ))}
            </div>
          </Card>
        </Card>
      )}

      {activeTab === "analytics" && (
        <Card title="Analytics Dashboard" interactive>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card title="Resume Trend"><ScoreLineChart data={versions.map((v) => ({ version: v.date || v.version, score: v.score }))} /></Card>
            <Card title="Job Match Trend">
              {comparison.map((item) => <p key={item.id} className="mb-1 rounded-lg border border-white/10 bg-white/5 p-2 text-sm">{item.role}: {item.match}%</p>)}
            </Card>
          </div>
          <Card title="Bookmarked Jobs" className="mt-4">
            <div className="flex flex-wrap gap-2">{bookmarkedJobs.map((job) => <span key={`${job.id}-${job.title}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">{job.title} ({job.company})</span>)}</div>
          </Card>
        </Card>
      )}

      <Tooltip label="Quick upload">
        <button type="button" onClick={() => fileRef.current?.click()} className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-xl hover:bg-cyan-400"><Plus size={22} /></button>
      </Tooltip>

      <button type="button" onClick={() => setChatOpen((prev) => !prev)} className="fixed bottom-24 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-slate-900/90 text-cyan-300 shadow-xl hover:bg-slate-800"><MessageSquare size={22} /></button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="fixed bottom-40 right-6 z-40 w-[340px] rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-cyan-300">AI Career Coach</p><button type="button" onClick={() => setChatOpen(false)}><X size={16} /></button></div>
            <div className="mb-3 h-52 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2">
              {chatMessages.map((msg) => <div key={msg.id} className={`rounded-lg px-2 py-1 text-xs ${msg.who === "assistant" ? "bg-cyan-500/15 text-cyan-100" : "bg-white/10 text-slate-100"}`}>{msg.text}</div>)}
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full rounded-lg border border-white/10 bg-slate-900 px-2 py-2 text-xs" placeholder="Ask anything..." />
              <button type="button" onClick={sendCoach} className="rounded-lg bg-cyan-500 px-2 text-slate-950"><Send size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-30 bg-slate-950/60" />
            <motion.aside initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} className="fixed right-0 top-0 z-40 h-full w-80 border-l border-white/10 bg-slate-950/95 p-5">
              <div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-cyan-300">Insights</h3><button type="button" onClick={() => setDrawerOpen(false)}><X size={18} /></button></div>
              <p className="text-sm text-slate-200">1. Prioritize quantified achievements in your latest resume version.</p>
              <p className="mt-2 text-sm text-slate-200">2. Focus on missing top-3 skills from match analysis this week.</p>
              <p className="mt-2 text-sm text-slate-200">3. Maintain your daily challenge streak for readiness acceleration.</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bookingModal.open && bookingModal.session && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 grid place-items-center bg-slate-950/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-5">
              <h3 className="text-lg font-semibold text-cyan-300">Book Live Session</h3>
              <p className="mt-2 text-sm text-slate-300">{bookingModal.session.title}</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={async () => {
                  const booking = await bookInterviewSession(bookingModal.session.id);
                  const joined = await joinInterviewSession(booking.booking_id);
                  if (joined?.meeting_link) window.open(joined.meeting_link, "_blank", "noopener,noreferrer");
                  setBookingModal({ open: false, session: null });
                }} className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">Confirm</button>
                <button type="button" onClick={() => setBookingModal({ open: false, session: null })} className="rounded-xl border border-white/15 px-3 py-2 text-sm">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UnifiedDashboardPage;


