import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Loader2 } from "lucide-react";
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

  return (
    <PageShell
      eyebrow="Galeria"
      title="Memória em imagens."
      intro="Fotografias que retratam diferentes momentos da vida pessoal, familiar e profissional do Dr. Fiuza, reunidas por temas."
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
        </div>
      ) : grupos.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma imagem publicada até o momento.</p>
      ) : (
        <>
          {grupos.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {[{ id: "todas", titulo: "Todas" }, ...grupos].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setTema(g.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
                    tema === g.id
                      ? "border-gold bg-gold/15 text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-primary hover:border-gold"
                  }`}
                >
                  {g.titulo}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-16">
            {visiveis.map((grupo) => (
              <section key={grupo.id}>
                <header className="mb-6">
                  <h2 className="font-serif text-2xl md:text-3xl text-primary">{grupo.titulo}</h2>
                  <div className="gold-rule-left mt-3" />
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {grupo.itens.length} {grupo.itens.length === 1 ? "imagem" : "imagens"}
                  </p>
                </header>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
                  {grupo.itens.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActive(img)}
                      className="group block w-full mb-5 break-inside-avoid text-left bg-card border border-border overflow-hidden hover-lift reveal"
                      style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
                    >
                      <div className="relative overflow-hidden bg-muted">
                        <img
                          src={img.url}
                          alt={img.titulo}
                          loading="lazy"
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                      </div>
                      <p className="px-4 py-3 text-sm text-primary font-serif">{img.titulo}</p>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      <Dialog open={active !== null} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black/95 border-0">
          {active && (
            <div className="relative">
              <img src={active.url} alt={active.titulo} className="w-full max-h-[85vh] object-contain" />
              <button onClick={() => setActive(null)} className="absolute top-4 right-4 w-10 h-10 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
              <p className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent text-white font-serif text-center">
                {active.titulo}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
