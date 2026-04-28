import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   THEME & CONSTANTS
═══════════════════════════════════════════════════════ */
const T = {
  bg: "#0a0a0a",
  card: "#141414",
  card2: "#1a1a1a",
  border: "rgba(255,255,255,0.07)",
  green: "#22c55e",
  greenDim: "#16a34a",
  greenGlow: "rgba(34,197,94,0.25)",
  yellow: "#facc15",
  yellowDim: "#ca8a04",
  yellowGlow: "rgba(250,204,21,0.22)",
  white: "#f8fafc",
  gray1: "#94a3b8",
  gray2: "#475569",
  gray3: "#1e293b",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#a78bfa",
  orange: "#fb923c",
};

const METRICS = [
  { label: "Grain Uniformity", val: 91, color: T.green },
  { label: "Moisture Content", val: 87, color: T.blue },
  { label: "Foreign Matter", val: 96, color: T.green },
  { label: "Color Consistency", val: 84, color: T.yellow },
  { label: "Surface Defects", val: 89, color: T.green },
  { label: "Aroma Index", val: 78, color: T.purple },
  { label: "Mold Presence", val: 98, color: T.green },
  { label: "Protein Content", val: 82, color: T.orange },
  { label: "Breakage %", val: 93, color: T.green },
  { label: "Weight/Volume", val: 88, color: T.blue },
];

const RECENT_SCANS = [
  { id: 1, crop: "Wheat", grade: "GOLD", score: 91, date: "2h ago", emoji: "🌾", color: T.yellow },
  { id: 2, crop: "Rice", grade: "SILVER", score: 78, date: "1d ago", emoji: "🍚", color: T.gray1 },
  { id: 3, crop: "Cotton", grade: "GOLD", score: 88, date: "2d ago", emoji: "☁️", color: T.yellow },
  { id: 4, crop: "Tomato", grade: "SILVER", score: 74, date: "3d ago", emoji: "🍅", color: T.gray1 },
  { id: 5, crop: "Soybean", grade: "GOLD", score: 93, date: "5d ago", emoji: "🫘", color: T.yellow },
];

const COMMUNITY_POSTS = [
  { id: 1, user: "Ramesh Kumar", location: "Vidarbha, MH", avatar: "👨🌾", time: "2h ago", content: "My cotton crop just got GOLD grade on AgriVerify! Got ₹6,800/quintal directly from buyer in Nagpur — skipped the arhatiya for the first time in 20 years. 🙏", image: "☁️", likes: 247, comments: 38, lang: "Hindi", crop: "Cotton", grade: "GOLD" },
  { id: 2, user: "Sunita Devi", location: "Muzaffarpur, Bihar", avatar: "👩🌾", time: "5h ago", content: "Please help! My lychee crop is showing black spots on the outer skin but the inside looks fine. Is this fungal or pest damage? Posting photos for advice.", image: "🌿", likes: 89, comments: 56, lang: "Bhojpuri", crop: null, grade: null },
  { id: 3, user: "Kiran Patil", location: "Solapur, MH", avatar: "🧑🌾", time: "1d ago", content: "AgriVerify AI ne meri gehun ki quality ko Gold grade diya aur Pune mandi mein ₹6,450 ka rate mila. Blockchain certificate se buyer ne seedha deal ki. Kisi agent ki zaroorat nahi!", image: "🌾", likes: 412, comments: 71, lang: "Marathi", crop: "Wheat", grade: "GOLD" },
  { id: 4, user: "Arjun Singh", location: "Alwar, Rajasthan", avatar: "👨🌾", time: "2d ago", content: "Mustard crop ready for harvest next week. Anyone got recent price data from Jaipur mandi? Thinking of waiting for better rates.", image: "🌻", likes: 134, comments: 29, lang: "Rajasthani", crop: "Mustard", grade: null },
];

const CHAT_INIT = [
  { id: 1, from: "bot", text: "Namaste! 🌾 I'm AgriBot, your AI farming assistant. I can help with crop quality, market prices, government schemes, or technical support. How can I help you today?", time: "Now" },
];

/* ═══════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════ */

function Pill({ children, color = T.green, style = {} }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", background: color + "20", border: `1px solid ${color}40`, color, ...style }}>
      {children}
    </span>
  );
}

function IconBtn({ icon, onPress, color = T.gray1, size = 18, bg = "transparent" }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button onMouseDown={() => setPressed(true)} onMouseUp={() => { setPressed(false); onPress && onPress(); }} onMouseLeave={() => setPressed(false)}
      style={{ background: bg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: size + 16, height: size + 16, borderRadius: 99, transform: pressed ? "scale(0.88)" : "scale(1)", transition: "transform 0.15s" }}>
      <span style={{ fontSize: size, color }}>{icon}</span>
    </button>
  );
}

function RadialProgress({ value, size = 64, color = T.green, label, sublabel }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: size > 56 ? 14 : 11, fontWeight: 800, color: T.white }}>{value}%</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 9, color: T.gray1, textAlign: "center", lineHeight: 1.3, maxWidth: size }}>{label}</span>}
    </div>
  );
}

