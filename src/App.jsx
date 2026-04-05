import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import RoleBasedLayout from "./layouts/RoleBasedLayout";
import LandingPage from "./pages/public/LandingPage";
import ResumePage from "./pages/ResumePage";
import MatchingPage from "./pages/MatchingPage";
import ATSPage from "./pages/ATSPage";
import AIFeedbackSectionPage from "./pages/AIFeedbackSectionPage";
import PrepPage from "./pages/PrepPage";
import InterviewsPage from "./pages/InterviewsPage";
import LearningPage from "./pages/LearningPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecruiterDashboardPage from "./pages/RecruiterDashboardPage";
import CandidatesPage from "./pages/CandidatesPage";
import ShortlistedCandidatesPage from "./pages/ShortlistedCandidatesPage";
import InstructorDashboardPage from "./pages/InstructorDashboardPage";
import UploadMaterialPage from "./pages/UploadMaterialPage";
import CoursesPage from "./pages/CoursesPage";
import RoleBasedRoute from "./components/RoleBasedRoute";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/resume" element={<Navigate to="/app/resume" replace />} />
      <Route path="/matching" element={<Navigate to="/app/matching" replace />} />
      <Route path="/ats" element={<Navigate to="/app/ats" replace />} />
      <Route path="/ai-feedback" element={<Navigate to="/app/ai-feedback" replace />} />
      <Route path="/prep" element={<Navigate to="/app/prep" replace />} />
      <Route path="/interviews" element={<Navigate to="/app/interviews" replace />} />
      <Route path="/learning" element={<Navigate to="/app/learning" replace />} />
      <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />

      <Route path="/app" element={<MainLayout />}>
        <Route element={<RoleBasedLayout />}>
          <Route index element={<Navigate to="/app/resume" replace />} />
          <Route path="dashboard" element={<Navigate to="/app/resume" replace />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="matching" element={<MatchingPage />} />
          <Route path="ats" element={<ATSPage />} />
          <Route path="ai-feedback" element={<AIFeedbackSectionPage />} />
          <Route path="prep" element={<PrepPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />

          <Route element={<RoleBasedRoute allowedRoles={["recruiter", "admin"]} />}>
            <Route path="recruiter" element={<RecruiterDashboardPage />} />
            <Route path="recruiter/candidates" element={<CandidatesPage />} />
            <Route path="recruiter/shortlisted" element={<ShortlistedCandidatesPage />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["instructor", "admin"]} />}>
            <Route path="instructor" element={<InstructorDashboardPage />} />
            <Route path="instructor/upload-material" element={<UploadMaterialPage />} />
            <Route path="instructor/courses" element={<CoursesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/app/resume" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
