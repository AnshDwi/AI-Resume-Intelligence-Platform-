import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ScoreLineChart from "../components/charts/ScoreLineChart";
import PageContainer from "../components/PageContainer";
import { getResumeVersions } from "../services/api";

function ResumeVersionsPage() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVersions = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getResumeVersions();
        setVersions(response);
      } catch (err) {
        setError(err.message || "Unable to load resume versions.");
        toast.error("Could not fetch resume versions.");
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-52 w-full" />
        <LoadingSkeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card title="Resume Versions">
        <p className="text-sm text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <PageContainer className="grid gap-6 xl:grid-cols-2">
      <Card title="Version Timeline" subtitle="Track how your resume improved over each iteration.">
        <div className="relative pl-6">
          <div className="absolute left-2 top-1 h-[94%] w-0.5 bg-slate-200" />
          <ul className="space-y-5">
            {versions.map((version) => (
              <li key={version.id} className="relative">
                <div className="absolute -left-[1.65rem] top-2 h-3 w-3 rounded-full bg-brand-500" />
                <p className="text-sm font-semibold text-slate-900">
                  {version.version} - {version.score}%
                </p>
                <p className="text-xs text-slate-500">{version.date}</p>
                <p className="mt-1 text-sm text-slate-600">{version.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card title="Score Progress Over Time">
        <ScoreLineChart data={versions} />
      </Card>
    </PageContainer>
  );
}

export default ResumeVersionsPage;
