import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import { getAIFeedback, regenerateAIFeedback } from "../services/api";

function AIFeedbackPage() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);

  const fetchFeedback = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAIFeedback();
      setFeedback(response);
    } catch (err) {
      setError(err.message || "Unable to load AI feedback.");
      toast.error("Feedback service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleRegenerate = async () => {
    setRegenLoading(true);
    setError("");
    try {
      const response = await regenerateAIFeedback("resume optimization");
      setFeedback(response);
      toast.success("Suggestions regenerated.");
    } catch (err) {
      setError(err.message || "Could not regenerate suggestions.");
      toast.error("Regeneration failed.");
    } finally {
      setRegenLoading(false);
    }
  };

  const handleEditSuggestion = (index, value) => {
    setFeedback((current) => ({
      ...current,
      bulletSuggestions: current.bulletSuggestions.map((item, idx) => (idx === index ? value : item))
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-52 w-full" />
        <LoadingSkeleton className="h-52 w-full" />
      </div>
    );
  }

  return (
    <PageContainer className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Resume Improvements">
          <ul className="space-y-3">
            {feedback?.improvements.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Editable Bullet Suggestions">
          <div className="space-y-3">
            {feedback?.bulletSuggestions.map((item, index) => (
              <textarea
                key={`${item}-${index}`}
                value={item}
                onChange={(event) => handleEditSuggestion(index, event.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            ))}
          </div>
        </Card>
      </div>

      <Card title="Skill Gap Roadmap Generator">
        <div className="grid gap-3 sm:grid-cols-3">
          {feedback?.roadmap.map((item) => (
            <div key={item.skill} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{item.sequence}. {item.skill}</p>
              <p className="mt-1 text-xs text-slate-500">Priority: {item.priority}</p>
              <p className="text-xs text-slate-500">Estimated Time: {item.timeline}</p>
            </div>
          ))}
        </div>
      </Card>

      <button
        type="button"
        disabled={regenLoading}
        onClick={handleRegenerate}
        className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {regenLoading ? "Regenerating..." : "Regenerate Suggestions"}
      </button>
    </PageContainer>
  );
}

export default AIFeedbackPage;
