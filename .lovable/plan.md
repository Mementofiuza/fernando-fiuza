## Objetivo
Adicionar as 4 fotos enviadas (Alter do Chão, Belém, São Paulo, Luanda) ao carrossel do hero da página inicial, sem que a diferença de proporção entre elas (algumas panorâmicas muito largas, outras normais) cause aquele efeito feio de "uma imagem grande e outra pequena".

## Diagnóstico
As imagens têm proporções muito diferentes:
- Alter do Chão → paisagem normal (~3:2)
- Belém → panorâmica larga (~3:1)
- São Paulo → super panorâmica (~4:1)
- Luanda → paisagem normal (~4:3)

Hoje o hero usa `object-cover` num container de altura fixa (`h-[92vh]`). Isso já força todas ao mesmo tamanho visual — o "problema" que aparece é que as panorâmicas ficam muito cortadas (perde-se o topo/base) e as normais ficam com zoom exagerado.

## Solução visual
Padronizar todas as 4 no mesmo enquadramento do hero, mas com tratamento para não parecerem cortadas nem desproporcionais:

1. **Upload via Lovable Assets** — subir as 4 imagens para o CDN (não pesa o repo) e substituir os slides atuais (`heroPortrait`, `heroResearch`, `heroAuditorium`) pelas novas.
2. **Container uniforme** — manter `h-[92vh]` + `object-cover` para que todas ocupem exatamente o mesmo espaço na tela.
3. **`object-position` por imagem** — definir o ponto focal ideal de cada uma para que o corte fique bonito:
   - Alter do Chão → `center`
   - Belém → `center` (mostra a orla)
   - São Paulo → `center bottom` (mantém skyline visível)
   - Luanda → `center` (baobá centralizado)
4. **Overlay/gradiente mantido** — o `gradient-hero` atual sobre a imagem já suaviza qualquer diferença de luz/contraste entre elas e uniformiza a leitura do texto por cima.
5. **Efeito Ken Burns mantido** — o zoom lento existente disfarça pequenas diferenças de enquadramento.
6. **Legendas coerentes** — atualizar `title`/`subtitle` de cada slide para refletir os lugares (Alter do Chão, Belém, São Paulo, Luanda) conectando-os à trajetória do Dr. Fiuza.

## Arquivos afetados
- `src/assets/` → 4 novos `.asset.json` (via `lovable-assets create`)
- `src/routes/index.tsx` → trocar imports dos slides, adicionar campo `position` no array `slides` e aplicar `style={{ objectPosition: s.position }}` no `<img>`

## Perguntas rápidas
1. Você quer **substituir** os 3 slides atuais pelas 4 novas fotos, ou **adicionar** as 4 mantendo as antigas (ficariam 7 no total)?
2. Os textos (`title` + `subtitle`) de cada slide devo escrever ligando cada cidade à trajetória do Dr. Fiuza (Belém = nascimento, São Paulo = Instituto Clemente Ferreira, etc.), ou você prefere me passar os textos?
