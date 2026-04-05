import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";
import ProgressCircle from "../components/ProgressCircle";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import { matchResumeToJob } from "../services/api";

function JobMatchingPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!description.trim()) {
      setError("Please add a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await matchResumeToJob(description);
      setResult(response);
      toast.success("Matching complete.");
    } catch (err) {
      setError(err.message || "Matching failed.");
      toast.error("Unable to match resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="Job Description Analyzer + Match Engine" subtitle="Paste a role and get weighted fit scoring.">
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={7}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Paste job description..."
        />
        <button
          type="button"
          onClick={handleMatch}
          disabled={loading}
          className="mt-4 inline-flex items-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Matching..." : "Match Resume"}
        </button>
      </Card>

      {loading && (
        <div className="space-y-4">
          <LoadingSkeleton className="h-28 w-full" />
          <LoadingSkeleton className="h-56 w-full" />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && !loading && (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="flex items-center justify-center">
            <ProgressCircle value={result.score} label="Match Score" />
          </Card>
          <Card title="Skill Overlap">
            <div className="flex flex-wrap gap-2">
              {result.matchingSkills.map((skill) => (
                <BadgeTag key={skill} label={skill} tone="success" />
              ))}
            </div>
          </Card>
          <Card title="Missing Skills">
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill) => (
                <BadgeTag key={skill} label={skill} tone="warning" />
              ))}
            </div>
          </Card>

          <Card title="Strength Areas" className="xl:col-span-1">
            <ul className="space-y-2 text-sm text-slate-700">
              {result.strengths.map((item) => (
                <li key={item} className="rounded-lg bg-slate-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="AI Suggestions" className="xl:col-span-2">
            <ul className="space-y-2 text-sm text-slate-700">
              {result.suggestions.map((item) => (
                <li key={item} className="rounded-lg bg-slate-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

export default JobMatchingPage;
