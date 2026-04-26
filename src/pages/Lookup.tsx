import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDirectoryPreview } from "@/api/aircraft";
import { ArrowRight, ChevronRight, Database, KeyRound } from "lucide-react";

export default function Lookup() {
  const navigate = useNavigate();
  const [lookupQuery, setLookupQuery] = useState("");

  const previewItems = getDirectoryPreview().slice(0, 7);

  const handleLookup = () => {
    if (lookupQuery.trim()) navigate(`/results?lookup=${encodeURIComponent(lookupQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6">
        {/* ── PAGE TITLE ─────────────────────────────────────── */}
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
            Find a Specific Aircraft
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Search by registration, MSN, or ICAO to access full valuation, lease, and maintenance profile.
          </p>
        </section>

        {/* ── PRIMARY: SEARCH ────────────────────────────────── */}
        <div className="max-w-xl mx-auto pb-16">
          <div className="space-y-3">
            <input
              type="text"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="e.g. HB-DJS, 9988, 4C0FD1"
              className="w-full px-5 py-4 rounded-xl bg-background border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />

            <button
              onClick={handleLookup}
              disabled={!lookupQuery.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
              Lookup Aircraft
            </button>

            <p className="text-xs text-muted-foreground/70 text-center pt-1">
              Currently covering A320 family · broader dataset available
            </p>
          </div>
        </div>

        {/* ── SECONDARY: DATASET PREVIEW ─────────────────────── */}
        <section className="pb-12">
          <div className="mb-4 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">
                Dataset Preview
              </h2>
              <p className="text-xs text-muted-foreground">
                A snapshot of currently tracked aircraft across the fleet.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                Data completeness: <span className="font-mono text-foreground/80">92%</span>
              </span>
              <Link
                to="/get-credits"
                className="text-foreground/80 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                Help improve this <span className="text-muted-foreground/60">→</span> <span className="text-primary">earn credits</span>
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-card/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-[11px] uppercase tracking-wider">Registration</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-[11px] uppercase tracking-wider">Variant</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-[11px] uppercase tracking-wider">YOM</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-2.5 text-[11px] uppercase tracking-wider">Operator</th>
                  <th className="text-right font-medium text-muted-foreground px-4 py-2.5 text-[11px] uppercase tracking-wider">Status</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {previewItems.map((item) => (
                  <tr
                    key={item.aircraft_id}
                    onClick={() => navigate(`/aircraft/${item.aircraft_id}`)}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-mono font-medium text-foreground">{item.registration}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.variant}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{item.yom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.operator}</td>
                    <td className="px-4 py-3 text-right">
                      {item.on_market && (
                        <span className="text-[10px] font-medium bg-primary/8 text-primary rounded-full px-2 py-0.5">On Market</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── DATASET ACCESS PROMPT ──────────────────────────── */}
        <section className="pb-24">
          <div className="rounded-xl border border-border bg-card/40 px-6 py-5 flex items-center justify-between gap-6">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Database className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-0.5">Explore the full dataset</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Go beyond individual aircraft and analyze the broader market.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("/raw")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-foreground/80 text-xs font-medium hover:text-primary hover:bg-muted/50 transition-all"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Already have access
              </button>
              <button
                onClick={() => window.open("mailto:gpathak@mba2027.hbs.edu?subject=Dataset%20Access%20Request", "_blank")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-medium hover:border-primary/40 hover:bg-muted/50 transition-all"
              >
                Request Access
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
