import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  Plane,
  Wrench,
  Building2,
  TrendingDown,
  Armchair,
  ShieldCheck,
  AlertTriangle,
  Clock,
  DollarSign,
  Activity,
  ChevronRight,
  Sparkles,
  Target,
  Lightbulb,
  Zap,
} from "lucide-react";
import { getExampleAircraftId } from "@/api/aircraft";


/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export default function HowItWorks() {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-28 text-center max-w-3xl mx-auto px-6 overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide">Commercial fleet intelligence</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.06] mb-6">
            Find Undervalued Aircraft
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Before the Market Does.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            AI-scored intelligence across the global commercial fleet — identify high-probability acquisition and lease opportunities in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => navigate("/deal-search")}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Run a Deal Search
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate(`/aircraft/${getExampleAircraftId()}`)}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-background text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-muted/50 transition-all duration-300"
            >
              View Example Aircraft
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground/70 font-medium tracking-wide mb-3">
            110+ data points · Explainable scoring · Real-time signals
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] text-muted-foreground/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-flag-positive opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-flag-positive" />
            </span>
            <span>
              <span className="font-semibold text-foreground">A320 family loaded</span>
              <span className="text-muted-foreground/50"> · </span>
              B737, widebodies & regional jets rolling out
            </span>
          </div>
        </div>
      </section>

      {/* ── RECENT SIGNALS TICKER ────────────────────────────────── */}
      <section className="border-y border-border bg-card/40 py-5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-flag-positive opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-flag-positive" />
            </span>
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              Recent Signals
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-border flex-shrink-0" />

          {/* Marquee */}
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].flatMap((_, dup) =>
                [
                  {
                    icon: Clock,
                    color: "text-flag-warning",
                    bg: "bg-flag-warning/10 border-flag-warning/20",
                    aircraft: "A321neo",
                    detail: "Lease expiring in 8 months",
                    metric: "−12% vs market",
                  },
                  {
                    icon: AlertTriangle,
                    color: "text-flag-danger",
                    bg: "bg-flag-danger/10 border-flag-danger/20",
                    aircraft: "A320neo",
                    detail: "Maintenance event approaching",
                    metric: "Repositioning risk",
                  },
                  {
                    icon: Activity,
                    color: "text-flag-danger",
                    bg: "bg-flag-danger/10 border-flag-danger/20",
                    aircraft: "A321ceo",
                    detail: "Operator downgrade detected",
                    metric: "Credit watch",
                  },
                  {
                    icon: DollarSign,
                    color: "text-flag-positive",
                    bg: "bg-flag-positive/10 border-flag-positive/20",
                    aircraft: "A320ceo",
                    detail: "Priced below CMV",
                    metric: "−17% vs market",
                  },
                  {
                    icon: Clock,
                    color: "text-flag-warning",
                    bg: "bg-flag-warning/10 border-flag-warning/20",
                    aircraft: "A321neo",
                    detail: "C-Check due in 4 months",
                    metric: "Mx window",
                  },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={`${dup}-${i}`}
                      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border ${s.bg} flex-shrink-0`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${s.color} flex-shrink-0`} />
                      <span className="font-mono text-xs font-semibold text-foreground">{s.aircraft}</span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{s.detail}</span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className={`text-xs font-medium ${s.color} whitespace-nowrap`}>{s.metric}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ─────────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">Outcomes</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">What You Get</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Surface Mispriced Aircraft",
                text: "Instantly identify aircraft trading below market value with near-term availability.",
              },
              {
                icon: Lightbulb,
                title: "See the Drivers",
                text: "Understand lease timing, maintenance positioning, and operator risk in seconds.",
              },
              {
                icon: Zap,
                title: "Prioritize Action",
                text: "Focus only on aircraft with the highest probability of acquisition or lease opportunity.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (3 STEPS) ───────────────────────────────── */}
      <section className="py-28 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 relative">
            {/* connector line (desktop only) */}
            <div className="hidden md:block absolute top-[34px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent pointer-events-none" />

            {[
              {
                step: "01",
                icon: Plane,
                title: "Aggregate Data",
                text: "Technical, maintenance, lease, and market data across each aircraft.",
              },
              {
                step: "02",
                icon: Activity,
                title: "Generate Signals",
                text: "Detect pricing gaps, lease timing, and risk indicators.",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Score & Rank",
                text: "Each aircraft is scored across weighted dimensions to identify top opportunities.",
              },
            ].map(({ step, icon: Icon, title, text }) => (
              <div key={step} className="relative text-center px-2">
                <div className="relative inline-flex items-center justify-center w-[68px] h-[68px] rounded-2xl bg-card border border-border mb-5 shadow-sm">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                  <span className="absolute -top-2 -right-2 text-[10px] font-mono font-semibold text-muted-foreground bg-background border border-border rounded-full px-1.5 py-0.5">
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATA BEHIND EVERY AIRCRAFT ───────────────────────────── */}
      <section className="py-28 border-t border-border bg-card/50 relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">The Data Engine</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">The Data Behind Every Aircraft</h2>
            <p className="text-muted-foreground leading-relaxed">
              Each aircraft is evaluated across multiple structured layers of technical, commercial, and market intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Plane,
                title: "Aircraft & Technical",
                items: ["Age, variant, engine type", "Flight hours & cycles", "Performance profile"],
                details: ["MTOW & winglet config", "Utilization intensity (hrs/cycle ratio)", "Engine thrust rating", "Avg sector length"],
              },
              {
                icon: Wrench,
                title: "Maintenance & Engineering",
                items: ["C-check timing", "Engine shop visits", "LLP cycles remaining"],
                details: ["Last C-check", "Next engine shop visit", "LLP replacement timeline", "Upcoming MX events"],
              },
              {
                icon: Building2,
                title: "Operator & Lease",
                items: ["Lease expiry timing", "Operator financial health", "Lease structure"],
                details: ["Lease type (dry/wet/operating)", "Months to lease end", "Credit rating signals", "MR reserve rates"],
              },
              {
                icon: TrendingDown,
                title: "Market & Pricing",
                items: ["Current Market Value", "Ask vs CMV delta", "Time on market"],
                details: ["Half-life CMV benchmark", "Lease rate factor", "Comparable transactions", "Market trend index"],
              },
              {
                icon: Armchair,
                title: "Cabin & Configuration",
                items: ["Seat layout & density", "IFE & connectivity", "Passenger experience"],
                details: ["Seat pitch & manufacturer", "Wi-Fi provider", "USB/AC power at seat", "Cabin competitiveness score"],
              },
              {
                icon: ShieldCheck,
                title: "Regulatory & Compliance",
                items: ["ETOPS, ADS-B", "Noise chapter", "Certification status"],
                details: ["ETOPS certification level", "ADS-B Out compliance", "Noise chapter class", "RVSM compliance"],
              },
            ].map(({ icon: Icon, title, items, details }) => {
              const isOpen = expandedCard === title;
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => setExpandedCard(isOpen ? null : title)}
                  aria-expanded={isOpen}
                  className={`group relative text-left rounded-2xl border bg-card p-6 transition-all duration-300 ${
                    isOpen
                      ? "border-primary/40 shadow-lg shadow-primary/5"
                      : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isOpen ? "bg-primary/15" : "bg-primary/10 group-hover:bg-primary/15"
                    }`}>
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground/50 transition-transform duration-300 ${
                        isOpen ? "rotate-90 text-primary" : "group-hover:text-primary"
                      }`}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
                  <div className="h-px bg-border mb-3" />
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-3 border-t border-dashed border-border/70">
                        <p className="text-[10px] uppercase tracking-wider text-primary/80 font-semibold mb-2.5">
                          Deeper Detail
                        </p>
                        <ul className="space-y-2">
                          {details.map((d) => (
                            <li key={d} className="flex items-start gap-2.5 text-xs text-foreground/80 leading-relaxed">
                              <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-xs font-medium text-muted-foreground">
              <span className="font-mono font-semibold text-foreground">110+</span>
              structured data points per aircraft
            </span>
          </div>
        </div>
      </section>

      {/* ── EXPLAINABLE SCORING MODEL ────────────────────────────── */}
      <section className="py-28 border-t border-border">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">Scoring Model</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Explainable Scoring Model</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="space-y-5">
              {[
                { label: "Maintenance", weight: 30 },
                { label: "Operator & Lease", weight: 25 },
                { label: "Age & Generation", weight: 20 },
                { label: "Market Pricing", weight: 20 },
                { label: "Others", weight: 5 },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-foreground font-medium">{dim.label}</span>
                    <span className="font-mono text-muted-foreground">{dim.weight}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all duration-700"
                      style={{ width: `${dim.weight * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-8 leading-relaxed">
            Every score is directly tied to underlying data — no black-box outputs.
          </p>
        </div>
      </section>

      {/* ── EXAMPLE OUTPUT ───────────────────────────────────────── */}
      <section className="py-28 border-t border-border bg-card/50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">Example Output</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">What a Result Looks Like</h2>
          </div>

          {/* Triggered insight label */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-flag-positive/30 bg-flag-positive/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-flag-positive opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-flag-positive" />
              </span>
              <span className="text-[11px] font-semibold text-flag-positive uppercase tracking-wider">
                High-Confidence Opportunity
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-border bg-card p-6 md:p-7 shadow-md overflow-hidden">
            {/* Green highlight bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-flag-positive via-flag-positive/80 to-flag-positive/40" />

            <div className="flex items-start justify-between gap-4 mb-4 pl-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono font-bold text-foreground text-xl tracking-tight">HB-DJS</span>
                  <span className="text-xs text-muted-foreground font-mono">MSN 9988</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/70">A320-214</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>2014</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>Helvetic Airways</span>
                </div>
              </div>
              <div className="inline-flex items-center rounded-full border font-mono font-semibold text-sm px-3 py-1.5 gap-1.5 bg-tier-exceptional/10 border-tier-exceptional/20 text-tier-exceptional">
                <span>85.7</span>
                <span className="opacity-40">·</span>
                <span className="font-sans font-medium text-[0.9em]">Exceptional</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5 pl-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-flag-positive/20 bg-flag-positive/10 text-flag-positive">
                <DollarSign className="h-3 w-3" />
                Below CMV
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border border-flag-warning/20 bg-flag-warning/10 text-flag-warning">
                <Clock className="h-3 w-3" />
                Near Lease End
              </span>
            </div>

            <div className="ml-2 rounded-xl bg-flag-positive/5 border border-flag-positive/20 p-4 text-sm text-foreground leading-relaxed font-medium">
              Lease expires in <span className="font-mono font-bold text-flag-positive">12 months</span> and the aircraft is priced <span className="font-mono font-bold text-flag-positive">17%</span> below market value — creating a near-term acquisition window.
            </div>
          </div>

          <div className="text-center mt-14 relative">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-3">
              Start discovering aircraft opportunities now.
            </h3>
            <p className="text-sm text-muted-foreground mb-8">
              Built for the global commercial fleet · A320 family loaded today · B737, widebodies & regional jets rolling out
            </p>
            <button
              onClick={() => navigate("/deal-search")}
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Run Your Own Search
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
