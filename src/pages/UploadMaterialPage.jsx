import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../components/Card";

function UploadMaterialPage() {
  const { addUploadedMaterial } = useOutletContext();
  const [form, setForm] = useState({ title: "", topic: "", skillTag: "", link: "", fileName: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title || !form.topic) return;
    addUploadedMaterial(form);
    setForm({ title: "", topic: "", skillTag: "", link: "", fileName: "" });
  };

  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Instructor</p>
        <h2 className="bg-gradient-to-r from-pink-200 via-violet-200 to-sky-200 bg-clip-text text-3xl font-bold text-transparent">Upload Material</h2>
      </header>

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Course title" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input value={form.topic} onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))} placeholder="Topic" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input value={form.skillTag} onChange={(e) => setForm((prev) => ({ ...prev, skillTag: e.target.value }))} placeholder="Skill tag" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input value={form.link} onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))} placeholder="Reference link" className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <input type="file" onChange={(e) => setForm((prev) => ({ ...prev, fileName: e.target.files?.[0]?.name || "" }))} className="rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm" />
          <button type="submit" className="btn-primary-glow">Upload</button>
        </form>
      </Card>
    </div>
  );
}

export default UploadMaterialPage;
