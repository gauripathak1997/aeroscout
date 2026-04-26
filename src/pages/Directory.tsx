import { Header } from "@/components/Header";
import { DirectoryPreview } from "@/components/DirectoryPreview";

export default function Directory() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6">
        <section className="pt-14 pb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Directory</h1>
          <p className="text-muted-foreground">Browse the loaded commercial fleet · A320 family available today.</p>
        </section>

        <div className="pb-24">
          <DirectoryPreview />
        </div>
      </main>
    </div>
  );
}
