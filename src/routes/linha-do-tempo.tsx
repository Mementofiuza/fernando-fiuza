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

const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: "Nascimento",
    paragraphs: [
      "Nasceu em Belém do Pará no dia 24 do mês de abril de 1945 e como dizia \u201Csou touro, veado e filho de guerra\u201D, em uma família de raízes amazônicas.",
    ],
  },
  {
    title: "Formação profissional",
    paragraphs: [
      "Fernando Augusto Fiuza de Melo possuía experiência em Pneumologia, atuando principalmente nas seguintes áreas: Tuberculose, Pneumologia e AIDS. Possuía Graduação em Medicina pela Universidade Federal do Pará (1968); Especialização em Pneumologia pela Universidade Federal de São Paulo (1976); Especialização em Administração Hospitalar e de Sistema de Saúde pela Fundação Getúlio Vargas de São Paulo (1985) e Doutorado em Medicina (Pneumologia) pela Universidade Federal de São Paulo (1997).",
    ],
  },
  {
    title: "Atuação profissional",
    paragraphs: [
      "Médico aprovado em Concursos Públicos do Instituto de Assistência Médica ao Servidor Público Estadual (1979-2011) e do Instituto Clemente Ferreira (1976-2011).",
      "Atuou como: Diretor Clínico do Complexo Hospitalar do Mandaqui (1983-1989), Consultor Técnico do Ministério da Saúde da República de Angola (2008-2009), Consultor Técnico do Ministério da Saúde (2003-2011), e como Diretor Técnico de Departamento do Instituto Clemente Ferreira (2004-2011).",
    ],
  },
  {
    title: "Formação de recursos humanos",
    paragraphs: [
      "Co-orientou, extraoficialmente, quatro Dissertações de Mestrado (de 2002 a 2005) e duas Teses de Doutorado (2009), junto ao Departamento de Microbiologia do Instituto de Ciências Biomédicas da Universidade de São Paulo. Participou de mais de 40 Bancas Examinadoras de diferentes níveis.",
    ],
  },
  {
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
      <div className="relative max-w-3xl">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0" />
        <div className="space-y-14">
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="relative pl-12 reveal"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="absolute left-4 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold ring-4 ring-background" />
              <h2 className="font-serif text-2xl md:text-3xl text-primary">{s.title}</h2>
              <div className="gold-rule-left mt-3" />
              <div className="mt-4 space-y-4">
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