function LinearBar({ value, color = T.green, height = 4 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}80`, transition: "width 1s ease" }} />
    </div>
  );
}

function QRCode({ size = 80 }) {
  const cells = 7;
  const cell = size / cells;
  const pattern = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];
  return (
    <div style={{ width: size, height: size, background: "#fff", padding: 4, borderRadius: 8, display: "grid", gridTemplateColumns: `repeat(${cells},${cell - 1.1}px)`, gap: 1, boxShadow: `0 0 20px ${T.greenGlow}` }}>
      {pattern.flat().map((v, i) => (
        <div key={i} style={{ width: cell - 1.1, height: cell - 1.1, background: v ? "#0a0a0a" : "#fff", borderRadius: 1 }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCREEN: DASHBOARD
═══════════════════════════════════════════════════════ */
function Dashboard({ onScan }) {
  const [activeFilter, setActiveFilter] = useState("All");
  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }} className="hide-scrollbar">
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 12, color: T.gray1, marginBottom: 2 }}>Good Morning 🌤️</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>Ramesh Kumar</h1>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 0 20px ${T.greenGlow}` }}>👨🌾</div>
          <div style={{ position: "absolute", top: -2, right: -2, width: 12, height: 12, borderRadius: 99, background: T.yellow, border: "2px solid #0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 7, color: "#000", fontWeight: 800 }}>3</span>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div style={{ margin: "16px 20px", borderRadius: 20, background: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.25)", padding: "18px 20px", display: "flex", gap: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.2),transparent 70%)", filter: "blur(20px)" }} />
        {[["2.4T", "Total Verified", T.green], ["86%", "Avg Quality Score", T.yellow], ["₹6.2L", "Total Earned", T.blue]].map(([v, l, c], i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: c, fontFamily: "var(--font-display)" }}>{v}</div>
            <div style={{ fontSize: 10, color: T.gray1, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Quick Scan CTA */}
      <div onClick={onScan} style={{ margin: "0 20px 16px", borderRadius: 18, background: "linear-gradient(135deg,#22c55e,#16a34a)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", boxShadow: `0 8px 32px ${T.greenGlow}, 0 0 0 1px rgba(34,197,94,0.3)`, active: { transform: "scale(0.98)" } }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Scan New Crop</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>AI + Blockchain verification</div>
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📷</div>
      </div>

      {/* Recent Scans */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: T.white }}>Recent Scans</span>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>See All</span>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }} className="hide-scrollbar">
          {RECENT_SCANS.map(s => (
            <div key={s.id} style={{ flexShrink: 0, width: 110, borderRadius: 16, background: T.card, border: `1px solid ${T.border}`, padding: "12px 10px", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 8px" }}>{s.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.white, textAlign: "center" }}>{s.crop}</div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
                <Pill color={s.color}>{s.grade}</Pill>
              </div>
              <div style={{ fontSize: 10, color: T.gray2, textAlign: "center", marginTop: 5 }}>{s.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Certificates */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: T.white }}>Saved Certificates</span>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>See All</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {RECENT_SCANS.slice(0, 2).map(s => (
            <div key={s.id} style={{ borderRadius: 16, background: T.card, border: `1px solid ${T.border}`, padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <QRCode size={72} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.white }}>{s.crop}</div>
                <Pill color={s.color} style={{ marginTop: 4 }}>{s.grade} · {s.score}%</Pill>
              </div>
              <div style={{ fontSize: 10, color: T.green, fontWeight: 600 }}>⛓️ Polygon Verified</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Prices */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: T.white }}>Live Mandi Prices</span>
          <Pill color={T.green}><span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, display: "inline-block", animation: "blinkDot 1.5s infinite" }} /> LIVE</Pill>
        </div>
        {[["Wheat 🌾", "₹6,450", "+2.3%", T.green], ["Rice 🍚", "₹4,820", "-0.8%", T.red], ["Cotton ☁️", "₹7,100", "+1.1%", T.green]].map(([c, p, ch, col]) => (
          <div key={c} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: 14, background: T.card, border: `1px solid ${T.border}`, marginBottom: 8 }}>
            <span style={{ fontSize: 16, marginRight: 10 }}>{c.split(" ")[1]}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.white }}>{c.split(" ")[0]}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: T.white, marginRight: 8 }}>{p}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{ch}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCREEN: ANALYSIS FLOW
═══════════════════════════════════════════════════════ */
function AnalysisFlow({ onClose }) {
  const [step, setStep] = useState(0); // 0=intro, 1=top, 2=side, 3=bottom, 4=processing, 5=result
  const [capturedViews, setCapturedViews] = useState([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [voiceGender, setVoiceGender] = useState("male");
  const [showQR, setShowQR] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const shutterRef = useRef(null);

  const CAPTURE_STEPS = [
    { label: "Top View", instruction: "Hold camera directly above the crop. Keep it steady.", icon: "⬆️", color: T.green },
    { label: "Side View", instruction: "Tilt 45° to capture the side profile clearly.", icon: "➡️", color: T.yellow },
    { label: "Bottom View", instruction: "Flip the sample. Capture the base clearly.", icon: "⬇️", color: T.blue },
  ];

  const PROCESSING_STEPS = [
    "Analyzing Texture & Surface...",
    "Checking Moisture Levels...",
    "Detecting Foreign Matter...",
    "Running Color Analysis...",
    "Measuring Grain Uniformity...",
    "Verifying on Polygon Ledger...",
    "Generating Quality Report...",
  ];

  const LANGS = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Punjabi", "Bengali", "Gujarati"];

  const handleCapture = () => {
    // Shutter flash
    if (shutterRef.current) {
      shutterRef.current.style.opacity = "1";
      setTimeout(() => { if (shutterRef.current) shutterRef.current.style.opacity = "0"; }, 200);
    }
    const newViews = [...capturedViews, step - 1];
    setCapturedViews(newViews);
    if (step < 3) setStep(step + 1);
    else {
      setStep(4);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setProcessingStep(i);
        if (i >= PROCESSING_STEPS.length) { clearInterval(iv); setTimeout(() => { setStep(5); setShowQR(true); }, 600); }
      }, 700);
    }
  };

  // ── Intro ──
  if (step === 0) return (
    <div style={{ position: "absolute", inset: 0, background: T.bg, display: "flex", flexDirection: "column", zIndex: 50, animation: "slideUp 0.35s ease" }}>
      <div style={{ padding: "56px 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.gray1, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 32, padding: 0 }}>← Back</button>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 24 }}>
          <div style={{ width: 100, height: 100, borderRadius: 28, background: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, boxShadow: `0 0 40px ${T.greenGlow}` }}>🌾</div>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: T.white, marginBottom: 10, fontFamily: "var(--font-display)" }}>Crop Analysis</h2>
            <p style={{ fontSize: 14, color: T.gray1, lineHeight: 1.6, maxWidth: 280 }}>We'll capture 3 angles of your crop for the most accurate AI grade. Takes about 60 seconds.</p>
          </div>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
            {CAPTURE_STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: T.card, border: `1px solid ${T.border}` }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: s.color + "20", border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>Step {i + 1}: {s.label}</div>
                  <div style={{ fontSize: 11, color: T.gray1 }}>{s.instruction}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ width: "100%", padding: "0 0 20px" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: T.gray1, marginBottom: 8, textAlign: "left" }}>Result Language</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {LANGS.map(l => (
                  <button key={l} onClick={() => setSelectedLang(l)} style={{ padding: "6px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: selectedLang === l ? T.green : T.card, color: selectedLang === l ? "#000" : T.gray1, border: `1px solid ${selectedLang === l ? T.green : T.border}`, cursor: "pointer", transition: "all .2s" }}>{l}</button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(1)} style={{ width: "100%", padding: "16px", borderRadius: 16, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 800, boxShadow: `0 8px 32px ${T.greenGlow}` }}>
              Start Analysis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Camera View ──
  if (step >= 1 && step <= 3) {
    const cs = CAPTURE_STEPS[step - 1];
    return (
      <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", zIndex: 50, animation: "slideUp 0.3s ease" }}>
        {/* Shutter flash */}
        <div ref={shutterRef} style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 99, opacity: 0, transition: "opacity 0.1s", pointerEvents: "none" }} />

        {/* Camera viewfinder */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#0a1a0f,#050d08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 80, opacity: 0.3 }}>{step === 1 ? "⬆️" : step === 2 ? "➡️" : "⬇️"}</div>
          </div>
          {/* Crop frame */}
          <div style={{ position: "absolute", inset: "15%", border: `2px solid ${cs.color}`, borderRadius: 20, boxShadow: `0 0 0 9999px rgba(0,0,0,0.55), inset 0 0 30px ${cs.color}20` }}>
            {/* Corner marks */}
            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([t, l], i) => (
              <div key={i} style={{ position: "absolute", top: t ? "auto" : -2, bottom: t ? -2 : "auto", left: l ? "auto" : -2, right: l ? -2 : "auto", width: 20, height: 20, borderTop: t ? "none" : `3px solid ${cs.color}`, borderBottom: t ? `3px solid ${cs.color}` : "none", borderLeft: l ? "none" : `3px solid ${cs.color}`, borderRight: l ? `3px solid ${cs.color}` : "none" }} />
            ))}
            {/* Scan line */}
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${cs.color},transparent)`, boxShadow: `0 0 12px ${cs.color}`, animation: "scanLine 2s ease-in-out infinite", top: 0 }} />
          </div>
          {/* Step indicator */}
          <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ width: n < step ? 28 : n === step ? 28 : 8, height: 8, borderRadius: 99, background: n < step ? T.green : n === step ? cs.color : "rgba(255,255,255,0.2)", transition: "all 0.3s", boxShadow: n === step ? `0 0 8px ${cs.color}` : "none" }} />
            ))}
          </div>
          {/* Instruction */}
          <div style={{ position: "absolute", top: 54, left: 20, right: 20, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 99, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${cs.color}40` }}>
              <span style={{ fontSize: 14 }}>{cs.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Step {step}: {cs.label}</span>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 30, left: 20, right: 20, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>{cs.instruction}</p>
          </div>
        </div>
        {/* Shutter UI */}
        <div style={{ padding: "16px 30px 40px", background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onClose} style={{ width: 48, height: 48, borderRadius: 99, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", fontSize: 18 }}>✕</button>
          <button onClick={handleCapture} style={{ width: 76, height: 76, borderRadius: 99, background: "#fff", border: `4px solid ${cs.color}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${cs.color}80`, transition: "transform .15s", position: "relative" }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{ width: 60, height: 60, borderRadius: 99, background: "#fff", border: `3px solid #ccc` }} />
          </button>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            {capturedViews.length > 0 ? CAPTURE_STEPS[capturedViews[capturedViews.length - 1]].icon : "📷"}
          </div>
        </div>
      </div>
    );
  }

  // ── Processing ──
  if (step === 4) return (
    <div style={{ position: "absolute", inset: 0, background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 30, animation: "fadeIn 0.4s ease" }}>
      <div style={{ position: "relative", width: 160, height: 160, marginBottom: 32 }}>
        {[1, 2, 3].map(r => (
          <div key={r} style={{ position: "absolute", inset: r * 16, borderRadius: "50%", border: `1.5px solid rgba(34,197,94,${0.5 - r * 0.12})`, animation: `pulse ${1.2 + r * 0.3}s ease-in-out infinite alternate` }} />
        ))}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,rgba(34,197,94,0.25),rgba(34,197,94,0.05))", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🔬</div>
        </div>
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: T.white, marginBottom: 8, fontFamily: "var(--font-display)" }}>Analyzing Crop</h2>
      <div style={{ height: 30, marginBottom: 24, overflow: "hidden" }}>
        {PROCESSING_STEPS.map((s, i) => (
          <div key={i} style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(-${processingStep * 30}px)`, transition: "transform 0.4s ease", opacity: i === processingStep - 1 ? 1 : 0.3 }}>
            <p style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>⚡ {s}</p>
          </div>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 280 }}>
        <LinearBar value={(processingStep / PROCESSING_STEPS.length) * 100} height={6} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: T.gray2 }}>Processing...</span>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>{Math.round((processingStep / PROCESSING_STEPS.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );

  // ── Result Screen ──
  if (step === 5) return (
    <div style={{ position: "absolute", inset: 0, background: T.bg, overflowY: "auto", zIndex: 50, animation: "slideUp 0.4s ease", paddingBottom: 40 }} className="hide-scrollbar">
      {/* Header */}
      <div style={{ padding: "56px 20px 16px", background: "linear-gradient(180deg,rgba(34,197,94,0.08),transparent)" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.gray1, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>✕ Close</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", marginBottom: 12 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: "blinkDot 1.5s infinite" }} />
            <span style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>Verified on Polygon · Block #19847532</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: T.white, fontFamily: "var(--font-display)", marginBottom: 4 }}>Wheat — GOLD</h2>
          <p style={{ fontSize: 13, color: T.gray1 }}>Overall Quality Score: <span style={{ color: T.yellow, fontWeight: 700 }}>88%</span></p>
        </div>
        {/* Big score ring */}
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <RadialProgress value={88} size={110} color={T.yellow} />
        </div>
        {/* Grade badge */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <div style={{ padding: "10px 24px", borderRadius: 14, background: "linear-gradient(135deg,rgba(250,204,21,0.2),rgba(250,204,21,0.05))", border: "2px solid rgba(250,204,21,0.4)", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.gray1, marginBottom: 2 }}>AGMARK GRADE</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.yellow }}>🏅 GOLD</div>
          </div>
          <div style={{ padding: "10px 24px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.gray1, marginBottom: 2 }}>MARKET PRICE</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.green }}>₹6,450</div>
          </div>
        </div>
      </div>

      {/* Voice Results */}
      <div style={{ margin: "16px 20px", padding: "14px 16px", borderRadius: 16, background: T.card, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>🔊 Voice Results</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["male", "female"].map(g => (
              <button key={g} onClick={() => setVoiceGender(g)} style={{ padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: voiceGender === g ? T.green : T.card2, color: voiceGender === g ? "#000" : T.gray1, border: `1px solid ${voiceGender === g ? T.green : T.border}`, cursor: "pointer" }}>{g === "male" ? "👨" : "👩"} {g}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setVoicePlaying(!voicePlaying)} style={{ width: 46, height: 46, borderRadius: 14, background: voicePlaying ? T.green : "rgba(34,197,94,0.15)", border: `1px solid ${voicePlaying ? T.green : "rgba(34,197,94,0.3)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "all .2s" }}>
            {voicePlaying ? "⏸️" : "▶️"}
          </button>
          <div style={{ flex: 1 }}>
            {voicePlaying ? (
              <div style={{ display: "flex", gap: 3, height: 28, alignItems: "center" }}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 99, background: T.green, animation: `waveBar ${0.4 + (i % 5) * 0.1}s ease-in-out infinite alternate`, height: `${20 + Math.sin(i) * 16}px`, opacity: 0.7 + (i % 3) * 0.1 }} />
                ))}
              </div>
            ) : (
              <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ width: "35%", height: "100%", background: T.green, borderRadius: 99 }} />
              </div>
            )}
            <div style={{ fontSize: 10, color: T.gray2, marginTop: 4 }}>{selectedLang} · {voiceGender} · 0:18</div>
          </div>
        </div>
      </div>

      {/* 10 Quality Metrics */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.white, marginBottom: 14 }}>Quality Metrics (10/10)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ padding: "12px 14px", borderRadius: 14, background: T.card, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: T.gray1, fontWeight: 600, letterSpacing: "0.02em" }}>{m.label}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: m.color }}>{m.val}%</span>
              </div>
              <LinearBar value={m.val} color={m.color} height={3} />
            </div>
          ))}
        </div>
      </div>

      {/* QR Certificate */}
      <div style={{ margin: "0 20px 16px", padding: "20px", borderRadius: 18, background: T.card, border: `1px solid rgba(34,197,94,0.25)`, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ animation: showQR ? "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none", opacity: showQR ? 1 : 0 }}>
          <QRCode size={88} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.white, marginBottom: 4 }}>Blockchain Certificate</div>
          <div style={{ fontSize: 11, color: T.gray1, marginBottom: 8, lineHeight: 1.5 }}>Scan QR to verify on Polygon. Immutable record tied to this crop batch.</div>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: T.green, background: "rgba(34,197,94,0.1)", padding: "4px 8px", borderRadius: 6 }}>0x7E3A...9F2C</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button style={{ padding: "14px", borderRadius: 16, background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 800, boxShadow: `0 8px 24px ${T.greenGlow}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          📥 Download PDF Certificate
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ flex: 1, padding: "13px", borderRadius: 14, background: "rgba(250,204,21,0.12)", color: T.yellow, border: "1px solid rgba(250,204,21,0.3)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            ⛓️ Mint NFT
          </button>
          <button onClick={() => { setStep(0); setCapturedViews([]); setProcessingStep(0); }} style={{ flex: 1, padding: "13px", borderRadius: 14, background: T.card, color: T.gray1, border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            🔄 Re-upload
          </button>
        </div>
        <button style={{ padding: "13px", borderRadius: 14, background: T.card, color: T.blue, border: "1px solid rgba(96,165,250,0.25)", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
          📤 Share to Community
        </button>
      </div>
    </div>
  );

  return null;
}

/* ═══════════════════════════════════════════════════════
   SCREEN: COMMUNITY
═══════════════════════════════════════════════════════ */
function Community() {
  const [translated, setTranslated] = useState({});
  const [liked, setLiked] = useState({});
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Success", "Advice", "Prices", "Weather"];

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }} className="hide-scrollbar">
      <div style={{ padding: "20px 20px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.white, fontFamily: "var(--font-display)", marginBottom: 2 }}>AgriSocial</h1>
        <p style={{ fontSize: 12, color: T.gray1, marginBottom: 16 }}>Connect with farmers across India</p>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 13, background: T.card, border: `1px solid ${T.border}`, marginBottom: 14 }}>
          <span style={{ fontSize: 15, color: T.gray2 }}>🔍</span>
          <span style={{ fontSize: 13, color: T.gray2 }}>Search posts, crops, locations...</span>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 8 }} className="hide-scrollbar">
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: activeFilter === f ? T.green : T.card, color: activeFilter === f ? "#000" : T.gray1, border: `1px solid ${activeFilter === f ? T.green : T.border}`, cursor: "pointer", transition: "all .2s" }}>{f}</button>
          ))}
        </div>
      </div>

      {COMMUNITY_POSTS.map(post => (
        <div key={post.id} style={{ margin: "0 0 4px", borderTop: `1px solid ${T.border}` }}>
          {/* Post header */}
          <div style={{ padding: "14px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "linear-gradient(135deg,rgba(34,197,94,0.2),rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{post.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{post.user}</span>
                {post.grade && <Pill color={post.grade === "GOLD" ? T.yellow : T.gray1}>{post.grade}</Pill>}
              </div>
              <div style={{ fontSize: 11, color: T.gray2 }}>📍 {post.location} · {post.time}</div>
            </div>
            <button style={{ padding: "5px 12px", borderRadius: 99, background: T.card, border: `1px solid ${T.border}`, color: T.gray1, fontSize: 11, cursor: "pointer" }}>•••</button>
          </div>

          {/* Post content */}
          <div style={{ padding: "10px 20px" }}>
            <p style={{ fontSize: 13, color: T.white, lineHeight: 1.6, marginBottom: 10 }}>
              {translated[post.id] ? `[Translated to English] ${post.content.slice(0, 80)}...` : post.content}
            </p>
            {/* Image placeholder */}
            <div style={{ height: 180, borderRadius: 16, background: `linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.03))`, border: `1px solid rgba(34,197,94,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, marginBottom: 12 }}>{post.image}</div>
          </div>

          {/* Actions */}
          <div style={{ padding: "0 16px 14px", display: "flex", alignItems: "center", gap: 4 }}>
            <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 99, background: liked[post.id] ? "rgba(248,113,113,0.12)" : T.card, border: `1px solid ${liked[post.id] ? "rgba(248,113,113,0.3)" : T.border}`, cursor: "pointer", transition: "all .2s" }}>
              <span style={{ fontSize: 14 }}>{liked[post.id] ? "❤️" : "🤍"}</span>
              <span style={{ fontSize: 12, color: liked[post.id] ? T.red : T.gray1, fontWeight: 600 }}>{post.likes + (liked[post.id] ? 1 : 0)}</span>
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 99, background: T.card, border: `1px solid ${T.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>💬</span>
              <span style={{ fontSize: 12, color: T.gray1, fontWeight: 600 }}>{post.comments}</span>
            </button>
            <button onClick={() => setTranslated(t => ({ ...t, [post.id]: !t[post.id] }))} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 99, background: translated[post.id] ? "rgba(96,165,250,0.12)" : T.card, border: `1px solid ${translated[post.id] ? "rgba(96,165,250,0.3)" : T.border}`, cursor: "pointer", transition: "all .2s" }}>
              <span style={{ fontSize: 14 }}>🌐</span>
              <span style={{ fontSize: 11, color: translated[post.id] ? T.blue : T.gray1, fontWeight: 600 }}>{translated[post.id] ? "Original" : "Translate"}</span>
            </button>
            <button style={{ marginLeft: "auto", padding: "7px 12px", borderRadius: 99, background: T.card, border: `1px solid ${T.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 14 }}>📤</span>
            </button>
          </div>
        </div>
      ))}

      {/* Compose FAB */}
      <div style={{ position: "fixed", bottom: 90, right: 20, width: 50, height: 50, borderRadius: 15, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: `0 8px 24px ${T.greenGlow}`, cursor: "pointer", zIndex: 30 }}>✏️</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCREEN: SUPPORT (AI CHAT)
