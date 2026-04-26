import type { Flags } from "@/types/aircraft";
import { AlertTriangle, Clock, TrendingDown, ShoppingCart, Package, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const flagDefs: Record<string, { label: string; icon: typeof AlertTriangle; variant: "warning" | "danger" | "positive" | "info" }> = {
  overdue_maintenance: { label: "Overdue MX", icon: AlertTriangle, variant: "danger" },
  distressed_operator: { label: "Distressed Operator", icon: AlertCircle, variant: "danger" },
  near_lease_expiry: { label: "Near Lease End", icon: Clock, variant: "warning" },
  price_below_cmv: { label: "Below CMV", icon: TrendingDown, variant: "positive" },
  on_market: { label: "On Market", icon: ShoppingCart, variant: "info" },
  in_storage: { label: "In Storage", icon: Package, variant: "warning" },
  incomplete_data: { label: "Incomplete Data", icon: AlertCircle, variant: "warning" },
};

const variantStyles = {
  warning: "bg-flag-warning/8 text-flag-warning border-flag-warning/15",
  danger: "bg-flag-danger/8 text-flag-danger border-flag-danger/15",
  positive: "bg-flag-positive/8 text-flag-positive border-flag-positive/15",
  info: "bg-flag-info/8 text-flag-info border-flag-info/15",
};

export function FlagBadges({ flags }: { flags: Flags }) {
  const activeFlags = Object.entries(flags).filter(([, v]) => v);
  if (activeFlags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {activeFlags.map(([key]) => {
        const def = flagDefs[key];
        if (!def) return null;
        const Icon = def.icon;
        return (
          <span key={key} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", variantStyles[def.variant])}>
            <Icon className="h-3 w-3" />
            {def.label}
          </span>
        );
      })}
    </div>
  );
}
