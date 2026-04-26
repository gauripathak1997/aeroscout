export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/20 pt-10 pb-12 px-6">
      <div className="max-w-3xl mx-auto space-y-3 text-xs text-muted-foreground/80 leading-relaxed">
        <div>
          <h3 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
            About AeroScout
          </h3>
          <p>
            AeroScout is a commercial aircraft intelligence platform designed to identify acquisition and lease opportunities through structured data and explainable scoring models. AeroScout was developed based on firsthand experience in airline fleet teams, where maintaining aircraft data often required months of manual effort.
          </p>
        </div>

        <p>
          This version of AeroScout has been developed as part of an academic project within the DSAIL course at Harvard Business School.
        </p>

        <p>Built by Gauri Pathak</p>

        <p>
          For feedback or dataset access, contact{" "}
          <a
            href="mailto:gpathak@mba2027.hbs.edu"
            className="text-foreground/80 underline underline-offset-2 hover:text-primary transition-colors"
          >
            here
          </a>
          .
        </p>

        <p className="pt-2 text-muted-foreground/60">© AeroScout</p>
      </div>
    </footer>
  );
}
