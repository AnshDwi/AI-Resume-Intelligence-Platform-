import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import PageContainer from "../components/PageContainer";
import ProgressCircle from "../components/ProgressCircle";
import { evaluateMockInterview, generateMockInterviewQuestions } from "../services/api";

function MockInterviewLabPage() {
  const [role, setRole] = useState("Frontend Engineer");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [evaluation, setEvaluation] = useState(null);

  const mergedQuestions = useMemo(() => {
    if (questions.technical || questions.behavioral) {
      return [...(questions.technical || []), ...(questions.behavioral || [])];
    }
    return [];
  }, [questions]);

  const loadQuestions = async () => {
    try {
      const response = await generateMockInterviewQuestions(role);
      setQuestions(response);
      setAnswers(new Array((response.technical?.length || 0) + (response.behavioral?.length || 0)).fill(""));
      setEvaluation(null);
      toast.success("Mock interview generated.");
    } catch {
      toast.error("Failed to generate questions.");
    }
  };

  const submitAnswers = async () => {
    try {
      const response = await evaluateMockInterview({ role, questions: mergedQuestions, answers });
      setEvaluation(response);
      toast.success("Answers evaluated.");
    } catch {
      toast.error("Evaluation failed.");
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="AI Mock Interview System" subtitle="Generate role-based questions and get AI answer feedback.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
            <option>Frontend Engineer</option>
            <option>Backend Engineer</option>
            <option>Software Developer</option>
            <option>DevOps Engineer</option>
            <option>Cybersecurity Analyst</option>
          </select>
          <button type="button" onClick={loadQuestions} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
            Generate Questions
          </button>
        </div>
      </Card>

      {mergedQuestions.length > 0 && (
        <Card title="Answer Panel">
          <div className="space-y-4">
            {mergedQuestions.map((question, index) => (
              <div key={`${question}-${index}`}>
                <p className="mb-2 text-sm font-semibold text-slate-900">{index + 1}. {question}</p>
                <textarea
                  rows={3}
                  value={answers[index] || ""}
                  onChange={(event) =>
                    setAnswers((current) => {
                      const next = [...current];
                      next[index] = event.target.value;
                      return next;
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm"
                  placeholder="Type your answer..."
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={submitAnswers} className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
            Evaluate Answers
          </button>
        </Card>
      )}

      {evaluation && (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="flex items-center justify-center xl:col-span-1">
            <ProgressCircle value={evaluation.overall_score} label="Interview Performance" />
          </Card>
          <Card title="AI Feedback" className="xl:col-span-2">
            <ul className="space-y-2 text-sm text-slate-700">
              {(evaluation.feedback || []).map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 p-3">{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

export default MockInterviewLabPage;
