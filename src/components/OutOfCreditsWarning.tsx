import { AlertTriangle, RotateCw } from "lucide-react";

export function OutOfCreditsWarning() {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">
            Out of credits… already?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aircraft details are hidden until credits are available — but this is just part of the demo version.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background/60 px-4 py-3 mb-4">
        <p className="text-sm text-foreground/80 leading-relaxed">
          <span className="font-medium text-foreground">Good news:</span> AeroScout demo credits are unlimited.
          Refresh the page to reload your balance and keep exploring.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <RotateCw className="h-3.5 w-3.5" />
        Refresh & reload 20 credits
      </button>
    </div>
  );
}
