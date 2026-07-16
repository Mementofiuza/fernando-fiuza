## Objetivo

Adicionar a imagem enviada como marca d'água global no fundo de todas as páginas, mantendo o verde visível (a pedido da cliente), mas de forma extremamente sutil, sem prejudicar leitura nem quebrar o clima memorial.

## Como vai ficar

- A imagem aparece fixa na tela (não rola com o scroll) cobrindo todo o fundo do site.
- Opacidade muito baixa (~6–8%) — presente como textura, não como imagem em destaque.
- Blur leve adicional (~2px) para suavizar os blocos geométricos e evitar competição visual com o conteúdo.
- Fica **abaixo** dos gradientes suaves atuais (dourado + azul), que continuam existindo por cima — isso ajuda o verde a se integrar ao restante da paleta em vez de brigar com ela.
- Fundo continua `fixed`, então não bugará em scroll longo nem em mobile.

## Passos

1. Subir a imagem enviada para o CDN via `lovable-assets` e gerar `src/assets/bg-texture.jpg.asset.json`.
2. Editar `src/styles.css`:
   - No `body`, adicionar a imagem como camada de fundo mais baixa, com `background-size: cover`, `background-position: center`, `background-attachment: fixed`.
   - Aplicar a imagem via um pseudo-elemento `body::before` fixo em tela cheia com `opacity: 0.07` e `filter: blur(2px)`, `z-index: -1`, para não afetar contraste do texto nem interferir em cliques.
   - Manter os dois gradientes radiais atuais (dourado + azul) por cima, para amarrar o verde à paleta memorial.
3. Verificar que:
   - Cards com `bg-card` (brancos) continuam legíveis por cima do fundo.
   - Header e footer não ficam com listras estranhas.
   - Mobile: `background-attachment: fixed` em iOS pode piscar — usar `scroll` no breakpoint mobile via `@media` como fallback.

## Detalhes técnicos

- Arquivo alterado: `src/styles.css` (bloco `body` e novo `body::before`).
- Arquivo criado: `src/assets/bg-texture.jpg.asset.json` (pointer CDN).
- Sem mudança em componentes ou rotas — é puramente CSS global.
- Sem impacto em SEO, acessibilidade (a imagem é decorativa, não é `<img>`).

## Vai ficar bom?

Sinceramente: **com opacidade ~7% + blur + os gradientes atuais por cima, sim** — a imagem some visualmente e vira só uma textura sutil. Se depois da implementação achar que ainda aparece demais (ou de menos), é ajuste de um número só (`opacity`). Posso deixar preparado para você validar e afinar em seguida.
