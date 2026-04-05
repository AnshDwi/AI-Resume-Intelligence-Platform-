import { ArrowRight, Brain, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Resume Intelligence",
    description: "Extract structured skills, experience, and ATS readiness in seconds.",
    icon: Brain
  },
  {
    title: "Smart Job Matching",
    description: "Get weighted fit scores and actionable gap insights for every role.",
    icon: Sparkles
  },
  {
    title: "Recruiter Analytics",
    description: "Rank candidates faster with AI-assisted matching and filtering.",
    icon: Briefcase
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <header className="mb-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold">AI Talent Intelligence Platform</h1>
          <Link
            to="/app/resume"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Launch App
          </Link>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-2"
        >
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">
              End-to-end hiring intelligence
            </p>
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              AI-powered career growth for job seekers and teams.
            </h2>
            <p className="mt-6 max-w-xl text-slate-300">
              Analyze resumes, uncover skill gaps, match jobs, and generate recruiter-ready hiring insights in one
              modern SaaS workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-slate-300">ATS Score Increase</p>
              <p className="mt-2 text-3xl font-bold">+28%</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-slate-300">Role Match Accuracy</p>
              <p className="mt-2 text-3xl font-bold">92%</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:col-span-2">
              <p className="text-sm text-slate-300">Trusted by recruiters and high-growth teams.</p>
              <p className="mt-2 text-2xl font-semibold">From candidate prep to shortlist decisions.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-white/10 p-2 text-sky-200">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}

export default LandingPage;
