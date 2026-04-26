import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import {
  ArrowLeft, ArrowRight, KeyRound, Plane, Users, TrendingUp, Calendar,
  Search, ArrowUpDown, AlertCircle, Database,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const ACCESS_KEY = "DSAIL";

type Row = Record<string, string>;

// ─────────── Access Gate ───────────
function AccessGate({ onUnlock }: { onUnlock: () => void }) {
  const navigate = useNavigate();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (key.trim().toUpperCase() === ACCESS_KEY) onUnlock();
    else setError("Invalid access key.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate("/lookup")}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to AeroScout
        </button>
        <div className="rounded-2xl border border-border bg-card/40 p-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
            <KeyRound className="h-5 w-5 text-primary" strokeWidth={1.75} />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-1.5">
            AeroScout <span className="font-mono text-primary">RAW</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Restricted dashboard. Enter your access key to continue.
          </p>
          <input
            autoFocus
            type="text"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Access key"
            className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
          <p className="mt-3 text-xs italic text-muted-foreground/80">
            Psst… it is the name of the RC Spring course for the demo!
          </p>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          <button
            onClick={submit}
            disabled={!key.trim()}
            className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Unlock <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── Helpers ───────────
const fmtInt = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—";
const fmtUsd = (n: number) => {
  if (!Number.isFinite(n) || n === 0) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
};
const num = (v: string | undefined) => {
  if (!v) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const CHART_COLORS = [
  "hsl(158 75% 28%)", "hsl(210 65% 50%)", "hsl(38 85% 50%)",
  "hsl(280 55% 50%)", "hsl(0 65% 55%)", "hsl(190 60% 45%)",
  "hsl(45 80% 55%)", "hsl(330 60% 50%)",
];

// ─────────── Dashboard ───────────
function Dashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // table state
  const [query, setQuery] = useState("");
  const [variantFilter, setVariantFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("aircraft_registration");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    let cancelled = false;
    fetch("/data/aeroscout-fleet.csv")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        Papa.parse<Row>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (res) => {
            if (cancelled) return;
            setRows(res.data);
            setLoading(false);
          },
          error: (e: Error) => { if (!cancelled) { setErr(e.message); setLoading(false); } },
        });
      })
      .catch((e) => { if (!cancelled) { setErr(String(e)); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // ─── Aggregations ───
  const stats = useMemo(() => {
    if (!rows.length) return null;
    const currentYear = new Date().getFullYear();
    let ageSum = 0, ageCount = 0;
    let mvSum = 0, mvCount = 0;
    let onMarket = 0, active = 0, stored = 0;
    const operators = new Set<string>();
    const variantMap = new Map<string, number>();
    const ageBuckets = new Map<string, number>();
    const operatorMap = new Map<string, number>();
    const statusMap = new Map<string, number>();

    for (const r of rows) {
      const yom = num(r.aircraft_year_of_manufacture);
      if (Number.isFinite(yom)) {
        const age = currentYear - yom;
        ageSum += age; ageCount++;
        const bucket =
          age <= 5 ? "0–5" : age <= 10 ? "6–10" : age <= 15 ? "11–15" :
          age <= 20 ? "16–20" : age <= 25 ? "21–25" : "26+";
        ageBuckets.set(bucket, (ageBuckets.get(bucket) || 0) + 1);
      }
      const mv = num(r.aircraft_current_market_value_usd);
      if (Number.isFinite(mv) && mv > 0) { mvSum += mv; mvCount++; }
      if (r.aircraft_on_market === "True") onMarket++;
      const status = (r.aircraft_operational_status || "Unknown").trim() || "Unknown";
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
      if (status === "Active") active++;
      if (/storage|stored/i.test(status)) stored++;
      if (r.operator_operator_name) operators.add(r.operator_operator_name);
      const v = (r.aircraft_variant || "Unknown").trim() || "Unknown";
      variantMap.set(v, (variantMap.get(v) || 0) + 1);
      if (r.operator_operator_name) {
        const op = r.operator_operator_name;
        operatorMap.set(op, (operatorMap.get(op) || 0) + 1);
      }
    }

    const variantData = [...variantMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    const ageOrder = ["0–5", "6–10", "11–15", "16–20", "21–25", "26+"];
    const ageData = ageOrder.map((bucket) => ({
      bucket, count: ageBuckets.get(bucket) || 0,
    }));

    const operatorData = [...operatorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      total: rows.length,
      avgAge: ageCount ? ageSum / ageCount : 0,
      avgValue: mvCount ? mvSum / mvCount : 0,
      onMarket, active, stored,
      operatorsCount: operators.size,
      variantData, ageData, operatorData,
    };
  }, [rows]);

  // ─── Table data ───
  const variantOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.aircraft_variant && s.add(r.aircraft_variant));
    return [...s].sort();
  }, [rows]);
  const statusOptions = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.aircraft_operational_status && s.add(r.aircraft_operational_status));
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = rows.filter((r) => {
      if (variantFilter !== "all" && r.aircraft_variant !== variantFilter) return false;
      if (statusFilter !== "all" && r.aircraft_operational_status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.aircraft_registration?.toLowerCase().includes(q) ||
        r.aircraft_msn?.toLowerCase().includes(q) ||
        r.aircraft_icao_hex?.toLowerCase().includes(q) ||
        r.operator_operator_name?.toLowerCase().includes(q)
      );
    });
    const dir = sortDir === "asc" ? 1 : -1;
    result.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const an = Number(av), bn = Number(bv);
      if (Number.isFinite(an) && Number.isFinite(bn)) return (an - bn) * dir;
      return av.localeCompare(bv) * dir;
    });
    return result;
  }, [rows, query, variantFilter, statusFilter, sortKey, sortDir]);

  useEffect(() => { setPage(0); }, [query, variantFilter, statusFilter]);

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // ─── Render ───
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Database className="h-4 w-4 text-primary" strokeWidth={2} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-foreground">
                AeroScout <span className="font-mono text-primary">RAW</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Fleet Overview & Operations
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/lookup")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-medium hover:border-primary/40 hover:bg-muted/50 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to AeroScout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-24 text-sm text-muted-foreground">
            Loading fleet dataset…
          </div>
        )}

        {err && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="text-sm text-destructive">Failed to load CSV: {err}</div>
          </div>
        )}

        {!loading && !err && stats && (
          <>
            {/* KPI Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KpiCard icon={<Plane className="h-4 w-4" />} label="Fleet size" value={fmtInt(stats.total)} sub={`${fmtInt(stats.active)} active`} />
              <KpiCard icon={<Calendar className="h-4 w-4" />} label="Avg age" value={`${stats.avgAge.toFixed(1)} yrs`} sub="across reported YOM" />
              <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="On market" value={fmtInt(stats.onMarket)} sub={`${((stats.onMarket / stats.total) * 100).toFixed(1)}% of fleet`} />
              <KpiCard icon={<Users className="h-4 w-4" />} label="Operators" value={fmtInt(stats.operatorsCount)} sub={`Avg value ${fmtUsd(stats.avgValue)}`} />
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <ChartCard title="Variant mix" subtitle="Aircraft per variant">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.variantData.slice(0, 6)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={45}
                      paddingAngle={2}
                    >
                      {stats.variantData.slice(0, 6).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Age distribution" subtitle="Years since manufacture">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Top operators" subtitle="By aircraft count">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.operatorData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </section>

            {/* Table */}
            <section className="rounded-xl border border-border bg-card/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Fleet table</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {fmtInt(filtered.length)} of {fmtInt(rows.length)} aircraft
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Reg, MSN, ICAO, operator…"
                      className="pl-8 pr-3 py-1.5 w-64 rounded-md bg-background border border-border text-xs text-foreground font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    />
                  </div>
                  <select
                    value={variantFilter}
                    onChange={(e) => setVariantFilter(e.target.value)}
                    className="py-1.5 px-2.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All variants</option>
                    {variantOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-1.5 px-2.5 rounded-md bg-background border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <Th label="Registration" k="aircraft_registration" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="MSN" k="aircraft_msn" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="Variant" k="aircraft_variant" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="YOM" k="aircraft_year_of_manufacture" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="Operator" k="operator_operator_name" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="Country" k="operator_operator_country" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="Status" k="aircraft_operational_status" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                      <Th label="Hours" k="aircraft_total_flight_hours" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} align="right" />
                      <Th label="Cycles" k="aircraft_total_flight_cycles" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} align="right" />
                      <Th label="Market value" k="aircraft_current_market_value_usd" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} align="right" />
                      <Th label="On market" k="aircraft_on_market" sortKey={sortKey} sortDir={sortDir} onClick={toggleSort} />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r, i) => (
                      <tr key={r.aircraft_id || i} className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 font-mono font-medium text-foreground">{r.aircraft_registration || "—"}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{r.aircraft_msn || "—"}</td>
                        <td className="px-3 py-2 text-foreground/90">{r.aircraft_variant || "—"}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground">{r.aircraft_year_of_manufacture || "—"}</td>
                        <td className="px-3 py-2 text-foreground/90 truncate max-w-[180px]">{r.operator_operator_name || "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.operator_operator_country || "—"}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                            r.aircraft_operational_status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {r.aircraft_operational_status || "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">{fmtInt(num(r.aircraft_total_flight_hours))}</td>
                        <td className="px-3 py-2 text-right font-mono text-muted-foreground">{fmtInt(num(r.aircraft_total_flight_cycles))}</td>
                        <td className="px-3 py-2 text-right font-mono text-foreground/90">{fmtUsd(num(r.aircraft_current_market_value_usd))}</td>
                        <td className="px-3 py-2">
                          {r.aircraft_on_market === "True" ? (
                            <span className="text-[10px] font-medium bg-primary/8 text-primary rounded-full px-2 py-0.5">Yes</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!pageRows.length && (
                      <tr>
                        <td colSpan={11} className="px-3 py-12 text-center text-xs text-muted-foreground">
                          No aircraft match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Page {page + 1} of {fmtInt(totalPages)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1.5 rounded-md border border-border bg-background hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            <p className="text-[11px] text-muted-foreground/70 mt-6 text-center">
              AeroScout RAW · Internal preview ·{" "}
              <Link to="/lookup" className="hover:text-primary transition-colors">
                Return to AeroScout
              </Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}

// ─────────── Subcomponents ───────────
function KpiCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-foreground tracking-tight">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Th({
  label, k, sortKey, sortDir, onClick, align = "left",
}: {
  label: string; k: string; sortKey: string; sortDir: "asc" | "desc";
  onClick: (k: string) => void; align?: "left" | "right";
}) {
  const active = sortKey === k;
  return (
    <th className={`px-3 py-2.5 font-medium text-[10px] uppercase tracking-wider text-muted-foreground ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={() => onClick(k)}
        className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${active ? "text-foreground" : ""}`}
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? "opacity-100" : "opacity-30"}`} />
        {active && <span className="text-[9px] text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}

// ─────────── Page ───────────
export default function RawDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <AccessGate onUnlock={() => setUnlocked(true)} />;
  return <Dashboard />;
}
