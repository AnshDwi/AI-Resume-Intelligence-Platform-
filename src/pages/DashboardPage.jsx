import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";
import SkillGapBarChart from "../components/charts/SkillGapBarChart";
import SkillDistributionPieChart from "../components/charts/SkillDistributionPieChart";
import ScoreLineChart from "../components/charts/ScoreLineChart";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import {
  getDashboardData,
  getNotifications,
  getRecruiterAnalytics,
  getRoleRecommendations,
  getSeekerAnalytics
} from "../services/api";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [seekerAnalytics, setSeekerAnalytics] = useState(null);
  const [recruiterAnalytics, setRecruiterAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [overview, seeker, recruiter, roles, notices] = await Promise.all([
          getDashboardData(),
          getSeekerAnalytics(),
          getRecruiterAnalytics(),
          getRoleRecommendations(),
          getNotifications()
        ]);
        setDashboardData(overview);
        setSeekerAnalytics(seeker);
        setRecruiterAnalytics(recruiter);
        setRecommendations(roles);
        setNotifications(notices);
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
        toast.error("Could not load analytics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-28 w-full" />
        <LoadingSkeleton className="h-80 w-full" />
        <LoadingSkeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="Dashboard">
        <p className="text-sm text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardData.metrics.map((metric) => (
          <Card key={metric.label} className="transition hover:-translate-y-0.5 hover:shadow-lg">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Skills Extracted" className="xl:col-span-2">
          <div className="flex flex-wrap gap-2">
            {dashboardData.skills.map((skill) => (
              <BadgeTag key={skill} label={skill} tone="info" />
            ))}
          </div>
        </Card>
        <Card title="Live Notifications">
          <ul className="space-y-2 text-sm text-slate-600">
            {notifications.map((message) => (
              <li key={message} className="rounded-lg bg-slate-50 p-3">
                {message}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Skill Gap Analysis">
          <SkillGapBarChart data={dashboardData.skillGap} />
        </Card>
        <Card title="Skill Distribution">
          <SkillDistributionPieChart data={dashboardData.skillDistribution} />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Match Score Trends" className="xl:col-span-2">
          <ScoreLineChart data={seekerAnalytics.trend.map((item) => ({ version: item.month, score: item.match }))} />
        </Card>
        <Card title="Role Recommendations">
          <ul className="space-y-3">
            {recommendations.map((role) => (
              <li key={role.role} className="rounded-xl border border-slate-200 p-3 text-sm">
                <p className="font-semibold text-slate-900">{role.role}</p>
                <p className="text-slate-500">Confidence: {Math.round(role.confidence * 100)}%</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Recruiter Hiring Funnel">
        <div className="grid gap-3 sm:grid-cols-4">
          {recruiterAnalytics.funnel.map((stage) => (
            <div key={stage.stage} className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-500">{stage.stage}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stage.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}

export default DashboardPage;
