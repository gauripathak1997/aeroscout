import { cn } from "@/lib/utils";

const tierConfig: Record<string, { color: string; bg: string }> = {
  Exceptional: { color: "text-tier-exceptional", bg: "bg-tier-exceptional/10 border-tier-exceptional/20" },
  Good: { color: "text-tier-good", bg: "bg-tier-good/10 border-tier-good/20" },
  Fair: { color: "text-tier-fair", bg: "bg-tier-fair/10 border-tier-fair/20" },
  Poor: { color: "text-tier-poor", bg: "bg-tier-poor/10 border-tier-poor/20" },
};

export function ScoreBadge({ score, tier, size = "md" }: { score: number; tier: string; size?: "sm" | "md" | "lg" }) {
  const config = tierConfig[tier] ?? tierConfig.Fair;
  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-1.5",
  };

  return (
    <div className={cn("inline-flex items-center rounded-full border font-mono font-semibold", config.bg, config.color, sizeClasses[size])}>
      <span>{score.toFixed(1)}</span>
      <span className="opacity-40">·</span>
      <span className="font-sans font-medium text-[0.9em]">{tier}</span>
    </div>
  );
}

export function ScoreBar({ score, label, weight }: { score: number; label: string; weight: number }) {
  const color = score >= 80 ? "bg-tier-exceptional" : score >= 60 ? "bg-tier-good" : score >= 40 ? "bg-tier-fair" : "bg-tier-poor";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{score}</span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700 ease-out", color)} style={{ width: `${score}%` }} />
      </div>
      <div className="text-[10px] text-muted-foreground/60 font-mono">{(weight * 100).toFixed(0)}% weight</div>
    </div>
  );
}
