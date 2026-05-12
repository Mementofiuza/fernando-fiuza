import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { timeline } from "@/data/content";

export const Route = createFileRoute("/linha-do-tempo")({
  head: () => ({
    meta: [
      { title: "Linha do Tempo — Dr. Fernando Fiuza" },
      { name: "description", content: "Marcos e conquistas da trajetória do Dr. Fernando Augusto Fiuza de Melo em ordem cronológica." },
      { property: "og:title", content: "Linha do Tempo" },
      { property: "og:description", content: "Marcos cronológicos de uma vida dedicada à medicina." },
    ],
  }),
  component: Tempo,
});

function Tempo() {
  return (
    <PageShell
      eyebrow="Linha do Tempo"
      title="Marcos de uma trajetória."
      intro="Os principais momentos da vida pessoal, acadêmica e profissional do Dr. Fiuza, organizados em ordem cronológica."
    >
      <div className="relative">
        <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
        <div className="space-y-16">
          {timeline.map((t, i) => {
            const left = i % 2 === 0;
            return (
              <div key={i} className={`relative md:grid md:grid-cols-2 md:gap-12 reveal`} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={`hidden md:block ${left ? "" : "md:order-2"}`}>
                  <div className={`${left ? "text-right pr-12" : "pl-12"}`}>
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">{t.year}</span>
                    <h3 className="mt-2 font-serif text-2xl text-primary">{t.title}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
                  </div>
                </div>
                <div className={`hidden md:block ${left ? "md:order-2" : ""}`} />
                <div className="absolute md:left-1/2 left-4 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold ring-4 ring-background" />

                {/* mobile */}
                <div className="md:hidden pl-12">
                  <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">{t.year}</span>
                  <h3 className="mt-2 font-serif text-2xl text-primary">{t.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{t.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
