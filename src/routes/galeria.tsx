import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Loader2, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { fetchGaleria, fetchAlbuns, type GaleriaImagem } from "@/lib/conteudo";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria de Fotos — Dr. Fernando Fiuza" },
      { name: "description", content: "Galeria de fotografias da vida pessoal e profissional do Dr. Fernando Fiuza, organizada por temas." },
      { property: "og:title", content: "Galeria de Fotos" },
      { property: "og:description", content: "Memória em imagens, organizada por temas." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/galeria" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/galeria" }],
  }),
  component: Galeria,
});

const SEM_TEMA = "__sem_tema__";

function Galeria() {
  const [active, setActive] = useState<GaleriaImagem | null>(null);
  const [tema, setTema] = useState<string>("todas");

  const { data: imagens, isLoading } = useQuery({ queryKey: ["galeria"], queryFn: fetchGaleria });
  const { data: albuns } = useQuery({ queryKey: ["galeria-albuns"], queryFn: fetchAlbuns });

  const grupos = useMemo(() => {
    const imgs = imagens ?? [];
    const lista = (albuns ?? []).map((a) => ({
      id: a.id,
      titulo: a.titulo,
      itens: imgs.filter((i) => i.album_id === a.id),
    }));
    const soltas = imgs.filter((i) => !i.album_id || !(albuns ?? []).some((a) => a.id === i.album_id));
    if (soltas.length) lista.push({ id: SEM_TEMA, titulo: "Outras imagens", itens: soltas });
    return lista.filter((g) => g.itens.length > 0);
  }, [imagens, albuns]);

  const visiveis = tema === "todas" ? grupos : grupos.filter((g) => g.id === tema);

  const todasVisiveis = useMemo(
    () => visiveis.flatMap((g) => g.itens),
    [visiveis],
  );

  const activeIndex = active ? todasVisiveis.findIndex((img) => img.id === active.id) : -1;

  const goTo = (dir: "prev" | "next") => {
    if (!active || todasVisiveis.length <= 1) return;
    const next = dir === "next"
      ? (activeIndex + 1) % todasVisiveis.length
      : (activeIndex - 1 + todasVisiveis.length) % todasVisiveis.length;
    setActive(todasVisiveis[next]);
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo("next");
      if (e.key === "ArrowLeft") goTo("prev");
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, todasVisiveis.length]);

  return (
    <PageShell
      eyebrow="Galeria"
      title="Memória em imagens."
      intro="Fotografias que retratam diferentes momentos da vida pessoal, familiar e profissional do Dr. Fiuza, reunidas por temas."
    >
      {isLoading ? (
        <div className="space-y-10">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-muted animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando fotografias…
          </div>
        </div>
      ) : grupos.length === 0 ? (
        <div className="border border-border bg-card/60 px-8 py-16 text-center">
          <Images className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">Nenhuma imagem publicada até o momento.</p>
        </div>
      ) : (
        <>
          {/* Barra de temas — fixa ao rolar */}
          {grupos.length > 1 && (
            <div className="sticky top-16 z-20 -mx-4 px-4 py-3 mb-12 bg-background/85 backdrop-blur-md border-b border-border/60">
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[{ id: "todas", titulo: "Todas", total: todasCount(grupos) }, ...grupos.map((g) => ({ id: g.id, titulo: g.titulo, total: g.itens.length }))].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setTema(g.id)}
                    className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.16em] border transition-all ${
                      tema === g.id
                        ? "border-gold bg-gold/15 text-primary font-medium shadow-sm"
                        : "border-border bg-card/50 text-muted-foreground hover:text-primary hover:border-gold/60"
                    }`}
                  >
                    {g.titulo}
                    <span className={`text-[10px] px-1.5 py-0.5 leading-none ${tema === g.id ? "bg-gold/25 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {g.total}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-20">
            {visiveis.map((grupo, gi) => (
              <section key={grupo.id}>
                <header className="flex items-end justify-between gap-6 mb-8 pb-5 border-b border-border">
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span className="font-serif text-4xl md:text-5xl text-gold/70 leading-none select-none">
                      {String(gi + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-serif text-2xl md:text-3xl text-primary truncate">{grupo.titulo}</h2>
                      <div className="gold-rule-left mt-3" />
                    </div>
                  </div>
                  <p className="shrink-0 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {grupo.itens.length} {grupo.itens.length === 1 ? "imagem" : "imagens"}
                  </p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {grupo.itens.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActive(img)}
                      className="group relative block aspect-[4/3] overflow-hidden bg-muted border border-border text-left reveal focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
                    >
                      <img
                        src={img.url}
                        alt={img.titulo}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-white font-serif text-sm md:text-base leading-snug line-clamp-2 drop-shadow">
                          {img.titulo}
                        </p>
                        <div className="mt-2 h-px w-8 bg-gold" />
                      </div>
                      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/50 transition-colors duration-500 pointer-events-none" />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <Dialog open={active !== null} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent
          className="max-w-6xl w-[95vw] p-0 bg-black/95 border-0 overflow-hidden"
          onPointerDownOutside={() => setActive(null)}
        >
          {active && (
            <div className="relative">
              <img src={active.url} alt={active.titulo} className="w-full max-h-[85vh] object-contain" />

              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 w-10 h-10 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              {todasVisiveis.length > 1 && (
                <>
                  <button
                    onClick={() => goTo("prev")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => goTo("next")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <p className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent text-white font-serif text-center">
                {active.titulo}
                <span className="block mt-1 text-xs opacity-70">
                  {activeIndex + 1} / {todasVisiveis.length}
                </span>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function todasCount(grupos: { itens: GaleriaImagem[] }[]) {
  return grupos.reduce((acc, g) => acc + g.itens.length, 0);
}
