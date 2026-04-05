import { Moon, Sun, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ onOpenSidebar, user, authenticated, onLogout, darkMode, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/20 bg-gradient-to-r from-[#2a233f]/72 via-[#262c52]/70 to-[#23314d]/70 backdrop-blur-2xl dark:border-white/20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-slate-200 transition hover:bg-white/10 lg:hidden"
            aria-label="Open sidebar"
          >
            <span className="text-lg">☰</span>
          </button>
          <Link to="/app/resume" className="bg-gradient-to-r from-indigo-200 via-cyan-200 to-purple-200 bg-clip-text text-lg font-semibold text-transparent">
            AI Talent Intelligence Platform
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-slate-100 transition hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {authenticated && user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-100">{user.full_name}</p>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{user.role}</p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10"
                aria-label="User profile"
              >
                <UserCircle2 size={22} />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Guest Mode</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
