import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { DocModal } from "@/components/DocModal";
import { fetchDocumentos, baixarArquivo, type Documento, type Secao } from "@/lib/conteudo";

const PER_PAGE = 9;

export function DocsSection({ secao, labelPlural }: { secao: Secao; labelPlural: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["documentos", secao],
    queryFn: () => fetchDocumentos(secao),
  });
  const items = useMemo(() => data ?? [], [data]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Documento | null>(null);

  const cats = useMemo(
    () => ["Todas", ...Array.from(new Set(items.map((a) => a.categoria).filter(Boolean) as string[]))],
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (a) =>
          (cat === "Todas" || a.categoria === cat) &&
          a.titulo.toLowerCase().includes(q.toLowerCase()),
      ),
    [items, q, cat],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex items-center gap-3 border border-border bg-card px-5 py-3.5 focus-within:border-gold transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor={`${secao}-search`} className="sr-only">Buscar por título</label>
          <input
            id={`${secao}-search`}
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Buscar por título…"
            aria-label="Buscar por título"
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        {cats.length > 1 && (
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
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} {filtered.length === 1 ? "item encontrado" : `${labelPlural} encontrados`}.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {view.map((d, i) => (
          <article
            key={d.id}
            className="group bg-card border border-border p-6 hover-lift flex flex-col reveal"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            {d.categoria && (
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">{d.categoria}</span>
            )}
            <h2 className="mt-3 font-serif text-base md:text-lg text-primary leading-snug flex-1">{d.titulo}</h2>
            {d.ano && <p className="mt-2 text-xs text-muted-foreground">{d.ano}</p>}
            <div className="mt-6 flex items-center gap-3 text-xs">
              <button onClick={() => setActive(d)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors uppercase tracking-wider">
                <Eye className="w-3 h-3" /> Ver
              </button>
              <button
                onClick={() => baixarArquivo(d.url, d.titulo)}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider"
              >
                <Download className="w-3 h-3" /> Baixar
              </button>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Anterior" className="p-2 border border-border disabled:opacity-30 hover:border-gold">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              aria-label={`Página ${i + 1}`}
              aria-current={page === i + 1 ? "page" : undefined}
              className={`w-10 h-10 text-sm border transition ${
                page === i + 1 ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-gold"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próximo" className="p-2 border border-border disabled:opacity-30 hover:border-gold">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {active && (
        <DocModal open={!!active} onOpenChange={(v) => !v && setActive(null)} title={active.titulo} url={active.url} />
      )}
    </>
  );
}
