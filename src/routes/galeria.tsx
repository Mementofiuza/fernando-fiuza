import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { galleryImages } from "@/data/content";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria de Fotos — Dr. Fernando Fiuza" },
      { name: "description", content: "Galeria de fotografias da vida pessoal e profissional do Dr. Fernando Fiuza." },
      { property: "og:title", content: "Galeria de Fotos" },
      { property: "og:description", content: "Memória em imagens." },
    ],
  }),
  component: Galeria,
});

function Galeria() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="Galeria"
      title="Memória em imagens."
      intro="Fotografias que retratam diferentes momentos da vida pessoal, familiar e profissional do Dr. Fiuza."
    >
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group block w-full mb-5 break-inside-avoid text-left reveal"
            style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
          >
            <div className="relative overflow-hidden bg-muted">
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
            </div>
            <p className="mt-3 text-sm font-serif text-foreground/80 group-hover:text-primary transition-colors">
              {img.caption}
            </p>
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-black/95 border-0">
          {active !== null && (
            <div className="relative">
              <img src={galleryImages[active].src} alt={galleryImages[active].caption} className="w-full max-h-[85vh] object-contain" />
              <button onClick={() => setActive(null)} className="absolute top-4 right-4 w-10 h-10 grid place-items-center bg-white/10 hover:bg-white/20 text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
              <p className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 to-transparent text-white font-serif text-center">
                {galleryImages[active].caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
