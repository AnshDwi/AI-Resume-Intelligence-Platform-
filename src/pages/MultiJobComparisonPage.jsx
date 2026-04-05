import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../components/Card";
import DataTable from "../components/DataTable";
import BadgeTag from "../components/BadgeTag";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PageContainer from "../components/PageContainer";
import { getMultiJobComparison } from "../services/api";

function MultiJobComparisonPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMultiJobComparison();
        setJobs(response);
      } catch (err) {
        setError(err.message || "Unable to load job comparison.");
        toast.error("Comparison service unavailable.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const bestMatchId = useMemo(() => {
    if (!jobs.length) return null;
    return jobs.reduce((top, item) => (item.match > top.match ? item : top), jobs[0]).id;
  }, [jobs]);

  const columns = [
    { key: "role", title: "Job Role" },
    {
      key: "match",
      title: "Match %",
      render: (row) => <span className="font-semibold text-slate-900">{row.match}%</span>
    },
    {
      key: "missingSkills",
      title: "Missing Skills",
      render: (row) => <BadgeTag label={row.missingSkills} tone="warning" />
    }
  ];

  return (
    <PageContainer>
      <Card title="Multi-Job Comparison Engine" subtitle="Rank target roles and highlight best-fit options.">
        {loading && (
          <div className="space-y-3">
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <DataTable
            columns={columns}
            data={jobs}
            rowClassName={(row) => (row.id === bestMatchId ? "bg-emerald-50" : "hover:bg-slate-50")}
          />
        )}
      </Card>
    </PageContainer>
  );
}

export default MultiJobComparisonPage;
