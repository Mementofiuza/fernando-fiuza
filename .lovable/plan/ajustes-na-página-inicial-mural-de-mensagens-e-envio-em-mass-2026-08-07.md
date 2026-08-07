# Ajustes na página inicial, mural de mensagens e envio em massa

## 1. Página inicial

- Remover os dois botões sobre os slides ("Conheça sua trajetória" e "Artigos e Capítulos").
- Remover a caixinha "40+ / Anos de medicina" sobreposta à fotografia.

## 2. Página Mensagens & Homenagens

Trocar os textos:

- "Homenagens do público" → "Homenagem dos leitores deste site"
- "Escreva uma memória, um agradecimento ou uma palavra em honra ao Dr. Fernando. Se desejar, envie também uma fotografia." → "Escreva uma mensagem. Se desejar, envie também uma fotografia"
- "Compartilhe uma homenagem" → "Compartilhe uma mensagem"

## 3. Mensagem aprovada não aparece no seu navegador

Verificações feitas agora: as permissões da tabela estão corretas tanto para visitantes quanto para usuários logados, e a sua mensagem de teste já consta como **aprovada** no banco. Ou seja, o dado está certo — a falha está na entrega ao navegador. Ainda não confirmei a causa exata, então:

1. **Diagnóstico**: abrir a página (logado e deslogado) e conferir a resposta que o navegador recebe. Isso mostra se é cache do navegador/CDN ou outro filtro.
2. **Correção** (aplicada de qualquer forma, pois cobre o cenário mais provável):
   - Buscar as mensagens aprovadas sempre "sem cache", para o navegador nunca reaproveitar uma resposta antiga.
   - Reconsultar a lista automaticamente quando a aba volta ao foco.
   - No painel de admin, após aprovar, forçar a atualização das listas públicas.

Se o diagnóstico apontar outra causa, corrijo essa causa antes de encerrar.


## 4. Envio de 30+ fotos e 40+ PDFs

Adicionar **envio em lote** no painel de admin:

- Selecionar vários arquivos de uma vez (ou arrastar e soltar) em Galeria e em cada seção de documentos.
- Barra de progresso com contagem ("12 de 40 enviados") e lista de erros, se houver.
- Título preenchido automaticamente a partir do nome do arquivo (ex.: `Tuberculose_2003.pdf` → "Tuberculose 2003"), podendo ser editado depois na lista.
- Ordem atribuída automaticamente, na sequência dos itens já existentes.
- Envio em pequenos grupos, para não travar em conexões lentas.

Recomendação: nomeie os arquivos antes de enviar (ex.: `2003 - Título do artigo.pdf`), assim os títulos já saem prontos.

## 5. Reordenar arrastando no painel

Em Artigos, Aulas, Crônicas e Galeria: arrastar e soltar cada item para a posição desejada.

- Alça de arraste visível em cada linha/cartão; ao soltar, a nova ordem é gravada automaticamente.
- Funciona também no celular (toque e arraste).
- O campo numérico "Ordem" some da tela — a ordem passa a ser definida só pelo arraste.

## 6. Fundo verde mais visível

- Aumentar a presença da marca-d'água verde (opacidade maior, menos desfoque) e dar a ela um leve tom verde nas camadas de fundo.
- Ajustar os textos e cartões para manter a leitura confortável: cartões com fundo um pouco mais opaco e títulos/textos com contraste reforçado sobre o novo fundo.
- Conferir em telas claras e no celular para não "sujar" a leitura.

## Detalhes técnicos

- `src/routes/index.tsx`: remover bloco de CTAs do hero e o card "40+".
- `src/components/MuralHomenagens.tsx`: textos + leitura sem cache e refetch em `visibilitychange`; mesmo tratamento em `src/components/HomeHomenagensSlider.tsx`.
- `src/components/admin/AdminConteudo.tsx`: input `multiple` com upload em lotes de ~4 para o bucket `conteudo`, inserção em `documentos` / `galeria_imagens`, e reordenação com `@dnd-kit/core` + `@dnd-kit/sortable` persistindo o campo `ordem` em lote.
- `src/styles.css`: ajustar `body::before` (opacidade/blur/tom) e tokens de `--card` / `--muted-foreground` para contraste.
- Nenhuma mudança de schema é necessária.

