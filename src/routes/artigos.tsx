import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useMemo, useState } from "react";
import { articles, cronicas, lectures, type Doc } from "@/data/content";
import { DocModal } from "@/components/DocModal";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/artigos")({
  head: () => ({
    meta: [
      { title: "Artigos e Publicações — Dr. Fernando Fiuza" },
      { name: "description", content: "Listagem completa de artigos, capítulos de livros, crônicas e cartas escritos pelo Dr. Fernando Fiuza." },
      { property: "og:title", content: "Artigos e Publicações" },
      { property: "og:description", content: "Acervo completo de publicações." },
    ],
  }),
  component: Artigos,
});

const PER_PAGE = 9;
const ALL: Doc[] = [...articles, ...cronicas, ...lectures];

function Artigos() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Doc | null>(null);

  const cats = useMemo(() => ["Todas", ...Array.from(new Set(ALL.map((a) => a.category)))], []);

  const filtered = useMemo(() => {
    return ALL.filter(
      (a) =>
        (cat === "Todas" || a.category === cat) &&
        a.title.toLowerCase().includes(q.toLowerCase())
    );
  }, [q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <PageShell
      eyebrow="Artigos & Publicações"
      title="Acervo completo de publicações."
      intro="Pesquise, filtre e acesse a obra escrita do Dr. Fiuza — artigos científicos, capítulos de livros, crônicas e cartas."
    >
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex items-center gap-3 border border-border bg-card px-5 py-3.5 focus-within:border-gold transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por título…"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setPage(1); }}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border transition ${
                cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} {filtered.length === 1 ? "publicação encontrada" : "publicações encontradas"}.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {view.map((d, i) => (
          <article
            key={d.url}
            className="group bg-card border border-border p-6 hover-lift flex flex-col reveal"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">{d.category}</span>
            <h3 className="mt-3 font-serif text-base md:text-lg text-primary leading-snug flex-1">{d.title}</h3>
            <div className="mt-6 flex items-center gap-3 text-xs">
              <button onClick={() => setActive(d)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-wider">
                <Eye className="w-3 h-3" /> Ver
              </button>
              <a href={d.url} download className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">
                <Download className="w-3 h-3" /> Baixar
              </a>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border disabled:opacity-30 hover:border-gold">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 text-sm border transition ${
                page === i + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-gold"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-border disabled:opacity-30 hover:border-gold">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {active && <DocModal open={!!active} onOpenChange={(v) => !v && setActive(null)} title={active.title} url={active.url} />}
    </PageShell>
  );
}
