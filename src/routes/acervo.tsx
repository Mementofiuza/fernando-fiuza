import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useMemo, useState } from "react";
import { articles, cronicas, homenagens, lectures, type Doc } from "@/data/content";
import { DocModal } from "@/components/DocModal";
import { FileText, Download, Eye, Search } from "lucide-react";

export const Route = createFileRoute("/acervo")({
  head: () => ({
    meta: [
      { title: "Acervo / Documentos — Dr. Fernando Fiuza" },
      { name: "description", content: "Acervo digital com PDFs, certificados, documentos históricos e materiais relacionados à obra do Dr. Fiuza." },
      { property: "og:title", content: "Acervo / Documentos" },
      { property: "og:description", content: "Memória documental." },
    ],
  }),
  component: Acervo,
});

const ALL: Doc[] = [...articles, ...cronicas, ...lectures, ...homenagens];

function Acervo() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [active, setActive] = useState<Doc | null>(null);

  const cats = useMemo(() => ["Todas", ...Array.from(new Set(ALL.map((a) => a.category)))], []);
  const filtered = useMemo(
    () => ALL.filter((a) => (cat === "Todas" || a.category === cat) && a.title.toLowerCase().includes(q.toLowerCase())),
    [q, cat]
  );

  return (
    <PageShell
      eyebrow="Acervo"
      title="Acervo digital de documentos."
      intro="Reunião de PDFs, certificados, jornais e documentos históricos. Espaço preparado para receber novos materiais a qualquer tempo."
    >
      <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-8">
        <div className="flex items-center gap-3 border border-border bg-card px-5 py-3.5 focus-within:border-gold transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar no acervo…" className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-border bg-card px-5 py-3.5 text-sm">
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="border border-border divide-y divide-border bg-card">
        {filtered.map((d, i) => (
          <div key={d.url} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors reveal" style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}>
            <div className="w-9 h-9 grid place-items-center bg-primary/5 border border-gold/40 text-gold shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm md:text-base text-primary truncate">{d.title}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5">{d.category}</p>
            </div>
            <button onClick={() => setActive(d)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-primary hover:text-gold transition">
              <Eye className="w-3 h-3" /> Ver
            </button>
            <a href={d.url} download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-primary hover:text-gold transition">
              <Download className="w-3 h-3" /> <span className="hidden sm:inline">Baixar</span>
            </a>
          </div>
        ))}
        {filtered.length === 0 && <p className="px-5 py-12 text-center text-muted-foreground text-sm">Nenhum documento encontrado.</p>}
      </div>

      {active && <DocModal open={!!active} onOpenChange={(v) => !v && setActive(null)} title={active.title} url={active.url} />}
    </PageShell>
  );
}
