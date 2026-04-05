import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import PageContainer from "../components/PageContainer";
import { getPracticeTest, submitPracticeTest } from "../services/api";

function PracticeTestPage() {
  const [domain, setDomain] = useState("Frontend Developer");
  const [testType, setTestType] = useState("mcq");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await getPracticeTest(domain, testType);
      setQuestions(response.questions || []);
      setAnswers({});
      toast.success("Test loaded.");
    } catch {
      toast.error("Unable to load test.");
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    try {
      const response = await submitPracticeTest({ domain, test_type: testType, answers });
      setResult(response);
      toast.success("Test submitted.");
    } catch {
      toast.error("Failed to submit test.");
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="Practice & Test Module" subtitle="MCQ and scenario-based assessments with instant feedback.">
        <div className="grid gap-3 md:grid-cols-3">
          <select value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option>Software Developer</option>
            <option>Backend Developer</option>
            <option>Frontend Developer</option>
            <option>DevOps Engineer</option>
            <option>Cybersecurity</option>
          </select>
          <select value={testType} onChange={(event) => setTestType(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option value="mcq">MCQ</option>
            <option value="scenario">Scenario</option>
          </select>
          <button type="button" onClick={loadTest} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
            {loading ? "Loading..." : "Load Test"}
          </button>
        </div>
      </Card>

      {questions.length > 0 && (
        <Card title="Interactive Test Interface">
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {question.question}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(question.options || []).map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button type="button" onClick={submitTest} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
              Submit Test
            </button>
          </div>
        </Card>
      )}

      {result && (
        <Card title="Score & Feedback">
          <p className="text-3xl font-bold text-slate-900">{result.score}%</p>
          <p className="mt-1 text-sm text-slate-600">{result.correct}/{result.total} correct</p>
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{result.feedback}</p>
        </Card>
      )}
    </PageContainer>
  );
}

export default PracticeTestPage;
