import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/biografia", label: "Biografia" },
  { to: "/linha-do-tempo", label: "Linha do Tempo" },
  { to: "/artigos", label: "Artigos e Capítulos de livros" },
  { to: "/aulas-e-palestras", label: "Aulas e Palestras" },
  { to: "/cronicas-e-cartas", label: "Crônicas e Cartas" },
  { to: "/galeria", label: "Galeria e Imagens" },
  { to: "/homenagens", label: "Mensagens & Homenagens" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md shadow-[0_2px_20px_-12px_rgba(20,30,60,0.25)]" : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="group flex flex-col leading-tight shrink-0">
          <span className="font-serif text-base md:text-lg text-primary tracking-tight">
            Dr. Fernando A. Fiuza de Melo
          </span>
          <span className="text-[10px] md:text-[11px] text-muted-foreground tracking-[0.2em] uppercase">
            Médico · Pesquisador
          </span>
        </Link>

        <nav className="hidden 2xl:flex items-center gap-5 text-[11px] uppercase tracking-[0.14em]">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="story-link text-foreground/75 hover:text-primary transition-colors whitespace-nowrap"
              activeProps={{ className: "story-link text-primary font-medium whitespace-nowrap" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearch((s) => !s)}
            aria-label="Buscar"
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            <Search className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="2xl:hidden p-2 rounded-full hover:bg-accent transition-colors"
          >
            {open ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </div>
      </div>

      {search && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md fade-up">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Buscar artigos, palestras, homenagens…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <button onClick={() => setSearch(false)} className="text-xs text-muted-foreground hover:text-primary">Fechar</button>
          </div>
        </div>
      )}

      {open && (
        <div className="xl:hidden border-t border-border bg-background/98 backdrop-blur-md fade-up">
          <nav className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-foreground/80 py-2 border-b border-border/50"
                activeProps={{ className: "text-sm text-primary font-medium py-2 border-b border-gold" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