═══════════════════════════════════════════════════════ */
function Support() {
  const [messages, setMessages] = useState(CHAT_INIT);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showExpertCard, setShowExpertCard] = useState(false);
  const [callPressed, setCallPressed] = useState(false);
  const msgEndRef = useRef(null);

  const ESCALATION_TRIGGERS = ["fraud", "serious fraud", "technical failure", "not working", "human", "real person", "help me please", "urgent"];

  const BOT_RESPONSES = {
    default: "I understand your concern. Let me help you with that. Could you provide more details about the issue you're facing?",
    fraud: "I'm really sorry to hear about this. This sounds like it could be a serious matter that needs immediate attention from our expert team.",
    moisture: "Based on our spectral analysis algorithm, moisture content is measured using near-infrared reflectance patterns in your crop images. Values between 10-14% are optimal for wheat.",
    price: "Current wheat prices: Pune ₹6,450/q, Nagpur ₹6,520/q, Nashik ₹6,380/q. I recommend checking Nagpur for best rates today.",
    grade: "Our AI uses ResNet-50 fine-tuned on 500,000+ Indian crop images. The model analyzes grain uniformity, moisture, color consistency, foreign matter, and 6 other parameters.",
  };

  const detectEscalation = (text) => ESCALATION_TRIGGERS.some(t => text.toLowerCase().includes(t));

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: messages.length + 1, from: "user", text: input, time: "Now" };
    setMessages(m => [...m, userMsg]);
    const inputLower = input.toLowerCase();
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const isEscalation = detectEscalation(inputLower);
      let reply = BOT_RESPONSES.default;
      if (inputLower.includes("moisture")) reply = BOT_RESPONSES.moisture;
      else if (inputLower.includes("price") || inputLower.includes("rate")) reply = BOT_RESPONSES.price;
      else if (inputLower.includes("grade") || inputLower.includes("quality")) reply = BOT_RESPONSES.grade;
      else if (isEscalation) reply = BOT_RESPONSES.fraud;

      setMessages(m => [...m, { id: m.length + 1, from: "bot", text: reply, time: "Now" }]);
      if (isEscalation) setShowExpertCard(true);
    }, 1200);
  };

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, showExpertCard]);

  const QUICK_ACTIONS = ["Check my grade", "Market prices", "How does it work?", "Talk to human"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,rgba(34,197,94,0.25),rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.white }}>AgriBot AI</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "blinkDot 2s infinite" }} />
              <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>Online · Powered by Bhashini</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <div style={{ padding: "5px 10px", borderRadius: 99, background: T.card, border: `1px solid ${T.border}`, fontSize: 11, color: T.gray1 }}>🌐 EN</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }} className="hide-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            {msg.from === "bot" && (
              <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🤖</div>
            )}
            <div style={{ maxWidth: "72%", padding: "11px 14px", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.from === "user" ? "linear-gradient(135deg,#22c55e,#16a34a)" : T.card, border: msg.from === "bot" ? `1px solid ${T.border}` : "none", boxShadow: msg.from === "user" ? `0 4px 16px ${T.greenGlow}` : "none" }}>
              <p style={{ fontSize: 13, color: msg.from === "user" ? "#fff" : T.white, lineHeight: 1.55 }}>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: T.card, border: `1px solid ${T.border}`, display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* Expert Escalation Card */}
        {showExpertCard && (
          <div style={{ margin: "8px 0 10px", padding: "16px", borderRadius: 18, background: "linear-gradient(135deg,rgba(248,113,113,0.1),rgba(248,113,113,0.04))", border: "1px solid rgba(248,113,113,0.3)", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 18 }}>🚨</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.white }}>Talk to an Expert</div>
                <div style={{ fontSize: 11, color: T.gray1 }}>Our team is available Mon–Sat, 9 AM – 6 PM</div>
              </div>
            </div>
            {[{ icon: "📞", label: "Aditya Singh (Founder)", value: "+91 9674951947" }, { icon: "📞", label: "Support Team", value: "+91 9748124930" }, { icon: "📧", label: "Email", value: "adityasinghvoid0009@gmail.com" }].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `1px solid rgba(255,255,255,0.05)` : "none" }}>
                <span style={{ fontSize: 15 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: T.gray2 }}>{c.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{c.value}</div>
                </div>
              </div>
            ))}
            <button onClick={() => setCallPressed(true)} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 13, background: callPressed ? T.greenDim : T.red, color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .2s" }}>
              {callPressed ? "✓ Initiating Call..." : "📞 Call Now"}
            </button>
          </div>
        )}
        <div ref={msgEndRef} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "10px 16px 6px", display: "flex", gap: 8, overflowX: "auto" }} className="hide-scrollbar">
        {QUICK_ACTIONS.map(a => (
          <button key={a} onClick={() => { setInput(a); }} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: T.card, color: T.gray1, border: `1px solid ${T.border}`, cursor: "pointer", whiteSpace: "nowrap" }}>{a}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "8px 16px 32px", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 14px", borderRadius: 16, background: T.card, border: `1px solid ${T.border}`, gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type in any language..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: T.white, fontFamily: "inherit" }} />
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🎙️</button>
        </div>
        <button onClick={handleSend} style={{ width: 46, height: 46, borderRadius: 14, background: input.trim() ? "linear-gradient(135deg,#22c55e,#16a34a)" : T.card2, border: `1px solid ${input.trim() ? T.green : T.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, transition: "all .2s", flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCREEN: PROFILE
═══════════════════════════════════════════════════════ */
function Profile() {
  const [lang, setLang] = useState("English");
  const LANGS = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Punjabi"];

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }} className="hide-scrollbar">
      {/* Hero */}
      <div style={{ padding: "30px 20px 20px", background: "linear-gradient(180deg,rgba(34,197,94,0.1),transparent)", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,rgba(34,197,94,0.3),rgba(34,197,94,0.08))", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 12px", boxShadow: `0 0 30px ${T.greenGlow}` }}>👨🌾</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T.white, fontFamily: "var(--font-display)" }}>Ramesh Kumar</h2>
        <p style={{ fontSize: 12, color: T.gray1, marginTop: 2 }}>📍 Vidarbha, Maharashtra · Farmer since 1998</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
          <Pill color={T.green}>⚡ Verified Farmer</Pill>
          <Pill color={T.yellow}>🏅 Gold Member</Pill>
        </div>
      </div>

      {/* Stats */}
      <div style={{ margin: "0 20px 16px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[["47", "Total Scans", T.green], ["12", "Certificates", T.yellow], ["4.8★", "Seller Rating", T.blue]].map(([v, l, c]) => (
          <div key={l} style={{ padding: "12px 8px", borderRadius: 14, background: T.card, border: `1px solid ${T.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
            <div style={{ fontSize: 10, color: T.gray2, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Settings sections */}
      {[
        {
          title: "Language & Voice", items: [
            { icon: "🌐", label: "App Language", action: <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{LANGS.map(l => <button key={l} onClick={() => setLang(l)} style={{ padding: "3px 9px", borderRadius: 99, fontSize: 10, fontWeight: 600, background: lang === l ? T.green : T.card2, color: lang === l ? "#000" : T.gray1, border: `1px solid ${lang === l ? T.green : T.border}`, cursor: "pointer" }}>{l}</button>)}</div> },
            { icon: "🔊", label: "Voice Assistant", action: <Pill color={T.green}>ON</Pill> },
            { icon: "🎙️", label: "Voice Gender", action: <span style={{ color: T.gray1, fontSize: 12 }}>Male</span> },
          ]
        },
        {
          title: "Blockchain & Data", items: [
            { icon: "⛓️", label: "Polygon Wallet", action: <span style={{ fontSize: 11, fontFamily: "monospace", color: T.green }}>0x7E3A...9F2C</span> },
            { icon: "🔐", label: "Data Privacy", action: <span style={{ color: T.gray1, fontSize: 12 }}>Managed →</span> },
            { icon: "📜", label: "Certificate History", action: <span style={{ color: T.gray1, fontSize: 12 }}>12 certs →</span> },
          ]
        },
        {
          title: "Account", items: [
            { icon: "📱", label: "Phone", action: <span style={{ color: T.gray1, fontSize: 12 }}>+91 96749 51947</span> },
            { icon: "🏘️", label: "Village / District", action: <span style={{ color: T.gray1, fontSize: 12 }}>Edit →</span> },
            { icon: "🚪", label: "Log Out", action: <span style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Log Out</span> },
          ]
        }
      ].map(section => (
        <div key={section.title} style={{ margin: "0 20px 14px" }}>
          <div style={{ fontSize: 11, color: T.gray2, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{section.title}</div>
          <div style={{ borderRadius: 16, background: T.card, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < section.items.length - 1 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 13, color: T.white, fontWeight: 500 }}>{item.label}</span>
                {item.action}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: "4px 20px 0", textAlign: "center" }}>
        <p style={{ fontSize: 10, color: T.gray2 }}>AgriVerify AI v2.4.1 · Built on Polygon · Bhashini Powered</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BOTTOM NAV
═══════════════════════════════════════════════════════ */
function BottomNav({ active, onChange, onCamera }) {
  const tabs = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "community", icon: "🌱", label: "Community" },
    { id: "camera", icon: null, label: "" },
    { id: "support", icon: "💬", label: "Support" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 82, background: "rgba(14,14,14,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", paddingTop: 8, zIndex: 40 }}>
      {tabs.map((tab, i) => {
        if (tab.id === "camera") return (
          <div key="camera" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", marginTop: -22 }}>
            <button onClick={onCamera} style={{ width: 62, height: 62, borderRadius: 20, background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "4px solid #0a0a0a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: `0 0 30px ${T.greenGlow}, 0 8px 24px rgba(0,0,0,0.5)`, transition: "transform .15s, box-shadow .15s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              📷
            </button>
          </div>
        );
        const isActive = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", paddingTop: 2 }}>
            <span style={{ fontSize: 22, filter: isActive ? "none" : "grayscale(0.6)", transition: "all .2s" }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? T.green : T.gray2, transition: "color .2s" }}>{tab.label}</span>
            {isActive && <div style={{ width: 18, height: 3, borderRadius: 99, background: T.green, boxShadow: `0 0 6px ${T.green}` }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATUS BAR
═══════════════════════════════════════════════════════ */
function StatusBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })), 10000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, background: T.bg }}>
      <span style={{ fontSize: 14, fontWeight: 800, color: T.white }}>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 12, color: T.white }}>●●●●</span>
        <span style={{ fontSize: 12, color: T.white }}>WiFi</span>
        <span style={{ fontSize: 12, color: T.green, fontWeight: 700 }}>87%🔋</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function AgriVerifyApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const screenTitles = { dashboard: "Dashboard", community: "AgriSocial", support: "Support", profile: "Profile" };

  return (
    <>
      <style>{CSS}</style>
      {/* Desktop wrapper */}
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "var(--font-body)" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
          {/* Desktop label */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 280, paddingTop: 40 }} className="desktop-info">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 0 20px rgba(34,197,94,0.4)" }}>🌾</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)" }}>AgriVerify AI</div>
                  <div style={{ fontSize: 11, color: "#6b9b8a" }}>Mobile App UI Demo</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#4d9e88", lineHeight: 1.65 }}>This is a pixel-perfect React simulation of the AgriVerify AI mobile app. Resize to mobile width for full immersion.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["📱", "iOS & Android Ready", "NativeWind + Expo"], ["⛓️", "Blockchain Integrated", "Polygon ERC-721 NFT"], ["🗣️", "Bhashini Voice API", "22 Indian Languages"], ["🤖", "Edge AI Grading", "ResNet-50 Offline"]].map(([icon, t, s]) => (
                <div key={t} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#d1fae5" }}>{t}</div>
                    <div style={{ fontSize: 10, color: "#4d9e88" }}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone frame */}
          <div style={{ position: "relative", width: 390, flexShrink: 0 }}>
            {/* Outer glow */}
            <div style={{ position: "absolute", inset: -3, borderRadius: 55, background: "linear-gradient(135deg,rgba(34,197,94,0.3),rgba(250,204,21,0.1),rgba(34,197,94,0.2))", zIndex: -1, filter: "blur(8px)" }} />
            {/* Phone body */}
            <div style={{ width: 390, height: 844, borderRadius: 52, background: T.bg, border: "2px solid rgba(255,255,255,0.12)", overflow: "hidden", position: "relative", boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              {/* Notch */}
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 130, height: 34, background: "#000", borderRadius: "0 0 20px 20px", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #333" }} />
                <div style={{ width: 60, height: 6, borderRadius: 3, background: "#1a1a1a" }} />
              </div>

              <StatusBar />

              <div style={{ flex: 1, height: "calc(844px - 44px - 82px)", display: "flex", flexDirection: "column", position: "relative" }}>
                {activeTab === "dashboard" && <Dashboard onScan={() => setShowAnalysis(true)} />}
                {activeTab === "community" && <Community />}
                {activeTab === "support" && <Support />}
                {activeTab === "profile" && <Profile />}
                {showAnalysis && <AnalysisFlow onClose={() => setShowAnalysis(false)} />}
              </div>

              <BottomNav active={activeTab} onChange={setActiveTab} onCamera={() => setShowAnalysis(true)} />
            </div>

            {/* Side buttons */}
            <div style={{ position: "absolute", top: 120, right: -3, width: 4, height: 60, borderRadius: "0 3px 3px 0", background: "#2a2a2a" }} />
            <div style={{ position: "absolute", top: 160, left: -3, width: 4, height: 40, borderRadius: "3px 0 0 3px", background: "#2a2a2a" }} />
            <div style={{ position: "absolute", top: 210, left: -3, width: 4, height: 40, borderRadius: "3px 0 0 3px", background: "#2a2a2a" }} />
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  :root {
    --font-display: 'Sora', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #111; -webkit-font-smoothing: antialiased; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  @keyframes pulse { from { opacity: 0.4; transform: scale(0.95); } to { opacity: 1; transform: scale(1.05); } }
  @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  @keyframes typingDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }
  @keyframes scanLine { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }
  @keyframes waveBar { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  input::placeholder { color: #475569; }
  input { caret-color: #22c55e; }
  button { font-family: var(--font-body); }

  @media (max-width: 700px) {
    .desktop-info { display: none !important; }
    div[style*="padding: 20px"] > div[style*="gap: 40px"] { justify-content: center; }
  }
`;
