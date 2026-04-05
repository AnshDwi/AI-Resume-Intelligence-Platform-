import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";
import { getRecruiterCandidates } from "../services/api";

function CandidatesPage() {
  const { shortlistedCandidates, toggleShortlistCandidate } = useOutletContext();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    getRecruiterCandidates("react", 0, "").then(setCandidates).catch(() => setCandidates([]));
  }, []);

  const filtered = useMemo(
    () =>
      candidates
        .filter((item) => item.matchScore >= Number(minScore || 0))
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
        .filter((item) => (skillFilter ? item.skills?.some((skill) => skill.toLowerCase().includes(skillFilter.toLowerCase())) : true)),
    [candidates, search, skillFilter, minScore]
  );

  const isShortlisted = (id) => shortlistedCandidates.some((item) => item.id === id);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Recruiter</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Candidates</h2>
      </header>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidate" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} placeholder="Filter by skill" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input type="number" value={minScore} onChange={(e) => setMinScore(e.target.value)} placeholder="Min score" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
        </div>
      </Card>

      <Card title="All Candidates">
        {filtered.length === 0 && <p className="text-sm text-slate-300">No candidates found for current filters.</p>}
        <div className="space-y-2">
          {filtered.map((candidate) => (
            <div key={candidate.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-100">{candidate.name}</p>
                <p className="text-sm text-cyan-200">ATS {candidate.matchScore}%</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(candidate.skills || []).map((skill) => <BadgeTag key={`${candidate.id}-${skill}`} label={skill} tone="info" />)}
              </div>
              <button
                type="button"
                onClick={() => toggleShortlistCandidate(candidate)}
                className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${isShortlisted(candidate.id) ? "bg-emerald-500/25 text-emerald-100" : "bg-white/10 text-slate-100"}`}
              >
                {isShortlisted(candidate.id) ? "Shortlisted" : "Shortlist"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CandidatesPage;
