import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import { analyzeResume } from "../services/api";

function UploadResumePage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    setError("");
    toast.success("Resume ready for analysis.");
  };

  const onAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await analyzeResume(file);
      setResult(response);
      toast.success("Resume analyzed successfully.");
    } catch (err) {
      setError(err.message || "Unable to analyze resume.");
      toast.error("Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <Card title="Upload Resume" subtitle="Upload your latest resume to run NLP parsing and ATS simulation.">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-slate-300 hover:border-brand-400 hover:bg-slate-50"
          }`}
        >
          <UploadCloud className="mx-auto mb-3 text-slate-500" size={30} />
          <p className="text-sm text-slate-700">Drag and drop a file here, or click to browse</p>
          <p className="mt-1 text-xs text-slate-500">Accepted format: PDF</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
      </Card>

      {file && (
        <Card title="File Preview">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-white shadow-sm">
              <FileText className="text-brand-600" size={24} />
            </div>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">AI parser will extract skills, experience, education, and projects.</p>
            </div>
          </div>
        </Card>
      )}

      <button
        type="button"
        onClick={onAnalyze}
        disabled={loading}
        className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {loading && (
        <div className="space-y-3">
          <LoadingSkeleton className="h-5 w-56" />
          <LoadingSkeleton className="h-20 w-full" />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && !loading && (
        <Card title="Analysis Output">
          <p className="text-sm text-slate-600">{result.message}</p>
          <p className="mt-1 text-sm text-slate-600">File: {result.fileName}</p>
          <p className="mt-3 text-sm font-semibold text-slate-900">ATS Score: {result.score}%</p>
        </Card>
      )}
    </PageContainer>
  );
}

export default UploadResumePage;
