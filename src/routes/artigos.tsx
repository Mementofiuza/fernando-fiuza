import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { DocsSection } from "@/components/DocsSection";

export const Route = createFileRoute("/artigos")({
  head: () => ({
    meta: [
      { title: "Artigos e Capítulos de livros — Dr. Fernando Fiuza" },
      { name: "description", content: "Artigos científicos e capítulos de livros publicados pelo Dr. Fernando Fiuza." },
      { property: "og:title", content: "Artigos e Capítulos de livros" },
      { property: "og:description", content: "Produção científica em pneumologia e tuberculose." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/artigos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/artigos" }],
  }),
  component: Artigos,
});

function Artigos() {
  return (
    <PageShell
      eyebrow="Artigos & Capítulos de livros"
      title="Produção científica publicada."
      intro="Artigos científicos e capítulos de livros do Dr. Fiuza em pneumologia, tuberculose e saúde pública."
    >
      <DocsSection secao="artigos" labelPlural="itens" />
    </PageShell>
  );
}
