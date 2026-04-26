import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAircraftDetail, getCreditBalance } from "@/api/aircraft";
import { OutOfCreditsWarning } from "@/components/OutOfCreditsWarning";
import type { AircraftDetail as AircraftDetailType } from "@/types/aircraft";
import {
  ArrowLeft,
  Loader2,
  Plane,
  Gauge,
  Wrench,
  Building2,
  Wifi,
  Tv,
  Plug,
  Zap,
  Globe,
  Volume2,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";

function fmtMoney(val: number | null): string {
  if (!val) return "—";
  return val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(2)}M` : `$${(val / 1_000).toFixed(0)}K`;
}
function fmtDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function fmtEvent(t: string): string {
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function monthsUntil(d: string | null): number | null {
  if (!d) return null;
  const end = new Date(d).getTime();
  const now = Date.now();
  return Math.round(((end - now) / (30.44 * 24 * 60 * 60 * 1000)) * 10) / 10;
}
function ageFromYom(yom: number): number {
  return new Date().getFullYear() - yom;
}

/* ---------- Visual primitives ---------- */

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${accent ?? "bg-primary/10 text-primary"}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-semibold font-mono text-foreground tracking-tight">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function Bar({ label, value, max, accent, valueLabel }: { label: string; value: number; max: number; accent: string; valueLabel: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-mono font-medium text-foreground">{valueLabel}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${accent}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Ring({ value, max, label, sub }: { value: number; max: number; label: string; sub?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color =
    pct >= 75 ? "hsl(var(--tier-exceptional))" :
    pct >= 50 ? "hsl(var(--tier-good))" :
    pct >= 25 ? "hsl(var(--tier-fair))" : "hsl(var(--tier-poor))";
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
          <circle
            cx="44"
            cy="44"
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 800ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono text-foreground">{value}</span>
          {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

function Pill({ icon: Icon, label, on, onText = "Yes", offText = "No" }: { icon: React.ElementType; label: string; on: boolean; onText?: string; offText?: string }) {
  return (
    <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${on ? "border-primary/20 bg-primary/5" : "border-border bg-card"}`}>
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${on ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground truncate">{on ? onText : offText}</div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function AircraftDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<AircraftDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [outOfCredits, setOutOfCredits] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    if (getCreditBalance() <= 0) {
      setOutOfCredits(true);
      setLoading(false);
      return;
    }
    getAircraftDetail(id).then((d) => { setData(d); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (outOfCredits) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-16">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/lookup"))}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <OutOfCreditsWarning />
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground mb-4">Aircraft not found.</p>
          <Link to="/" className="text-primary hover:underline text-sm">Back to search</Link>
        </div>
      </div>
    );
  }

  const op = data.operators.find((o) => o.is_current_operator) ?? data.operators[0];
  const age = ageFromYom(data.yom);
  const leaseMonths = monthsUntil(op?.lease_end_date ?? null);
  const isOnMarket = data.on_market;

  // Valuation deltas
  const askVsCmv =
    data.asking_price && data.current_market_value
      ? ((data.asking_price - data.current_market_value) / data.current_market_value) * 100
      : null;

  const valuations = [
    { label: "Asking Price", value: data.asking_price, accent: "bg-primary" },
    { label: "Current Market Value", value: data.current_market_value, accent: "bg-tier-good" },
    { label: "Half-Life Adjusted", value: data.half_life_adjusted_value, accent: "bg-tier-fair" },
    { label: "Base Value", value: data.base_value, accent: "bg-muted-foreground" },
    { label: "Last Sold", value: data.last_sold_price, accent: "bg-tier-exceptional" },
  ].filter((v) => v.value != null) as { label: string; value: number; accent: string }[];
  const maxVal = Math.max(...valuations.map((v) => v.value));

  // Maintenance status counts
  const maintCompleted = data.maintenance_events.filter((e) => e.event_status === "Completed").length;
  const maintTotal = data.maintenance_events.length;

  // Sort maintenance events by next due date for timeline
  const timelineEvents = [...data.maintenance_events].sort((a, b) => {
    const ad = a.next_due_date ? new Date(a.next_due_date).getTime() : Infinity;
    const bd = b.next_due_date ? new Date(b.next_due_date).getTime() : Infinity;
    return ad - bd;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/lookup"))}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-primary/5 p-8 mb-8 animate-fade-in">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="absolute right-8 top-8 opacity-[0.06] hidden md:block">
            <Plane className="h-48 w-48 text-foreground" strokeWidth={1} />
          </div>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium uppercase tracking-wider">
                {data.family} · {data.variant}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${
                data.operational_status === "Active" || data.operational_status === "In Service"
                  ? "bg-tier-exceptional/10 text-tier-exceptional"
                  : "bg-tier-fair/10 text-tier-fair"
              }`}>
                {data.operational_status}
              </span>
              {isOnMarket && (
                <span className="px-2.5 py-1 rounded-full bg-tier-good/10 text-tier-good text-[11px] font-medium uppercase tracking-wider">
                  On Market
                </span>
              )}
              {data.flags.distressed_operator && (
                <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-medium uppercase tracking-wider inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Distressed Operator
                </span>
              )}
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-2 font-mono">
              {data.registration}
            </h1>
            <p className="text-muted-foreground text-base mb-8">
              MSN {data.msn} · ICAO {data.icao_hex} · {data.engine_model}
            </p>

            {/* Hero KPI strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatTile
                icon={Calendar}
                label="Year of Manufacture"
                value={data.yom.toString()}
                sub={`${age} years old`}
              />
              <StatTile
                icon={DollarSign}
                label="Market Value"
                value={fmtMoney(data.current_market_value)}
                sub={
                  askVsCmv != null
                    ? `Ask ${askVsCmv >= 0 ? "+" : ""}${askVsCmv.toFixed(1)}% vs CMV`
                    : undefined
                }
                accent="bg-tier-good/10 text-tier-good"
              />
              <StatTile
                icon={Activity}
                label="Total Flight Hours"
                value={data.total_flight_hours.toLocaleString()}
                sub={`${data.total_flight_cycles.toLocaleString()} cycles`}
                accent="bg-tier-fair/10 text-tier-fair"
              />
              <StatTile
                icon={Users}
                label="Cabin Capacity"
                value={data.total_seats.toString()}
                sub="seats configured"
                accent="bg-primary/10 text-primary"
              />
            </div>
          </div>
        </section>

        {/* DATA COMPLETENESS */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl border border-border bg-card/40">
            <span className="text-xs text-muted-foreground">
              Data completeness: <span className="font-mono text-foreground/80">{Math.round(data.data_completeness * 100)}%</span>
            </span>
            <Link
              to="/get-credits"
              className="text-xs text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Is this your aircraft? <span className="text-foreground/90">Help verify details</span> <span className="text-muted-foreground/60">→</span> <span className="text-primary">earn credits</span>
            </Link>
          </div>
        </section>

        {/* VALUATION VISUAL */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Valuation Breakdown</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 bg-card border border-border rounded-2xl p-6">
            <div className="md:col-span-2 space-y-5">
              {valuations.map((v) => (
                <Bar
                  key={v.label}
                  label={v.label}
                  value={v.value}
                  max={maxVal}
                  accent={v.accent}
                  valueLabel={fmtMoney(v.value)}
                />
              ))}
            </div>
            <div className="md:border-l md:border-border md:pl-6 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Ask vs Market</div>
              <div className="flex items-baseline gap-2">
                {askVsCmv != null ? (
                  <>
                    <span className={`text-4xl font-bold font-mono ${askVsCmv >= 0 ? "text-tier-fair" : "text-tier-exceptional"}`}>
                      {askVsCmv >= 0 ? "+" : ""}{askVsCmv.toFixed(1)}%
                    </span>
                    {askVsCmv >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-tier-fair" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-tier-exceptional" />
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-mono text-muted-foreground">N/A</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {askVsCmv != null && askVsCmv < 0
                  ? "Asking price is below current market value — potential opportunity."
                  : askVsCmv != null
                  ? "Asking price is above current market value."
                  : "No active asking price to compare."}
              </p>
            </div>
          </div>
        </section>

        {/* UTILISATION + OPERATOR */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Utilisation */}
          <section className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Utilisation</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 h-full">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Ring value={Math.round(data.avg_fh_per_fc * 10) / 10} max={5} label="Avg FH / FC" sub="hours" />
                <Ring value={age} max={25} label="Age" sub="yrs" />
                <Ring value={Math.round(data.data_completeness * 100)} max={100} label="Data" sub="%" />
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-mono text-foreground">{fmtDate(data.delivery_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total flight hours</span>
                  <span className="font-mono text-foreground">{data.total_flight_hours.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total flight cycles</span>
                  <span className="font-mono text-foreground">{data.total_flight_cycles.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Noise chapter</span>
                  <span className="font-mono text-foreground">Ch. {data.noise_chapter}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Operator */}
          {op && (
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Current Operator</h2>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 h-full">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-xl font-semibold text-foreground">{op.operator_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {op.operator_iata_code} · {op.operator_type}
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                    op.operator_in_distress
                      ? "bg-destructive/10 text-destructive"
                      : "bg-tier-exceptional/10 text-tier-exceptional"
                  }`}>
                    {op.credit_rating}
                  </div>
                </div>

                {/* Financial health bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-muted-foreground">Financial Health</span>
                    <span className="text-sm font-mono font-medium text-foreground">{op.financial_health_score}/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        op.financial_health_score >= 75 ? "bg-tier-exceptional" :
                        op.financial_health_score >= 50 ? "bg-tier-good" :
                        op.financial_health_score >= 25 ? "bg-tier-fair" : "bg-tier-poor"
                      }`}
                      style={{ width: `${op.financial_health_score}%` }}
                    />
                  </div>
                </div>

                {/* Lease countdown */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Lease ends</div>
                    <div className="text-sm font-mono font-medium text-foreground">{fmtDate(op.lease_end_date)}</div>
                    {leaseMonths != null && (
                      <div className={`text-xs mt-1 inline-flex items-center gap-1 ${
                        leaseMonths < 12 ? "text-tier-fair" : "text-muted-foreground"
                      }`}>
                        <Clock className="h-3 w-3" /> {leaseMonths} months
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Monthly lease</div>
                    <div className="text-sm font-mono font-medium text-foreground">{fmtMoney(op.monthly_lease_rate_usd)}</div>
                    <div className="text-xs text-muted-foreground mt-1">since {fmtDate(op.operation_start_date)}</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* CABIN & SYSTEMS */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Cabin & Systems</h2>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="mb-5">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Cabin amenities</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Pill icon={Tv} label="IFE" on={!!data.ife_type && data.ife_type !== "None" && data.ife_type !== "—"} onText={(data.ife_type ?? "—").replace(/_/g, " ")} offText="None" />
                <Pill icon={Wifi} label="Connectivity" on={!!data.connectivity_type && data.connectivity_type !== "None" && data.connectivity_type !== "—"} onText={data.connectivity_type ?? "—"} offText="None" />
                <Pill icon={Plug} label="USB at Seat" on={!!data.usb_power_at_seat} />
                <Pill icon={Zap} label="AC at Seat" on={!!data.ac_power_at_seat} />
              </div>
            </div>
            <div className="pt-5 border-t border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-3">Compliance & capacity</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Pill icon={Globe} label="ETOPS" on={!!data.etops_certified} onText="Certified" offText="No" />
                <Pill icon={CheckCircle2} label="ADS-B" on={!!data.adsb_compliant} onText="Compliant" offText="Pending" />
                <Pill icon={Volume2} label="Noise" on={data.noise_chapter >= 4} onText={`Chapter ${data.noise_chapter}`} offText={`Chapter ${data.noise_chapter}`} />
                <Pill icon={Users} label="Total Seats" on={true} onText={`${data.total_seats}`} />
              </div>
            </div>
            {(data.ife_manufacturer && data.ife_manufacturer !== "—") || (data.connectivity_provider && data.connectivity_provider !== "—") ? (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-4 border-t border-border text-xs">
                {data.ife_manufacturer && data.ife_manufacturer !== "—" && (
                  <span className="text-muted-foreground">
                    IFE: <span className="text-foreground font-medium">{data.ife_manufacturer}</span>
                  </span>
                )}
                {data.connectivity_provider && data.connectivity_provider !== "—" && (
                  <span className="text-muted-foreground">
                    Connectivity: <span className="text-foreground font-medium">{data.connectivity_provider}</span>
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </section>

        {/* MAINTENANCE TIMELINE */}
        <section className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Maintenance Timeline</h2>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              {maintCompleted} / {maintTotal} completed
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="relative space-y-5">
              {/* vertical line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-border" aria-hidden />
              {timelineEvents.map((evt, i) => {
                const completed = evt.event_status === "Completed";
                const dueMonths = monthsUntil(evt.next_due_date);
                const isUrgent = dueMonths != null && dueMonths < 6;
                return (
                  <div key={i} className="relative pl-10">
                    <div
                      className={`absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background ${
                        completed
                          ? "bg-tier-exceptional text-white"
                          : isUrgent
                          ? "bg-tier-fair text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : isUrgent ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{fmtEvent(evt.event_type)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Last: {fmtDate(evt.event_date)} · Next: {fmtDate(evt.next_due_date)}
                          {dueMonths != null && (
                            <span className={isUrgent ? "text-tier-fair font-medium ml-1" : "ml-1"}>
                              ({dueMonths > 0 ? `in ${dueMonths}` : `${Math.abs(dueMonths)} overdue`} mo)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {evt.llp_cycles_remaining != null && (
                          <span className="text-xs font-mono text-muted-foreground">
                            LLP: <span className="text-foreground">{evt.llp_cycles_remaining.toLocaleString()}</span>
                          </span>
                        )}
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          completed ? "bg-tier-exceptional/10 text-tier-exceptional" : "bg-tier-fair/10 text-tier-fair"
                        }`}>
                          {evt.event_status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground pb-8">
          Data completeness: {(data.data_completeness * 100).toFixed(0)}% · Last updated {data.scored_at}
        </p>
      </main>
      <Footer />
    </div>
  );
}
