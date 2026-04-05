import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, registerUser } from "../../services/api";

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { label: "Weak", color: "bg-red-500", value: 25 };
  if (score === 2) return { label: "Fair", color: "bg-amber-500", value: 50 };
  if (score === 3) return { label: "Good", color: "bg-sky-500", value: 75 };
  return { label: "Strong", color: "bg-emerald-500", value: 100 };
}

function AuthOverlay({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ full_name: "", email: "", password: "", role: "job_seeker" });

  const strength = useMemo(() => passwordStrength(registerForm.password), [registerForm.password]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (!loginForm.email || !loginForm.password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
    try {
      const response = await loginUser(loginForm);
      onAuthenticated(response.user);
    } catch {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (!registerForm.full_name || !registerForm.email || !registerForm.password) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    try {
      const response = await registerUser(registerForm);
      onAuthenticated(response.user);
    } catch {
      setError("Registration failed. Try another email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-950/85 p-6 shadow-2xl"
      >
        <div className="mb-5 flex rounded-xl bg-white/10 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white/20 text-white shadow" : "text-slate-400"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-white/20 text-white shadow" : "text-slate-400"}`}
          >
            Register
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} onSubmit={submitLogin} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Welcome back</h2>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm"
                placeholder="Email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 pr-11 text-sm"
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-2.5 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <button type="button" className="font-semibold text-brand-600" onClick={() => setMode("register")}>
                  Register
                </button>
              </p>
            </motion.form>
          ) : (
            <motion.form key="register" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} onSubmit={submitRegister} className="space-y-4">
              <h2 className="text-xl font-bold text-white">Create account</h2>
              <input
                type="text"
                value={registerForm.full_name}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, full_name: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm"
                placeholder="Name"
              />
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm"
                placeholder="Email"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 pr-11 text-sm"
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-2.5 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Password strength</span>
                  <span>{strength.label}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className={`h-2 rounded-full ${strength.color}`} style={{ width: `${strength.value}%` }} />
                </div>
              </div>
              <select
                value={registerForm.role}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, role: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2.5 text-sm"
              >
                <option value="job_seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
                <option value="instructor">Instructor</option>
              </select>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <button type="button" className="font-semibold text-brand-600" onClick={() => setMode("login")}>
                  Login
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AuthOverlay;
