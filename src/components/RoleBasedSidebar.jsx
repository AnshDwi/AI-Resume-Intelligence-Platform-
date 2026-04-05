import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  FileText,
  Home,
  Target,
  UserCheck,
  Users
} from "lucide-react";
import { NavLink } from "react-router-dom";

const baseNavItems = [
  { name: "Resume", path: "/app/resume", icon: FileText },
  { name: "Matching", path: "/app/matching", icon: Target },
  { name: "ATS", path: "/app/ats", icon: BarChart3 },
  { name: "AI Feedback", path: "/app/ai-feedback", icon: Brain },
  { name: "Prep", path: "/app/prep", icon: BookOpen },
  { name: "Interviews", path: "/app/interviews", icon: CalendarDays },
  { name: "Learning", path: "/app/learning", icon: BookOpen },
  { name: "Analytics", path: "/app/analytics", icon: BarChart3 },
  { name: "Landing", path: "/", icon: Home }
];

const recruiterNavItems = [
  { name: "Recruiter", path: "/app/recruiter", icon: UserCheck },
  { name: "Candidates", path: "/app/recruiter/candidates", icon: Users },
  { name: "Shortlisted", path: "/app/recruiter/shortlisted", icon: UserCheck }
];

const instructorNavItems = [
  { name: "Instructor", path: "/app/instructor", icon: UserCheck },
  { name: "Courses", path: "/app/instructor/courses", icon: BookOpen },
  { name: "Upload Material", path: "/app/instructor/upload-material", icon: FileText }
];

function RoleBasedSidebar({ isOpen, onClose, user }) {
  const role = user?.role || "job_seeker";
  const extraItems = role === "recruiter" ? recruiterNavItems : role === "instructor" ? instructorNavItems : [];
  const navItems = [...baseNavItems, ...extraItems];

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-white/25 bg-gradient-to-b from-[#2a2f4a]/86 via-[#2a314f]/80 to-[#263a56]/78 p-4 backdrop-blur-2xl transition duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 px-2">
          <h2 className="bg-gradient-to-r from-indigo-200 via-cyan-200 to-purple-200 bg-clip-text text-sm font-semibold uppercase tracking-[0.2em] text-transparent">
            Navigation
          </h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border border-pink-200/50 bg-gradient-to-r from-pink-300/30 via-violet-300/26 to-sky-300/26 text-white shadow-[0_12px_30px_rgba(244,114,182,0.2)]"
                      : "text-slate-300 hover:bg-white/10 hover:text-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-slate-950/50 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
    </>
  );
}

export default RoleBasedSidebar;
