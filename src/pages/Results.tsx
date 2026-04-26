import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultCard } from "@/components/ResultCard";
import { OutOfCreditsWarning } from "@/components/OutOfCreditsWarning";
import { searchAircraft, fuzzySearchAircraft, getCreditBalance } from "@/api/aircraft";
import type { SearchResult, Credits } from "@/types/aircraft";
import { ArrowLeft, Coins, Loader2 } from "lucide-react";

export default function Results() {
  const [params] = useSearchParams();
  const lookup = params.get("lookup");
  const intent = (params.get("intent") as "lease" | "buy") ?? "lease";
  const horizon = params.get("horizon") ?? "6m";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [totalMatched, setTotalMatched] = useState(0);
  const [loading, setLoading] = useState(true);
  const [outOfCredits, setOutOfCredits] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (getCreditBalance() <= 0) {
          setOutOfCredits(true);
          return;
        }
        if (lookup) {
          const res = await fuzzySearchAircraft(lookup);
          setResults(res.results);
          setCredits(res.credits);
          setTotalMatched(res.total_matched);
        } else {
          const res = await searchAircraft({ intent, horizon });
          setResults(res.results);
          setCredits(res.credits);
          setTotalMatched(res.total_matched);
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [lookup, intent, horizon]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/lookup" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {outOfCredits ? (
          <OutOfCreditsWarning />
        ) : (
          <>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {lookup ? `Results for "${lookup}"` : `A320 Family · ${intent === "lease" ? "Lease" : "Buy"}`}
                </h1>
                {!loading && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalMatched} matched · top {results.length} shown
                  </p>
                )}
              </div>
              {credits && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1.5">
                  <Coins className="h-3.5 w-3.5" />
                  <span>{credits.cost} used · <span className="font-mono font-semibold text-foreground">{credits.balance_after}</span> left</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                <span className="ml-3 text-muted-foreground text-sm">Loading…</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                No aircraft matched your criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((r) => (
                  <ResultCard key={r.aircraft_id} result={r} showScoring={!lookup} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

