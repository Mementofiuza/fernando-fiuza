import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import portrait from "@/assets/portrait-side.jpg";
import { Baby, GraduationCap, Stethoscope, Microscope, Award, Sparkles } from "lucide-react";

export const Route = createFileRoute("/biografia")({
  head: () => ({
    meta: [
      { title: "Biografia — Dr. Fernando Fiuza" },
      { name: "description", content: "Biografia do Dr. Fernando Augusto Fiuza de Melo: infância em Belém, formação na UFPA, carreira médica, pesquisas, reconhecimento e legado." },
      { property: "og:title", content: "Biografia — Dr. Fernando Fiuza" },
      { property: "og:description", content: "Da infância em Belém ao reconhecimento internacional na medicina." },
    ],
  }),
  component: Bio,
});

const blocks = [
  { icon: Baby, period: "1944", title: "Infância em Belém", text: "Nascido em Belém do Pará, cresceu cercado pela diversidade humana e cultural da Amazônia, formação que marcaria sua sensibilidade médica e seu compromisso social." },
  { icon: GraduationCap, period: "1962 — 1968", title: "Formação Médica", text: "Graduou-se em Medicina pela Universidade Federal do Pará em 1968. Ainda estudante, participou ativamente da vida acadêmica e dos movimentos de resistência da época." },
  { icon: Stethoscope, period: "1968 — 1980", title: "Início da Carreira", text: "Especializou-se em Pneumologia e Tisiologia. Atuou em hospitais de referência no Pará e em São Paulo, dedicando-se ao tratamento da tuberculose, a chamada \"praga branca\" do Brasil." },
  { icon: Microscope, period: "1980 — 2000", title: "Pesquisas e Liderança", text: "Tornou-se referência nacional em tuberculose multirresistente. Dirigiu o Instituto Clemente Ferreira em São Paulo, conduziu pesquisas pioneiras e participou da elaboração das diretrizes brasileiras de controle da TB." },
  { icon: Award, period: "1987 — 2010", title: "Reconhecimento Profissional", text: "Recebeu o Prêmio Clemente Ferreira (1987), homenagens da SBPT, da SPPT, da Divisão de Tuberculose SES-SP, do CREMESP e de instituições internacionais." },
  { icon: Sparkles, period: "Legado", title: "Memória e Inspiração", text: "Faleceu em julho de 2011. Deixou dezenas de artigos, crônicas, cartas e uma geração inteira de discípulos. Sua obra continua orientando o controle da tuberculose no Brasil e no mundo." },
];

function Bio() {
  return (
    <PageShell
      eyebrow="Biografia"
      title="Uma vida atravessada pela medicina, pela pesquisa e pelo cuidado."
      intro="Da Amazônia ao reconhecimento internacional, percorra os capítulos da trajetória de um médico que transformou a saúde pública brasileira."
    >
      <div className="grid lg:grid-cols-[1fr_2fr] gap-14">
        <div className="lg:sticky lg:top-32 self-start reveal">
          <div className="relative">
            <img src={portrait} alt="Dr. Fernando Fiuza" className="w-full aspect-[4/5] object-cover shadow-[var(--shadow-elegant)]" loading="lazy" />
            <div className="absolute inset-0 ring-1 ring-gold/40 pointer-events-none" />
          </div>
          <p className="mt-6 text-sm text-muted-foreground italic font-serif">
            "Servir à medicina é servir à vida em sua forma mais essencial."
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
          <div className="space-y-12">
            {blocks.map((b, i) => (
              <div key={i} className="relative pl-14 reveal" style={{ animationDelay: `${0.05 * i}s` }}>
                <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-background border-2 border-gold grid place-items-center text-gold">
                  <b.icon className="w-4 h-4" />
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium">{b.period}</span>
                <h3 className="mt-2 font-serif text-2xl md:text-3xl text-primary">{b.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
