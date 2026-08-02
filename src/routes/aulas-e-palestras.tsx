import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { DocsSection } from "@/components/DocsSection";

export const Route = createFileRoute("/aulas-e-palestras")({
  head: () => ({
    meta: [
      { title: "Aulas e Palestras — Dr. Fernando Fiuza" },
      { name: "description", content: "Aulas, palestras e materiais didáticos elaborados pelo Dr. Fernando Fiuza." },
      { property: "og:title", content: "Aulas e Palestras" },
      { property: "og:description", content: "Materiais didáticos e apresentações." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/aulas-e-palestras" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/aulas-e-palestras" }],
  }),
  component: AulasPalestras,
});

function AulasPalestras() {
  return (
    <PageShell
      eyebrow="Aulas & Palestras"
      title="Ensinar foi parte de sua medicina."
      intro="Aulas, palestras e apresentações elaboradas pelo Dr. Fiuza para a formação de novas gerações de profissionais."
    >
      <DocsSection secao="aulas" labelPlural="itens" />
    </PageShell>
  );
}
