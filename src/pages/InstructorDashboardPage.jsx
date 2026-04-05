import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";

function InstructorDashboardPage() {
  const { uploadedMaterials } = useOutletContext();
  const cards = [
    { label: "Courses Uploaded", value: uploadedMaterials.length },
    { label: "Students", value: 48 },
    { label: "Progress Stats", value: "82%" }
  ];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Instructor</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Instructor Dashboard</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((item) => (
          <Card key={item.label} interactive>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default InstructorDashboardPage;
