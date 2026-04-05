import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import PageContainer from "../components/PageContainer";
import ProgressBar from "../components/ProgressBar";
import ProgressCircle from "../components/ProgressCircle";
import { generateStudyPlan, getInterviewReadiness, getStudyPlans } from "../services/api";

function ReadinessPlannerPage() {
  const [readiness, setReadiness] = useState(null);
  const [plans, setPlans] = useState([]);
  const [domain, setDomain] = useState("Frontend Developer");

  const loadData = async () => {
    try {
      const [readinessData, planData] = await Promise.all([getInterviewReadiness(), getStudyPlans()]);
      setReadiness(readinessData);
      setPlans(planData);
    } catch {
      toast.error("Unable to load readiness data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generatePlan = async () => {
    try {
      const response = await generateStudyPlan(domain);
      setPlans((current) => [response, ...current]);
      toast.success("Weekly plan generated.");
    } catch {
      toast.error("Could not generate study plan.");
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="Interview Readiness Score" subtitle="Combined score from resume quality, tests, and mock interview performance.">
        {readiness ? (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex justify-center">
              <ProgressCircle value={readiness.readiness_score} label="Overall Readiness" />
            </div>
            <div className="md:col-span-2 space-y-3">
              <div>
                <p className="mb-1 text-sm text-slate-600">Resume Score</p>
                <ProgressBar value={readiness.components.resume_score} />
              </div>
              <div>
                <p className="mb-1 text-sm text-slate-600">Test Performance</p>
                <ProgressBar value={readiness.components.test_score} />
              </div>
              <div>
                <p className="mb-1 text-sm text-slate-600">Mock Interview</p>
                <ProgressBar value={readiness.components.mock_interview_score} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No readiness data yet.</p>
        )}
      </Card>

      <Card title="Weekly Study Planner" subtitle="Generate and track a personalized 7-day preparation plan.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option>Software Developer</option>
            <option>Backend Developer</option>
            <option>Frontend Developer</option>
            <option>DevOps Engineer</option>
            <option>Cybersecurity</option>
          </select>
          <button type="button" onClick={generatePlan} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
            Generate Plan
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        {plans.map((plan, idx) => (
          <Card key={`${plan.week_start || plan.plan_week}-${idx}`} title={`Week Plan ${plan.week_start || plan.plan_week}`}>
            <div className="space-y-2">
              {(plan.tasks || []).map((task) => (
                <div key={`${task.date}-${task.task}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{task.task}</p>
                    <p className="text-xs text-slate-500">{task.date}</p>
                  </div>
                  <span className={`text-xs font-semibold ${task.completed ? "text-emerald-600" : "text-amber-600"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}

export default ReadinessPlannerPage;
