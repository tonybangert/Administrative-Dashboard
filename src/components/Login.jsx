import { useState, useEffect } from "react";

const LOGO = "https://dl.dropboxusercontent.com/scl/fi/jyd8wyhmo29yc6l4hfmi2/Icon_1x1.png?rlkey=tx9xsnkojuzqhmk12nqxskr1h&st=4nhdbpjs";

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await onSignIn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  useEffect(() => {
    const el = document.querySelector("input[type=email]");
    if (el) setTimeout(() => el.focus(), 100);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(250,168,64,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(239,69,55,0.04) 0%, transparent 70%)" }} />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(ellipse, rgba(52,211,153,0.03) 0%, transparent 70%)" }} />

      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] animate-gradient-shift"
           style={{ background: "linear-gradient(90deg, transparent, #faa840, #ef4537, #faa840, transparent)", backgroundSize: "200% 100%" }} />

      <div className="glass p-6 sm:p-10 w-full max-w-md relative animate-fade-in-up">
        {/* Logo + brand */}
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO} alt="" className="w-14 h-14 rounded-xl mb-4" onError={(e) => e.target.style.display = "none"} />
          <div className="text-xs font-bold text-brand-amber uppercase tracking-[0.14em] mb-2">PerformanceLabs.AI</div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">Command Center</h1>
          <p className="text-sm text-text-muted mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                   className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                              outline-none transition-all duration-200 focus:border-brand-amber focus:shadow-[0_0_0_3px_rgba(250,168,64,0.1)]
                              placeholder:text-text-muted"
                   placeholder="tony@performancelabs.ai" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5 font-medium">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                   className="w-full px-4 py-3 bg-bg-input border border-border-default rounded-xl text-text-primary text-sm
                              outline-none transition-all duration-200 focus:border-brand-amber focus:shadow-[0_0_0_3px_rgba(250,168,64,0.1)]
                              placeholder:text-text-muted"
                   placeholder="••••••••" />
          </div>

          {error && (
            <div className="text-sm text-brand-red bg-brand-red-dim px-4 py-2.5 rounded-lg animate-fade-in-up">{error}</div>
          )}

          <button type="submit" disabled={loading}
                  className="w-full py-3.5 mt-2 bg-brand-amber text-black font-bold rounded-xl text-sm
                             transition-all duration-200 hover:shadow-[0_4px_20px_rgba(250,168,64,0.3)] hover:brightness-110
                             disabled:opacity-50 cursor-pointer active:scale-[0.98]">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 text-[11px] text-text-muted tracking-wide uppercase">
          Execution is the only strategy that matters.
        </div>
      </div>
    </div>
  );
}
