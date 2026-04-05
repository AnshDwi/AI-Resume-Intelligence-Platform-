import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";

function CoursesPage() {
  const { uploadedMaterials } = useOutletContext();

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Instructor</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Courses</h2>
      </header>

      <Card>
        {uploadedMaterials.length === 0 && <p className="text-sm text-slate-300">No materials uploaded yet.</p>}
        <div className="grid gap-3 md:grid-cols-2">
          {uploadedMaterials.map((course) => (
            <Card key={course.id} interactive>
              <p className="text-lg font-semibold text-slate-100">{course.title}</p>
              <p className="text-sm text-slate-300">Topic: {course.topic}</p>
              <p className="mt-1 text-xs text-cyan-200">Tag: {course.skillTag || "General"}</p>
              {course.link ? (
                <a href={course.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-violet-200 underline">
                  Open link
                </a>
              ) : null}
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CoursesPage;
