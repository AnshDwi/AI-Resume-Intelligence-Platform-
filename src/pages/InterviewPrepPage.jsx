import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import { getInterviewQuestions } from "../services/api";

const roles = ["Frontend Engineer", "Full Stack Engineer", "Product Engineer"];

function InterviewPrepPage() {
  const [role, setRole] = useState(roles[0]);
  const [questionSet, setQuestionSet] = useState({ technical: [], behavioral: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    setLoading(true);
    setError("");
    setQuestionSet({ technical: [], behavioral: [] });
    try {
      const response = await getInterviewQuestions(role);
      setQuestionSet(response);
      toast.success("Interview set generated.");
    } catch (err) {
      setError(err.message || "Unable to generate questions.");
      toast.error("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="AI Mock Interview Generator" subtitle="Generate role-specific technical and behavioral questions.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-72"
          >
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={generateQuestions}
            disabled={loading}
            className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && (
        <div className="space-y-3">
          <LoadingSkeleton className="h-14 w-full" />
          <LoadingSkeleton className="h-14 w-full" />
          <LoadingSkeleton className="h-14 w-full" />
        </div>
      )}

      {!loading && (questionSet.technical.length > 0 || questionSet.behavioral.length > 0) && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card title={`${role} Technical`}>
            <ol className="space-y-3">
              {questionSet.technical.map((question) => (
                <li key={question} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {question}
                </li>
              ))}
            </ol>
          </Card>
          <Card title={`${role} Behavioral`}>
            <ol className="space-y-3">
              {questionSet.behavioral.map((question) => (
                <li key={question} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {question}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

export default InterviewPrepPage;
