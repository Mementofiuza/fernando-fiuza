import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/linha-do-tempo")({
  head: () => ({
    meta: [
      { title: "Linha do Tempo — Dr. Fernando Fiuza" },
      { name: "description", content: "Marcos e conquistas da trajetória do Dr. Fernando Augusto Fiuza de Melo em ordem cronológica." },
      { property: "og:title", content: "Linha do Tempo" },
      { property: "og:description", content: "Marcos cronológicos de uma vida dedicada à medicina." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/linha-do-tempo" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/linha-do-tempo" }],
  }),
  component: Tempo,
});

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

function Tempo() {
  return (
    <PageShell
      eyebrow="Linha do Tempo"
      title="Marcos de uma trajetória."
      intro="Os principais momentos da vida pessoal, acadêmica e profissional do Dr. Fiuza."
    >
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
