import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useMemo, useState } from "react";
import { articles, lectures, cronicas, type Doc } from "@/data/content";
import { DocModal } from "@/components/DocModal";
import { FileText, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/producao-cientifica")({
  head: () => ({
    meta: [
      { title: "Produção Científica — Dr. Fernando Fiuza" },
      { name: "description", content: "Pesquisas, artigos, palestras e publicações médicas do Dr. Fernando Augusto Fiuza de Melo." },
      { property: "og:title", content: "Produção Científica — Dr. Fernando Fiuza" },
      { property: "og:description", content: "Décadas de pesquisa em pneumologia e tuberculose." },
    ],
  }),
  component: Producao,
});

const TABS = ["Todos", "Artigos", "Aulas", "Crônicas"] as const;

function Producao() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Todos");
  const [active, setActive] = useState<Doc | null>(null);

  const data = useMemo(() => {
    const all = [...articles, ...lectures, ...cronicas];
    if (tab === "Todos") return all;
    if (tab === "Artigos") return articles;
    if (tab === "Aulas") return lectures;
    return cronicas;
  }, [tab]);

  return (
    <PageShell
      eyebrow="Produção Científica"
      title="Pesquisas, artigos, aulas e palestras."
      intro="Um panorama da contribuição científica e didática do Dr. Fiuza, organizado por categorias e disponível para visualização integral."
    >
      <div className="flex flex-wrap gap-2 mb-10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-all ${
              tab === t
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-gold hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((d, i) => (
          <article
            key={d.url}
            className="group bg-card border border-border p-7 hover-lift flex flex-col reveal"
            style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                {d.category}
              </span>
              <FileText className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-primary leading-snug flex-1">
              {d.title}
            </h3>
            {d.year && <p className="mt-2 text-xs text-muted-foreground">{d.year}</p>}
            <button
              onClick={() => setActive(d)}
              className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary story-link self-start"
            >
              Visualizar <ExternalLink className="w-3 h-3" />
            </button>
          </article>
        ))}
      </div>

      {active && (
        <DocModal open={!!active} onOpenChange={(v) => !v && setActive(null)} title={active.title} url={active.url} />
      )}
    </PageShell>
  );
}
