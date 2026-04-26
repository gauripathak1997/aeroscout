import { Plane, Coins } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getCreditBalance } from "@/api/aircraft";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-12 px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Plane className="h-4 w-4 text-foreground transition-all group-hover:-rotate-12 group-hover:text-primary" />
            <span className="font-semibold text-sm tracking-tight text-foreground transition-colors group-hover:text-primary">AeroScout</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                "text-sm transition-colors",
                location.pathname === "/" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              How It Works
            </Link>
            <Link
              to="/deal-search"
              className={cn(
                "text-sm transition-colors",
                location.pathname === "/deal-search" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Deal Search
            </Link>
            <Link
              to="/lookup"
              className={cn(
                "text-sm transition-colors",
                location.pathname === "/lookup" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Lookup
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-1.5 text-xs",
            getCreditBalance() <= 0 ? "text-destructive" : "text-muted-foreground"
          )}>
            <Coins className="h-3.5 w-3.5" />
            <span className="font-mono"><span className={cn("font-medium", getCreditBalance() <= 0 ? "text-destructive" : "text-foreground")}>{getCreditBalance()}</span> credits</span>
          </div>
          <Link
            to="/get-credits"
            className={cn(
              "text-sm transition-colors",
              location.pathname === "/get-credits" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Get Credits
          </Link>
        </div>
      </div>
    </header>
  );
}
