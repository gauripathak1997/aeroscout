import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { getCreditBalance } from "@/api/aircraft";
import { Coins, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DealSearch() {
  const navigate = useNavigate();
  const [intent, setIntent] = useState<"lease" | "buy">("lease");
  const [horizon, setHorizon] = useState("6m");

  const handleSearch = () => navigate(`/results?intent=${intent}&horizon=${horizon}`);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6">
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Deal Search</h1>
          <p className="text-muted-foreground">AI-scored deal intelligence across the global commercial fleet.</p>
        </section>

        <div className="max-w-md mx-auto pb-24">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Intent</label>
              <div className="grid grid-cols-2 gap-2">
                {(["lease", "buy"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setIntent(v)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium border transition-all duration-200",
                      intent === v
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/30"
                    )}
                  >
                    {v === "lease" ? "Lease" : "Buy"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">Horizon</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "3 months", value: "3m" },
                  { label: "6 months", value: "6m" },
                  { label: "1 year", value: "1y" },
                ].map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setHorizon(h.value)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium border transition-all duration-200",
                      horizon === h.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/30"
                    )}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-muted text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5 flex-shrink-0" />
              Up to 5 credits · 1 per result · Balance: <span className="font-mono font-semibold text-foreground">{getCreditBalance()}</span>
            </div>

            <button
              onClick={handleSearch}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="h-4 w-4" />
              Find Deals
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Built for the global commercial fleet.<br />
              A320 family loaded today · B737, widebodies, regionals & freighters rolling out.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
