import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";

function ShortlistedCandidatesPage() {
  const { shortlistedCandidates, toggleShortlistCandidate } = useOutletContext();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Recruiter</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Shortlisted Candidates</h2>
      </header>

      <Card>
        {shortlistedCandidates.length === 0 && <p className="text-sm text-slate-300">No shortlisted candidates yet.</p>}
        <div className="space-y-2">
          {shortlistedCandidates.map((candidate) => (
            <div key={candidate.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-100">{candidate.name}</p>
                <p className="text-sm text-cyan-200">ATS {candidate.matchScore}%</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(candidate.skills || []).map((skill) => <BadgeTag key={`${candidate.id}-${skill}`} label={skill} tone="info" />)}
              </div>
              <button type="button" onClick={() => toggleShortlistCandidate(candidate)} className="mt-3 rounded-xl bg-rose-500/25 px-3 py-2 text-xs font-semibold text-rose-100">
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ShortlistedCandidatesPage;
