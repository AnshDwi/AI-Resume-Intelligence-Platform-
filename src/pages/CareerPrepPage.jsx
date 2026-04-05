import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import BadgeTag from "../components/BadgeTag";
import PageContainer from "../components/PageContainer";
import ProgressBar from "../components/ProgressBar";
import { getCareerDomains, getCareerProgress, updateCareerProgress } from "../services/api";

function CareerPrepPage() {
  const [domains, setDomains] = useState([]);
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("Frontend Developer");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Beginner");
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [domainData, progressData] = await Promise.all([getCareerDomains(), getCareerProgress()]);
        setDomains(domainData);
        setProgressRows(progressData);
      } catch {
        toast.error("Unable to load domain preparation data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const domainInfo = useMemo(
    () => domains.find((entry) => entry.domain === selectedDomain) || domains[0],
    [domains, selectedDomain]
  );

  const progressLookup = useMemo(() => {
    const map = new Map();
    progressRows.forEach((row) => map.set(row.domain, row));
    return map;
  }, [progressRows]);

  const toggleTopic = (topic) => {
    setSelectedTopics((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]
    );
  };

  const saveProgress = async () => {
    try {
      const response = await updateCareerProgress({
        domain: selectedDomain,
        difficulty: selectedDifficulty,
        completed_topics: selectedTopics
      });
      setProgressRows((current) => {
        const filtered = current.filter((row) => row.domain !== selectedDomain);
        return [
          ...filtered,
          {
            domain: selectedDomain,
            difficulty: selectedDifficulty,
            completed_topics: selectedTopics,
            completion_percent: response.completion_percent
          }
        ];
      });
      toast.success("Progress saved.");
    } catch {
      toast.error("Could not save progress.");
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading domain preparation modules...</div>;
  }

  return (
    <PageContainer className="space-y-6">
      <Card title="Domain-Based Preparation System" subtitle="Choose a domain and track your learning path.">
        <div className="grid gap-4 md:grid-cols-3">
          <select
            value={selectedDomain}
            onChange={(event) => {
              setSelectedDomain(event.target.value);
              setSelectedTopics([]);
            }}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          >
            {domains.map((domain) => (
              <option key={domain.domain} value={domain.domain}>
                {domain.domain}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(event) => setSelectedDifficulty(event.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
          >
            {(domainInfo?.difficulty_levels || ["Beginner", "Intermediate", "Advanced"]).map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={saveProgress}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Save Progress
          </button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Structured Topics">
          <div className="flex flex-wrap gap-2">
            {(domainInfo?.topics || []).map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  selectedTopics.includes(topic)
                    ? "border-brand-600 bg-brand-100 text-brand-700"
                    : "border-slate-200 bg-white text-slate-700"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Learning Path">
          <ol className="space-y-2 text-sm text-slate-700">
            {(domainInfo?.learning_path || []).map((step) => (
              <li key={step} className="rounded-xl bg-slate-50 p-3">
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card title="Domain Progress Overview">
        <div className="space-y-4">
          {domains.map((domain) => {
            const progress = progressLookup.get(domain.domain);
            const value = progress?.completion_percent || 0;
            return (
              <div key={domain.domain} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{domain.domain}</span>
                  <BadgeTag label={`${Math.round(value)}%`} tone={value > 70 ? "success" : "info"} />
                </div>
                <ProgressBar value={value} />
              </div>
            );
          })}
        </div>
      </Card>
    </PageContainer>
  );
}

export default CareerPrepPage;
