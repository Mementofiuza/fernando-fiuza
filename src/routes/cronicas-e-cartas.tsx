import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { DocsSection } from "@/components/DocsSection";

export const Route = createFileRoute("/cronicas-e-cartas")({
  head: () => ({
    meta: [
      { title: "Crônicas e Cartas — Dr. Fernando Fiuza" },
      { name: "description", content: "Crônicas, cartas e textos pessoais escritos pelo Dr. Fernando Fiuza." },
      { property: "og:title", content: "Crônicas e Cartas" },
      { property: "og:description", content: "Textos literários e correspondências." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/cronicas-e-cartas" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/cronicas-e-cartas" }],
  }),
  component: CronicasCartas,
});

function CronicasCartas() {
  return (
    <PageShell
      eyebrow="Crônicas & Cartas"
      title="A palavra como extensão do cuidado."
      intro="Crônicas, cartas e textos pessoais que revelam o lado humano e literário do Dr. Fiuza."
    >
      <DocsSection secao="cronicas" labelPlural="textos" />
    </PageShell>
  );
}
