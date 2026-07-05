import { createFileRoute, Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Microscope, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import belemAsset from "@/assets/belem.jpg.asset.json";
import saoPauloAsset from "@/assets/sao-paulo.jpg.asset.json";
import alterDoChaoAsset from "@/assets/alter-do-chao.jpg.asset.json";
import luandaAsset from "@/assets/luanda.jpg.asset.json";
import portraitSide from "@/assets/portrait-side.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memorial Dr. Fernando Augusto Fiuza de Melo" },
      { name: "description", content: "Memorial em homenagem ao legado científico, acadêmico e humano do Dr. Fernando Augusto Fiuza de Melo, médico pneumologista e referência no controle da tuberculose." },
      { property: "og:title", content: "Memorial Dr. Fernando Augusto Fiuza de Melo" },
      { property: "og:description", content: "Vida, obra e legado de uma referência da medicina brasileira." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Memorial Dr. Fernando Augusto Fiuza de Melo",
          url: "https://fernando-fiuza.lovable.app/",
          inLanguage: "pt-BR",
          about: {
            "@type": "Person",
            name: "Fernando Augusto Fiuza de Melo",
            birthDate: "1944",
            deathDate: "2011-07",
            jobTitle: "Médico pneumologista e pesquisador",
          },
        }),
      },
    ],
  }),
  component: Home,
});


const slides = [
  {
    image: belemAsset.url,
    position: "center center",
    title: "Belém do Pará",
    subtitle: "Cidade natal do Dr. Fiuza, onde nasceu em 1944 e formou-se em Medicina pela UFPA.",
  },
  {
    image: saoPauloAsset.url,
    position: "center bottom",
    title: "São Paulo",
    subtitle: "Palco de mais de quatro décadas à frente do Instituto Clemente Ferreira, referência no combate à tuberculose.",
  },
  {
    image: alterDoChaoAsset.url,
    position: "center center",
    title: "Alter do Chão",
    subtitle: "Refúgio amazônico que sempre esteve presente em sua memória e em suas crônicas.",
  },
  {
    image: luandaAsset.url,
    position: "center center",
    title: "Luanda, Angola",
    subtitle: "Atuação internacional em cooperação científica e no enfrentamento global da tuberculose.",
  },
];

function Home() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 35 });
  const [idx, setIdx] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setIdx(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
    const interval = setInterval(() => embla.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [embla, onSelect]);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[620px] overflow-hidden">
        <div className="absolute inset-0" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((s, i) => (
              <div key={i} className="relative flex-[0_0_100%] h-full">
                <img
                  src={s.image}
                  alt={s.title}
                  style={{ objectPosition: s.position }}
                  className="absolute inset-0 w-full h-full object-cover ken-burns"
                />
                <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-full flex items-end pb-32 md:pb-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-3xl text-primary-foreground">
              <span className="inline-block text-xs uppercase tracking-[0.4em] text-gold fade-up">
                Memorial · 1944 — 2011
              </span>
              <h1 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] fade-up" style={{ animationDelay: "0.15s" }}>
                Dr. Fernando Augusto<br />Fiuza de Melo
              </h1>
              <p className="mt-6 text-lg md:text-xl opacity-90 max-w-2xl fade-up" style={{ animationDelay: "0.3s" }}>
                {slides[idx].subtitle}
              </p>
              <div className="mt-10 flex flex-wrap gap-4 fade-up" style={{ animationDelay: "0.45s" }}>
                <Link
                  to="/biografia"
                  className="group inline-flex items-center gap-2 bg-gold text-gold-foreground px-7 py-3.5 text-sm uppercase tracking-[0.18em] font-medium hover-lift"
                >
                  Conheça sua trajetória
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/producao-cientifica"
                  className="inline-flex items-center gap-2 border border-white/40 backdrop-blur-sm text-white px-7 py-3.5 text-sm uppercase tracking-[0.18em] hover:bg-white/10 transition-colors"
                >
                  Produção científica
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* controls */}
        <button
          onClick={() => embla?.scrollPrev()}
          aria-label="Anterior"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => embla?.scrollNext()}
          aria-label="Próximo"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === idx ? "w-10 bg-gold" : "w-5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* INTRODUÇÃO */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
              Uma trajetória, um legado
            </span>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl text-primary leading-tight">
              Memória viva de uma medicina humana e científica.
            </h2>
            <div className="gold-rule-left mt-6" />
            <p className="mt-7 text-lg text-muted-foreground leading-relaxed">
              Nascido em Belém do Pará em 1944, formado em Medicina pela UFPA em 1968,
              o Dr. Fernando Augusto Fiuza de Melo dedicou mais de quatro décadas
              ao estudo, ao ensino e ao tratamento da tuberculose, tornando-se uma
              das maiores referências brasileiras no enfrentamento da doença.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Pesquisador, professor, dirigente do Instituto Clemente Ferreira e
              autor de dezenas de artigos científicos, sua atuação atravessou
              gerações e continua inspirando a saúde pública brasileira.
            </p>
            <Link
              to="/biografia"
              className="mt-8 inline-flex items-center gap-2 text-primary story-link text-sm uppercase tracking-[0.2em] font-medium"
            >
              Ler biografia completa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative reveal" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-gold/30 to-transparent blur-2xl -z-10" />
            <img
              src={portraitSide}
              alt="Retrato do Dr. Fernando Fiuza"
              className="w-full aspect-[4/5] object-cover shadow-[var(--shadow-elegant)] rounded-sm"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 hidden md:block bg-background border border-border px-6 py-4 shadow-[var(--shadow-soft)] max-w-[240px]">
              <p className="font-serif text-2xl text-primary leading-none">40+</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                Anos de medicina
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto reveal">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Pilares de seu legado</span>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl text-primary">
              Ciência, ensino e cuidado humano.
            </h2>
            <div className="gold-rule mt-6 mx-auto w-32" />
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { icon: Microscope, title: "Pesquisa", text: "Estudos pioneiros sobre tuberculose multirresistente, diagnóstico e novas terapias.", to: "/producao-cientifica" },
              { icon: BookOpen, title: "Ensino", text: "Décadas formando médicos, sanitaristas e pesquisadores em programas nacionais.", to: "/artigos" },
              { icon: Quote, title: "Humanidade", text: "Cartas, crônicas e depoimentos que revelam o homem por trás do cientista.", to: "/homenagens" },
            ].map((p, i) => (
              <Link
                to={p.to}
                key={p.title}
                className="group bg-card p-10 hover-lift border border-border reveal"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="w-12 h-12 grid place-items-center bg-primary/5 border border-gold/40 text-gold mb-6 group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-primary">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{p.text}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary group-hover:text-gold transition-colors">
                  Explorar <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
          <Quote className="w-10 h-10 text-gold mx-auto" />
          <p className="mt-8 font-serif text-2xl md:text-4xl text-primary leading-snug">
            "A medicina não é apenas uma ciência: é também a arte de ouvir,
            de cuidar e de devolver dignidade ao outro."
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Dr. Fernando Fiuza
          </p>
        </div>
      </section>
    </>
  );
}
