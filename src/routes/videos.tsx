import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Vídeos e Entrevistas — Dr. Fernando Fiuza" },
      { name: "description", content: "Entrevistas, palestras e vídeos institucionais com o Dr. Fernando Fiuza." },
      { property: "og:title", content: "Vídeos e Entrevistas" },
      { property: "og:description", content: "Acervo audiovisual." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/videos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/videos" }],
  }),
  component: Videos,
});


const placeholders = [
  { title: "Depoimento ao Museu da Pessoa", category: "Entrevista", desc: "Relato sobre vida, formação e trajetória profissional gravado para o Museu da Pessoa." },
  { title: "Palestra: Controle da Tuberculose no Brasil", category: "Palestra", desc: "Aula proferida em congresso nacional sobre as Normas Técnicas para o controle da TB." },
  { title: "Entrevista – SBPT", category: "Entrevista", desc: "Conversa com a Sociedade Brasileira de Pneumologia e Tisiologia." },
  { title: "Vídeo Institucional – Instituto Clemente Ferreira", category: "Institucional", desc: "Apresentação do trabalho realizado no ICF sob sua direção." },
];

function Videos() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="Vídeos"
      title="Vídeos, palestras e entrevistas."
      intro="Espaço dedicado ao acervo audiovisual com entrevistas, palestras e registros institucionais. Conteúdos podem ser adicionados continuamente."
    >
      <div className="grid md:grid-cols-2 gap-6">
        {placeholders.map((v, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group text-left bg-card border border-border overflow-hidden hover-lift reveal"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="relative aspect-video bg-gradient-to-br from-primary to-primary/70 grid place-items-center overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,215,150,0.4), transparent 60%)"
              }} />
              <div className="relative w-16 h-16 rounded-full bg-gold text-gold-foreground grid place-items-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">{v.category}</span>
              <h3 className="mt-3 font-serif text-xl text-primary">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground italic text-center">
        Espaço preparado para receber vídeos enviados pela família, colegas e instituições.
      </p>

      <Dialog open={active !== null} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-background overflow-hidden">
          {active !== null && (
            <div>
              <div className="aspect-video bg-muted grid place-items-center text-center px-8">
                <div>
                  <Play className="w-12 h-12 text-gold mx-auto" />
                  <p className="mt-4 font-serif text-xl text-primary">{placeholders[active].title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Vídeo em preparação para upload.</p>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="absolute top-3 right-3 w-9 h-9 grid place-items-center bg-background/80 hover:bg-background rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
