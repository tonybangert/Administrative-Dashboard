import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

const LOGO = "https://dl.dropboxusercontent.com/scl/fi/jyd8wyhmo29yc6l4hfmi2/Icon_1x1.png?rlkey=tx9xsnkojuzqhmk12nqxskr1h&st=4nhdbpjs";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { greeting: "Good morning", context: "Let's make today count." };
  if (h < 17) return { greeting: "Good afternoon", context: "Deep work hours. Stay locked in." };
  if (h < 21) return { greeting: "Good evening", context: "Wrap it up strong." };
  return { greeting: "Burning the midnight oil", context: "Don't forget to rest." };
}

function getMotivation() {
  const lines = [
    "Build something they can't ignore.",
    "Revenue doesn't wait. Neither do you.",
    "Forward-deployed. Always.",
    "The pipeline is a reflection of your effort.",
    "One more call. One more close.",
    "Ship it. Iterate later.",
    "Clients don't need vendors. They need operators.",
    "Execution is the only strategy that matters.",
    "Your competition is still in meetings about meetings.",
    "FDE is a category. You're defining it.",
  ];
  return lines[new Date().getDate() % lines.length];
}

export default function HeroHeader({ onSignOut }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t); }, []);
  const { greeting, context } = getGreeting();
  const motivation = getMotivation();
  const dateStr = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="relative px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-8 sm:pb-10 overflow-hidden border-b border-border-default"
         style={{ background: "linear-gradient(135deg, #0c1a30 0%, #0f1b2d 40%, #131f33 100%)" }}>
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] animate-gradient-shift"
           style={{ background: "linear-gradient(90deg, transparent, #faa840, #ef4537, #faa840, transparent)", backgroundSize: "200% 100%" }} />
      {/* Ambient glow - amber */}
      <div className="absolute -top-15 -right-10 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(250,168,64,0.06) 0%, transparent 70%)" }} />
      {/* Ambient glow - red */}
      <div className="absolute -bottom-20 left-25 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(239,69,55,0.04) 0%, transparent 70%)" }} />

      <div className="relative flex flex-col sm:flex-row justify-between items-start max-w-[1400px] mx-auto gap-6">
        <div>
          <div className="flex items-center gap-4 mb-5">
            <img src={LOGO} alt="" className="w-11 h-11 rounded-xl" onError={(e) => e.target.style.display = "none"} />
            <div className="text-[13px] font-bold text-brand-amber uppercase tracking-[0.14em]">PerformanceLabs.AI</div>
          </div>
          <h1 className="text-2xl sm:text-[40px] font-extrabold text-text-primary tracking-tight leading-[1.1]">
            {greeting},{" "}
            <span className="bg-gradient-to-br from-brand-amber to-amber-500 bg-clip-text text-transparent">Tony</span>
          </h1>
          <p className="text-lg text-text-secondary mt-2.5 font-[450]">{context}</p>
          <p className="text-[15px] text-text-muted mt-4 italic border-l-2 border-brand-amber pl-3.5 leading-relaxed">"{motivation}"</p>
        </div>
        <div className="sm:text-right flex flex-col items-start sm:items-end gap-3">
          <div className="text-sm text-text-muted">{dateStr}</div>
          <div className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight tabular-nums">{timeStr}</div>
          <div className="flex items-center gap-2 bg-brand-green-dim px-4 py-1.5 rounded-3xl mt-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-glow" />
            <span className="text-[13px] text-brand-green font-semibold">Systems Online</span>
          </div>
          {onSignOut && (
            <button onClick={onSignOut}
                    className="flex items-center gap-1.5 text-xs text-text-muted mt-1 cursor-pointer bg-transparent border-none
                               transition-colors duration-200 hover:text-brand-amber">
              <LogOut size={12} /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
