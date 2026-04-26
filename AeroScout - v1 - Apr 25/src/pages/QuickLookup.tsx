import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { DirectoryPreview } from "@/components/DirectoryPreview";
import { getOperators, countAircraftByOperator } from "@/api/aircraft";
import { ArrowRight, Coins, Building2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuickLookup() {
  const navigate = useNavigate();
  const [lookupQuery, setLookupQuery] = useState("");
  const [operatorFilter, setOperatorFilter] = useState<string>("");

  const operators = useMemo(() => getOperators(), []);
  const matchCount = operatorFilter ? countAircraftByOperator(operatorFilter) : 0;

  const handleLookup = () => {
    if (lookupQuery.trim()) navigate(`/results?lookup=${encodeURIComponent(lookupQuery.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6">
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Quick Lookup</h1>
          <p className="text-muted-foreground">Search by registration, MSN, or ICAO hex.</p>
        </section>

        <div className="max-w-md mx-auto pb-12">
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                Search by registration, MSN, or ICAO hex
              </label>
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder="e.g. HB-DJS, 9988, 4C0FD1"
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border text-foreground font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-muted text-xs text-muted-foreground">
              <Coins className="h-3.5 w-3.5 flex-shrink-0" />
              1 credit per matched result · Fuzzy matching with high-confidence threshold
            </div>

            <button
              onClick={handleLookup}
              disabled={!lookupQuery.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="h-4 w-4" />
              Lookup Aircraft
            </button>
          </div>
        </div>

        <div className="pb-24">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Filter Directory by Operator
              </h2>
            </div>
            {operatorFilter && (
              <button
                onClick={() => setOperatorFilter("")}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Select value={operatorFilter || "__all__"} onValueChange={(v) => setOperatorFilter(v === "__all__" ? "" : v)}>
              <SelectTrigger className="rounded-xl h-11 bg-background">
                <SelectValue placeholder="All operators" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="__all__">All operators</SelectItem>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {operatorFilter && (
              <div className="flex items-center gap-2 px-4 rounded-xl bg-primary/8 text-primary text-xs font-medium whitespace-nowrap">
                {matchCount} aircraft
              </div>
            )}
          </div>

          <DirectoryPreview
            operatorFilter={operatorFilter || undefined}
            footerText={
              operatorFilter
                ? `Showing aircraft operated by ${operatorFilter}`
                : "Snapshot of the A320 directory · select an operator to filter"
            }
          />
        </div>
      </main>
    </div>
  );
}
