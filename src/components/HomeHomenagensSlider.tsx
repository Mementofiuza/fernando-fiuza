import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { fetchHomenagensAprovadas, type HomenagemPublica } from "@/lib/homenagens";
import { Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Homenagem = HomenagemPublica;

export function HomeHomenagensSlider() {
  const [items, setItems] = useState<Homenagem[]>([]);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 35, align: "start" });
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const rows = await fetchHomenagensAprovadas(12);
      if (!cancelled) setItems(rows);
    };
    load();
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);


  const onSelect = useCallback(() => {
    if (!embla) return;
    setIdx(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => embla.scrollNext(), 6000);
    return () => clearInterval(interval);
  }, [embla, onSelect]);

  if (items.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto reveal">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
            Mural de homenagens
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-primary">
            Palavras de quem guarda sua memória.
          </h2>
          <div className="gold-rule mt-6 mx-auto w-32" />
        </div>

        <div className="mt-14 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {items.map((h) => (
                <div
                  key={h.id}
                  className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.3333%] min-w-0 px-3"
                >
                  <article className="bg-card border border-border p-7 h-full flex flex-col">
                    {h.signedPhoto && (
                      <div className="aspect-[4/3] overflow-hidden mb-5 -mx-7 -mt-7">
                        <img
                          src={h.signedPhoto}
                          alt={`Foto enviada por ${h.nome ?? "visitante anônimo"}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Quote className="w-5 h-5 text-gold" />
                    <p className="mt-3 font-serif text-primary leading-relaxed line-clamp-6 whitespace-pre-line">
                      {h.mensagem}
                    </p>
                    <div className="mt-5 pt-4 border-t border-border">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        — {h.nome?.trim() || "Anônimo"}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={() => embla?.scrollPrev()}
                aria-label="Anterior"
                className="hidden md:grid absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full place-items-center bg-background border border-border text-primary hover:bg-gold hover:text-gold-foreground transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => embla?.scrollNext()}
                aria-label="Próximo"
                className="hidden md:grid absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full place-items-center bg-background border border-border text-primary hover:bg-gold hover:text-gold-foreground transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="mt-8 flex justify-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => embla?.scrollTo(i)}
                    aria-label={`Ir para homenagem ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === idx ? "w-8 bg-gold" : "w-4 bg-border hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-12 text-center reveal">
          <Link
            to="/homenagens"
            hash="mural"
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            Deixar uma homenagem
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
