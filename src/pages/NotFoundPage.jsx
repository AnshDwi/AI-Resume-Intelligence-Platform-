import { Link } from "react-router-dom";
import Card from "../components/Card";

function NotFoundPage() {
  return (
    <Card title="Page Not Found">
      <p className="text-sm text-slate-600">
        The page you requested does not exist. Return to{" "}
        <Link to="/app/resume" className="font-semibold text-brand-600 hover:text-brand-700">
          Resume
        </Link>
        .
      </p>
    </Card>
  );
}

export default NotFoundPage;
