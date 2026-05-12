import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { tributes, honorImages, homenagens } from "@/data/content";
import { Quote, FileText } from "lucide-react";
import { useState } from "react";
import { DocModal } from "@/components/DocModal";

export const Route = createFileRoute("/homenagens")({
  head: () => ({
    meta: [
      { title: "Homenagens e Depoimentos — Dr. Fernando Fiuza" },
      { name: "description", content: "Homenagens, depoimentos e mensagens dedicadas ao Dr. Fernando Fiuza por instituições, colegas e familiares." },
      { property: "og:title", content: "Homenagens e Depoimentos" },
      { property: "og:description", content: "Mural de gratidão e memória." },
    ],
  }),
  component: Homenagens,
});

function Homenagens() {
  const [active, setActive] = useState<typeof homenagens[number] | null>(null);
  const [activeImg, setActiveImg] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="Homenagens"
      title="Mural de gratidão e memória."
      intro="Mensagens, placas e depoimentos de instituições, colegas, ex-alunos e familiares que reconhecem a importância da obra do Dr. Fiuza."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {tributes.map((t, i) => (
          <article
            key={i}
            className="glass-card p-8 reveal hover-lift"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Quote className="w-7 h-7 text-gold" />
            <p className="mt-4 font-serif text-lg text-primary leading-relaxed">"{t.text}"</p>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">— {t.name}</p>
          </article>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="font-serif text-3xl text-primary">Imagens das homenagens</h2>
        <div className="gold-rule-left mt-4" />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {honorImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImg(i)}
              className="group block text-left bg-card border border-border overflow-hidden hover-lift reveal"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img.src} alt={img.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <p className="px-4 py-3 text-sm text-primary font-serif">{img.caption}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-serif text-3xl text-primary">Documentos e mensagens</h2>
        <div className="gold-rule-left mt-4" />
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {homenagens.map((h, i) => (
            <button
              key={h.url}
              onClick={() => setActive(h)}
              className="text-left bg-card border border-border p-6 hover-lift reveal"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">{h.category}</span>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="mt-3 font-serif text-base text-primary leading-snug">{h.title}</p>
              {h.year && <p className="mt-2 text-xs text-muted-foreground">{h.year}</p>}
            </button>
          ))}
        </div>
      </div>

      {active && <DocModal open={!!active} onOpenChange={(v) => !v && setActive(null)} title={active.title} url={active.url} />}

      <Dialog open={activeImg !== null} onOpenChange={(v) => !v && setActiveImg(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black/95 border-0">
          {activeImg !== null && (
            <div className="relative">
              <img src={honorImages[activeImg].src} alt={honorImages[activeImg].caption} className="w-full max-h-[85vh] object-contain" />
              <button onClick={() => setActiveImg(null)} className="absolute top-4 right-4 w-10 h-10 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
              <p className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent text-white font-serif text-center">
                {honorImages[activeImg].caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
