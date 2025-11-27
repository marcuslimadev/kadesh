# Plano central de desenvolvimento - Kadesh
Data: 27/11/2025

## Contexto observado no codigo atual
- Deadline ainda usa coluna `projects.deadline` do tipo DATE; o frontend envia ISO com hora (CreateProject.vue) mas o backend guarda apenas a data e o scheduler fecha com base em `deadline < NOW()`.
- Cadastro sempre cria `users.type = 'client'`; enviar lances depende de `type === 'provider'`. O switch "ver como" so altera o modo visual (Pinia + localStorage) e nao sincroniza com o backend.
- Listagens de projetos/bids retornam `total = rowCount` (tamanho da pagina), sem `total` global ou `totalPages`; paginacao do frontend envia `page/per_page` mas a API entende `limit/offset`.
- Upload de anexos do projeto liberado para imagens/PDF ate 5MB (CreateProject.vue + projects.js); videos nao sao aceitos e nao ha gestao apos publicar.
- API base em `src/services/api.js` aponta para producao por default; guards do router nao validam JWT com o backend; wallet exposta a saques sincronizados sem workflow seguro (wallet.js).

## Backlog unificado (prioridade alta)
1) Autenticacao e perfis
   - Expor perfil ao cadastrar (ou suportar `type = 'unified'`) e permitir que prestadores enviem lances sem hack visual. Ajustar bids.js, auth.js, stores e migrations (`add_unified_type.sql`) para refletir o modelo final.
   - Proteger o guard do router com `verify` no backend e encapsular acessos a `localStorage` para evitar quebra em SSR/build.
2) Prazo com hora real
   - Migrar `projects.deadline` para `TIMESTAMPTZ` (ou coluna nova `deadline_at`), ajustar validators, criacao/edicao e o scheduler (`auctionScheduler` + `closeExpiredProjects`). Garantir que Lobby/ProjectDetail leem o timestamp completo e bloqueiam novos lances ao expirar.
3) Lances sem friccao
   - Remover limite minimo de 20 caracteres (backend validators + ProjectDetail.vue). Tornar a descricao opcional ou curta e manter apenas validacao de vazio.
   - Desenhar o fluxo de documentos obrigatorios do prestador (KYC/perfil) antes do primeiro lance caso seja requisito do cliente.
4) Paginacao e filtros consistentes
   - Padronizar `limit/offset/total/totalPages` em `/projects`, `/bids` e derivados; converter `page` -> `offset` no frontend. Adicionar `COUNT(*) OVER()` no backend.
   - Normalizar categorias: usar slugs unicos compartilhados por Home e Projects.
5) Uploads e midia
   - Confirmar suporte a video: liberar mimetypes (mp4, mov, avi) e `accept` no input; revisar limites e storage. Mostrar prints do fluxo atual de anexos para o cliente.
6) Regras de leilao e vencedor
   - Consolidar rotina de encerramento: scheduler marca vencedor (menor lance elegivel), cria/atualiza contrato e muda status para `closed/in_progress`; ProjectDetail bloqueia novos lances e exibe vencedor.
   - Lobby deve refletir estado: badge "Vencedor definido", contador para expirar, preview do menor lance e opcionalmente ultimos 3 lances.
7) Fluxos financeiros basicos
   - Revisar wallet: saques com workflow `pending -> processing -> completed`, bloqueio por saldo confirmado, registro de ordens e validacao antifraude.
   - Ajustar `DEFAULT_API_URL` para exigir `VITE_API_URL` em dev e evitar chamar producao sem querer.

## Backlog medio/baixa
- Gestao de anexos apos publicar (remover/substituir na pagina do projeto).
- Avaliacao/nota no Lobby apos contrato concluido (usar reviews existentes).
- Home.vue: revisar narrativa/CTA e alinhar com os prints da pasta `prints/`; destacar leiloes ativos.
- Testes E2E de fluxos principais (cadastro, criar projeto, enviar/aceitar lance, encerrar por prazo).

## Ordem sugerida de execucao
1) Hotfix rápidos: remover restricao de descricao do lance, alinhar auth/perfil para prestador, corrigir base URL e guard do router.
2) Migrar prazo para timestamp com hora e ajustar scheduler + UI (Lobby e ProjectDetail).
3) Padronizar paginacao/filtros e normalizar categorias.
4) Implementar vencedor automatico + sinalizacao no Lobby/ProjectDetail; bloquear novos lances apos encerramento.
5) Liberar uploads de video (se aprovado) e documentar com prints; iniciar desenho do fluxo de documentos do prestador.
6) Revisar Home e anexar novos prints para validacao do cliente.

### Notas
- Documentos antigos de status/plano foram arquivados em `docs/archive/` para evitar arquivos soltos.
- Registrar evidencias (prints/GIF) dos fluxos corrigidos para validacao rapida com o cliente.
