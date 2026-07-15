import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import portrait from "@/assets/fernando-portrait.jpg.asset.json";
import { Baby, GraduationCap, Stethoscope, Microscope, Award, Sparkles } from "lucide-react";

export const Route = createFileRoute("/biografia")({
  head: () => ({
    meta: [
      { title: "Biografia & Linha do Tempo — Dr. Fernando Fiuza" },
      { name: "description", content: "Biografia e linha do tempo do Dr. Fernando Augusto Fiuza de Melo: infância em Belém, formação na UFPA e UNIFESP, carreira médica, pesquisas, reconhecimento e legado." },
      { property: "og:title", content: "Biografia & Linha do Tempo — Dr. Fernando Fiuza" },
      { property: "og:description", content: "Da infância em Belém ao reconhecimento internacional na medicina — trajetória e marcos cronológicos." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/biografia" },
      { property: "og:type", content: "profile" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/biografia" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Fernando Augusto Fiuza de Melo",
          birthDate: "1945-04-24",
          deathDate: "2011-07",
          birthPlace: "Belém, Pará, Brasil",
          jobTitle: "Médico pneumologista e pesquisador",
          alumniOf: "Universidade Federal do Pará",
          description: "Médico brasileiro referência no controle da tuberculose.",
        }),
      },
    ],
  }),
  component: Bio,
});

const blocks = [
  { icon: Baby, period: "1945", title: "Infância em Belém", text: "Nascido em Belém do Pará, cresceu cercado pela diversidade humana e cultural da Amazônia, formação que marcaria sua sensibilidade médica e seu compromisso social." },
  { icon: GraduationCap, period: "1962 — 1968", title: "Formação Médica", text: "Graduou-se em Medicina pela Universidade Federal do Pará em 1968. Ainda estudante, participou ativamente da vida acadêmica e dos movimentos de resistência da época." },
  { icon: Stethoscope, period: "1968 — 1980", title: "Início da Carreira", text: "Especializou-se em Pneumologia e Tisiologia. Atuou em hospitais de referência no Pará e em São Paulo, dedicando-se ao tratamento da tuberculose, a chamada \"praga branca\" do Brasil." },
  { icon: Microscope, period: "1980 — 2000", title: "Pesquisas e Liderança", text: "Tornou-se referência nacional em tuberculose multirresistente. Dirigiu o Instituto Clemente Ferreira em São Paulo, conduziu pesquisas pioneiras e participou da elaboração das diretrizes brasileiras de controle da TB." },
  { icon: Award, period: "1987 — 2010", title: "Reconhecimento Profissional", text: "Recebeu o Prêmio Clemente Ferreira (1987), homenagens da SBPT, da SPPT, da Divisão de Tuberculose SES-SP, do CREMESP e de instituições internacionais." },
  { icon: Sparkles, period: "Legado", title: "Memória e Inspiração", text: "Faleceu em julho de 2011. Deixou dezenas de artigos, crônicas, cartas e uma geração inteira de discípulos. Sua obra continua orientando o controle da tuberculose no Brasil e no mundo." },
];

const sections: { eyebrow: string; title: string; paragraphs: string[] }[] = [
  {
    eyebrow: "Origem",
    title: "Nascimento",
    paragraphs: [
      "Nasceu em Belém do Pará no dia 24 do mês de abril de 1945 e como dizia \u201Csou touro, veado e filho de guerra\u201D, em uma família de raízes amazônicas.",
    ],
  },
  {
    eyebrow: "Academia",
    title: "Formação profissional",
    paragraphs: [
      "Fernando Augusto Fiuza de Melo possuía experiência em Pneumologia, atuando principalmente nas seguintes áreas: Tuberculose, Pneumologia e AIDS. Possuía Graduação em Medicina pela Universidade Federal do Pará (1968); Especialização em Pneumologia pela Universidade Federal de São Paulo (1976); Especialização em Administração Hospitalar e de Sistema de Saúde pela Fundação Getúlio Vargas de São Paulo (1985) e Doutorado em Medicina (Pneumologia) pela Universidade Federal de São Paulo (1997).",
    ],
  },
  {
    eyebrow: "Carreira",
    title: "Atuação profissional",
    paragraphs: [
      "Médico aprovado em Concursos Públicos do Instituto de Assistência Médica ao Servidor Público Estadual (1979-2011) e do Instituto Clemente Ferreira (1976-2011).",
      "Atuou como: Diretor Clínico do Complexo Hospitalar do Mandaqui (1983-1989), Consultor Técnico do Ministério da Saúde da República de Angola (2008-2009), Consultor Técnico do Ministério da Saúde (2003-2011), e como Diretor Técnico de Departamento do Instituto Clemente Ferreira (2004-2011).",
    ],
  },
  {
    eyebrow: "Ensino",
    title: "Formação de recursos humanos",
    paragraphs: [
      "Co-orientou, extraoficialmente, quatro Dissertações de Mestrado (de 2002 a 2005) e duas Teses de Doutorado (2009), junto ao Departamento de Microbiologia do Instituto de Ciências Biomédicas da Universidade de São Paulo. Participou de mais de 40 Bancas Examinadoras de diferentes níveis.",
    ],
  },
  {
    eyebrow: "Legado",
    title: "Produção científica",
    paragraphs: [
      "Publicou mais de 60 artigos científicos, mais de 24 artigos técnicos, um livro e oito capítulos de livros. Participou em mais de 300 eventos científicos, nacionais e internacionais, na maioria das vezes apresentando trabalhos científicos.",
    ],
  },
];

function Bio() {
  return (
    <PageShell
      eyebrow="Biografia & Linha do Tempo"
      title="Uma vida atravessada pela medicina, pela pesquisa e pelo cuidado."
      intro="Da Amazônia ao reconhecimento internacional, percorra os capítulos e os marcos da trajetória de um médico que transformou a saúde pública brasileira."
    >
      {/* Parte 1 — Biografia com retrato e cápsulas ilustradas */}
      <div className="grid lg:grid-cols-[1fr_2fr] gap-14">
        <div className="lg:sticky lg:top-32 self-start reveal">
          <div className="relative">
            <img src={portrait.url} alt="Dr. Fernando Fiuza" className="w-full aspect-[4/5] object-cover shadow-[var(--shadow-elegant)]" loading="lazy" />
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
                <h2 className="mt-2 font-serif text-2xl md:text-3xl text-primary">{b.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="mt-24 mb-16 flex items-center gap-6 reveal">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Linha do Tempo</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl text-primary">Marcos de uma trajetória</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
      </div>

      {/* Parte 2 — Linha do tempo escrita pela cliente (conteúdo preservado) */}
      <div className="relative">
        <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
        <div className="space-y-16">
          {sections.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={s.title}
                className="relative md:grid md:grid-cols-2 md:gap-12 reveal"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={`hidden md:block ${left ? "" : "md:order-2"}`}>
                  <div className={`${left ? "text-right pr-12" : "pl-12"}`}>
                    <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
                      {s.eyebrow}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-primary">{s.title}</h3>
                    <div className="mt-3 space-y-3">
                      {s.paragraphs.map((p, j) => (
                        <p key={j} className="text-muted-foreground leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`hidden md:block ${left ? "md:order-2" : ""}`} />
                <div className="absolute md:left-1/2 left-4 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold ring-4 ring-background" />

                {/* mobile */}
                <div className="md:hidden pl-12">
                  <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
                    {s.eyebrow}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-primary">{s.title}</h3>
                  <div className="mt-3 space-y-3">
                    {s.paragraphs.map((p, j) => (
                      <p key={j} className="text-muted-foreground leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
