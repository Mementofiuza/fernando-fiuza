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

## Detalhes técnicos

- `src/routes/index.tsx`: remover bloco de CTAs do hero e o card "40+".
- `src/components/MuralHomenagens.tsx`: textos + `fetch` com `cache: 'no-store'` no client Supabase e refetch em `visibilitychange`; mesmo tratamento em `src/components/HomeHomenagensSlider.tsx`.
- `src/components/admin/AdminConteudo.tsx`: input `multiple`, upload sequencial em lotes de ~4 para o bucket `conteudo` / `homenagens-fotos` e inserção nas tabelas `documentos` / `galeria_imagens`.
- Nenhuma mudança de schema é necessária.
