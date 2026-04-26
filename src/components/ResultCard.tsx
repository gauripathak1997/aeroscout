import type { SearchResult } from "@/types/aircraft";
import { ScoreBadge, ScoreBar } from "@/components/ScoreBadge";
import { FlagBadges } from "@/components/FlagBadges";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function formatPrice(val: number | null): string {
  if (!val) return "—";
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  return `$${(val / 1_000).toFixed(0)}K`;
}

export function ResultCard({ result, showScoring = true }: { result: SearchResult; showScoring?: boolean }) {
  const navigate = useNavigate();
  const topDimensions = result.dimensions.slice(0, 4);

  return (
    <button
      onClick={() => navigate(`/aircraft/${result.aircraft_id}`)}
      className="w-full text-left bg-background border border-border rounded-2xl p-5 hover:shadow-lg hover:border-border/60 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-mono font-bold text-foreground text-lg tracking-tight">{result.registration}</span>
            <span className="text-xs text-muted-foreground font-mono">MSN {result.msn}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/70">{result.variant}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{result.yom}</span>
            <span className="text-muted-foreground/40">·</span>
            <span>{result.current_operator}</span>
          </div>
        </div>
        {showScoring && <ScoreBadge score={result.final_score} tier={result.tier} />}
      </div>

      {showScoring && (
        <div className="mb-3">
          <FlagBadges flags={result.flags} />
        </div>
      )}

      {showScoring && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
          {topDimensions.map((d) => (
            <ScoreBar key={d.label} score={d.score} label={d.label} weight={d.weight} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex gap-4">
          <span>Ask <span className="text-foreground font-mono font-medium">{formatPrice(result.asking_price)}</span></span>
          <span>CMV <span className="text-foreground font-mono font-medium">{formatPrice(result.current_market_value)}</span></span>
          <span>Lease {result.months_to_lease_end > 0
            ? <span className="text-foreground font-mono font-medium">{result.months_to_lease_end}mo</span>
            : <span className="text-primary font-medium">Expired</span>}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
      </div>
    </button>
  );
}
