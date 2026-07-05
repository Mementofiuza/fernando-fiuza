## Alterações de texto — Home e Rodapé

### 1) Página inicial (`src/routes/index.tsx`)
Na seção "INTRODUÇÃO", substituir o bloco de texto atual (título + dois parágrafos "Nascido em Belém..." / "Pesquisador, professor...") por:

> Prezados,
>
> Este é o Site do Dr. Fernando Augusto Fiuza de Melo († 10.07.2011), desenvolvido com muito amor, dedicação e admiração pelo nosso saudoso Dotôzinho.
>
> Aproveitem-no e usem-no livremente!
>
> **Família Fiuza de Melo**

Manter o kicker "Uma trajetória, um legado", a régua dourada, a foto lateral, o card "40+ anos" e o botão "Ler biografia completa".

### 2) Rodapé (`src/components/SiteFooter.tsx`)
Adicionar, acima da barra inferior de copyright, dois blocos de texto:

- **Créditos:** "Criado pelo sobrinho Marcelo Rocha de Sá (Jambu Tecnologia — Belém, PA) e Anisio Fernandes Bezerra da Silva; e por Margarida."
- **Aviso de uso:** "Neste site, estão disponibilizados, em acesso aberto, Artigos, Capítulos de livros, Crônicas e Cartas, Aulas e Palestras. Agradecemos a citação da autoria de Fernando Augusto Fiuza de Melo."

Na barra inferior, trocar o `©` por **Copyleft 🄯** (símbolo de copyright livre, U+1F12F), mantendo o ano e o nome do memorial.

### Observações
- Só mudanças de conteúdo/apresentação; sem alterações de rotas, dados ou lógica.
- Estilos existentes (tipografia serif, régua dourada, opacidades) reaproveitados para manter a identidade visual.
