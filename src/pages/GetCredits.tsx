import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

export default function GetCredits() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6">
        {/* Title */}
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Get Credits</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Access aircraft intelligence through credits — available for purchase or earned by contributing verified data.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-20">
          {/* LEFT — Buy Credits */}
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1.5">Buy Credits</h2>
              <p className="text-sm text-muted-foreground">
                Access aircraft intelligence through flexible credit-based usage or premium dataset access.
              </p>
            </div>

            {/* Option 1 — Standard (primary) */}
            <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-sm">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-base font-semibold text-foreground">200 Credits</span>
                <span className="text-2xl font-bold text-foreground font-mono">$149</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">Best for regular analysis and deal discovery</p>
              <button
                onClick={() => {}}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Buy Credits
              </button>
            </div>

            {/* Option 2 — Premium dataset access */}
            <div className="rounded-2xl border border-foreground/20 bg-card p-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-base font-semibold text-foreground">Full Dataset Access</span>
                <span className="text-xl font-semibold text-foreground font-mono">$499</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                Access the complete dataset for a selected aircraft family
              </p>
              <p className="text-[11px] text-muted-foreground/80 mb-5 leading-relaxed">
                Includes all aircraft, signals, and detailed insights within the selected scope
              </p>
              <button
                onClick={() => {}}
                className="w-full py-2.5 rounded-xl border border-foreground/30 bg-background text-foreground font-medium text-sm hover:bg-muted transition-colors"
              >
                Request Access
              </button>
            </div>

            {/* Option 3 — Flexible access (low emphasis) */}
            <div className="rounded-xl border border-border/70 bg-card/40 p-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-medium text-foreground">20 Credits</span>
                <span className="text-base font-semibold text-foreground font-mono">$20</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">One-time access for quick analysis</p>
              <button
                onClick={() => {}}
                className="w-full py-2 rounded-lg border border-border bg-transparent text-foreground/90 font-medium text-xs hover:border-primary/40 transition-colors"
              >
                Buy Credits
              </button>
            </div>
          </section>

          {/* RIGHT — Earn Credits */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1.5">Earn Credits</h2>
              <p className="text-sm text-muted-foreground">
                Contribute verified aircraft data to improve dataset accuracy and earn credits.
              </p>
            </div>

            <ul className="space-y-2.5">
              {[
                "+20 credits per aircraft verified",
                "Verification requires confirmed affiliation (e.g. airline domain email)",
                "Credits awarded after review",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                How It Works
              </h3>
              <ol className="space-y-2.5">
                {[
                  "Select an aircraft",
                  "Confirm key details",
                  "Submit verification",
                  "Earn credits upon approval",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-foreground/90">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-muted text-muted-foreground text-xs font-mono font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Interested in contributing or accessing credits through data verification? Get in touch to learn more.
              </p>
              <a
                href="mailto:gpathak@mba2027.hbs.edu?subject=AeroScout%20%E2%80%94%20Earn%20Credits%20Inquiry"
                className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-border bg-background text-foreground/90 font-medium text-sm hover:border-primary/40 hover:text-primary transition-colors"
              >
                Get in Touch
              </a>
            </div>

            <p className="text-xs text-muted-foreground/80 leading-relaxed pt-2">
              Only verified contributors can submit confirmations. Verified aircraft are clearly marked within the dataset to ensure transparency and reliability.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
