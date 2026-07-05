import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="font-serif text-2xl leading-snug">
              "A medicina é a mais humana das ciências, e a memória, sua mais nobre forma de gratidão."
            </p>
            <div className="gold-rule-left mt-6" />
            <p className="mt-4 text-sm opacity-70">
              Memorial em homenagem ao Dr. Fernando Augusto Fiuza de Melo (1944–2011).
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-gold">Navegação</h4>
            <ul className="space-y-2 text-sm opacity-85">
              <li><Link to="/biografia" className="hover:text-gold transition-colors">Biografia</Link></li>
              <li><Link to="/producao-cientifica" className="hover:text-gold transition-colors">Produção Científica</Link></li>
              <li><Link to="/artigos" className="hover:text-gold transition-colors">Artigos e Publicações</Link></li>
              <li><Link to="/linha-do-tempo" className="hover:text-gold transition-colors">Linha do Tempo</Link></li>
              <li><Link to="/acervo" className="hover:text-gold transition-colors">Acervo</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-white/10 space-y-6 text-xs opacity-75">
          <p className="leading-relaxed max-w-4xl">
            Neste site, estão disponibilizados, em acesso aberto, Artigos,
            Capítulos de livros, Crônicas e Cartas, Aulas e Palestras.
            Agradecemos a citação da autoria de Fernando Augusto Fiuza de Melo.
          </p>
          <p className="leading-relaxed max-w-4xl">
            Criado pelo sobrinho Marcelo Rocha de Sá (Jambu Tecnologia — Belém, PA)
            e Anisio Fernandes Bezerra da Silva; e por Margarida.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 opacity-90">
            <span className="inline-flex items-center gap-1.5">
              <span aria-label="Copyleft" className="text-base leading-none">🄯</span>
              {new Date().getFullYear()} Memorial Dr. Fernando Augusto Fiuza de Melo
            </span>
            <span className="inline-flex items-center gap-1.5">
              Feito com <Heart className="w-3 h-3 text-gold" /> em memória de uma vida dedicada à ciência.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
