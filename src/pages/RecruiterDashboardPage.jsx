import { useEffect, useState } from "react";
import { Users, UserCheck, GaugeCircle } from "lucide-react";
import Card from "../components/Card";
import { getRecruiterCandidates } from "../services/api";

function RecruiterDashboardPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    getRecruiterCandidates("react", 0, "").then(setCandidates).catch(() => setCandidates([]));
  }, []);

  const total = candidates.length;
  const shortlisted = candidates.filter((item) => item.matchScore >= 80).length;
  const avg = total ? Math.round(candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / total) : 0;

  const cards = [
    { label: "Total Candidates", value: total, icon: Users },
    { label: "Shortlisted", value: shortlisted, icon: UserCheck },
    { label: "Avg ATS Score", value: `${avg}%`, icon: GaugeCircle }
  ];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Recruiter</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Recruiter Dashboard</h2>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} interactive>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{card.label}</p>
                <span className="rounded-lg bg-white/10 p-2 text-cyan-100"><Icon size={14} /></span>
              </div>
              <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default RecruiterDashboardPage;
