# Auditoria de Produção – Kadesh

_Data: 2025-02-14_

## Visão Geral
- Frontend (Vue 3 + Pinia + Vite) entrega a camada visual solicitada, porém os fluxos críticos ainda dependem de ajustes estruturais (autenticação multiperfil, filtros e paginação) para funcionar no mundo real.
- Backend (Node.js + Express + PostgreSQL) cobre CRUDs principais, mas há inconsistências de contrato com o frontend, validações insuficientes e endpoints financeiros sem garantias mínimas.
- Abaixo está a lista priorizada do que precisa ser resolvido antes de liberar para produção.

## Itens Críticos (corrigir antes do go-live)
| ID | Área | Arquivo(s) | Problema | Impacto | Próxima ação |
| --- | --- | --- | --- | --- | --- |
| C1 | Conta/Perfil | `backend/routes/auth.js`, `backend/routes/bids.js`, `src/views/Register.vue`, `src/stores/viewModeStore.js` | O registro força `type='client'` e o backend exige `type='provider'` para enviar propostas. O switch “Ver como” é apenas visual e nunca sincroniza com o backend. Nenhum usuário recém-criado consegue publicar bids ou acessar rotas de provedor. | Marketplace inoperante para metade do público. | Expor a seleção de perfil no cadastro (ou permitir perfis múltiplos) e persistir o modo no backend (coluna `type` ou tabela linking). Atualizar `bids.js` para aceitar a nova estratégia e remover dependência do switch somente visual. |
| C2 | Projetos (lista) | `src/views/Projects.vue`, `src/services/projectService.js`, `backend/routes/projects.js` | O frontend envia `page`/`per_page` e espera `total_pages`, mas a API só entende `limit`/`offset` e devolve `total` = `rowCount` (apenas da página atual). Paginação e contagem ficam sempre em 1; filtros nunca avançam. | Usuários não conseguem navegar além dos primeiros itens, reduzindo drasticamente a chance de conversão. | Padronizar o contrato: backend deve expor `total` global + `limit` + `offset`, e o frontend deve converter `page → offset` e calcular `totalPages`. Criar endpoint `/api/projects/count` ou `COUNT(*) OVER()` para não usar `rowCount`. |
| C3 | Navegação entre categorias | `src/views/Home.vue`, `src/views/Projects.vue` | Home envia `category=desenvolvimento-web` (slug), enquanto o filtro em Projects espera rótulos como “Desenvolvimento Web”. Resultado: clicar em uma categoria leva a uma tela vazia. | Usuário perde o fluxo principal “Descobrir projetos por categoria”. | Normalizar categorias compartilhando a mesma fonte de dados (enum JSON/TS) e usar sempre slug → label. Ao carregar `/projects`, mapear `route.query.category` para o valor real e exibir o chip correspondente. |
| C4 | Fluxos financeiros | `backend/routes/wallet.js`, `backend/services/walletService.js` | Depósitos e saques são marcados como `completed` instantaneamente, sem integração com gateway ou validação antifraude. Qualquer usuário pode chamar `/wallet/withdraw` e subtrair saldo ilimitado (apenas consulta `getCurrentBalance`, que também usa o mesmo log). | Risco crítico de fraude/hack: basta manipular requests para esvaziar a carteira. | Introduzir verificação de identidade e workflow assíncrono (`pending` → `processing` → `completed`). Bloquear saques acima do saldo confirmado e registrar ordens em tabela própria vinculada a comprovantes bancários. |
| C5 | Autorização no router | `src/router/index.js`, `src/stores/auth.js` | O guard consulta apenas `localStorage` e não valida o JWT. Se o token expirar ou for removido do backend, a SPA continua liberando rotas sensíveis (wallet, contratos). | Violações de segurança e erros 401 em cascata nos componentes. | Invocar `authStore.verifyToken()` ao iniciar a rota e bloquear a navegação até a verificação resolver. Em paralelo, remover dependência direta de `localStorage` dentro do guard. |

## Itens de Alta Prioridade
| ID | Área | Arquivo(s) | Detalhes | Próxima ação |
| --- | --- | --- | --- | --- |
| H1 | Contracts/Bids | `backend/routes/projects.js`, `backend/routes/bids.js` | `rowCount` é usado como `total` em todas as listagens paginadas (projetos, bids, providers). Isso sempre retorna o tamanho da página, não o total real. | Usar `COUNT(*) OVER()` ou consultas separadas para `total`. Atualizar respostas para `{ items, pagination }`. |
| H2 | UX Filtros | `src/views/Projects.vue` | Filtros não são refletidos na URL após o usuário interagir; recarregar a página limpa a busca. | Atualizar `router.replace` com query consolidada e reaplicar filtros em `watch(route.query, ...)`. |
| H3 | Auth middleware | `backend/middleware/auth.js` | Qualquer erro inesperado devolve 500 em vez de 401, expondo stack trace no log e bloqueando usuários legítimos quando o token está inválido. | Retornar 401/403 padronizado para falhas de parsing/verify e reservar 500 apenas para erros internos reais. |
| H4 | API base | `src/services/api.js` | `DEFAULT_API_URL` aponta para produção (`https://kadesh-2.onrender.com`). Qualquer dev local envia requisições diretas ao ambiente produtivo. | Definir `.env` obrigatório (ex.: `.env.development`) e falhar explicitamente se não houver `VITE_API_URL` em modo dev. |
| H5 | ViewMode Store | `src/stores/viewModeStore.js`, `src/components/ViewModeSwitch.vue` | A store acessa `localStorage` no escopo do módulo e `ViewModeSwitch` usa `localStorage` dentro do `onMounted` sem verificar `window`. Isso quebra qualquer tentativa de SSR/hydration. | Encapsular o acesso em `if (typeof window !== 'undefined')`. |

## Itens de Média Prioridade
- **Home newsletter (src/views/Home.vue)**: dispara `toast?.success` mas não há desabilitação do botão ou validação básica; risco de spam indefinido.
- **CreateProject (src/views/CreateProject.vue)**: campos `skills_required` são enviados como array, mas o backend grava em coluna arbitrária (sem validar tipo JSON). Confirmar tipo da coluna e validar tamanho.
- **Wallet saldo (backend/routes/wallet.js)**: cálculo de `pending` mistura entradas e saídas, podendo gerar número negativo exibido como positivo. Ideal separar `pending_in`/`pending_out` na resposta.
- **Contracts disputes (backend/routes/contracts.js)**: rota `/dispute` grava uma mensagem onde `sender_id` e `receiver_id` são o mesmo usuário, impossibilitando notificação real. Ajustar para direcionar a um canal admin/moderação.
- **Admin guard**: rotas admin usam `localStorage.adminToken` sem expiração ou validação; replicar estratégia de verify semelhante ao guard principal.

## Plano de Ação Sugerido
1. **Semana 1**: corrigir C1–C3 (registro multiperfil, contrato de listagem e filtros). Reexecutar testes E2E para criação/descoberta/participação em projetos.
2. **Semana 2**: endereçar C4–C5 junto com H1/H3 (security hardening). Implementar migrações necessárias (novo campo/tabela para perfis e ordens de saque).
3. **Semana 3**: tratar backlog H2/H4/H5 e itens médios, revisando UX e estado compartilhado.
4. **Pré-go-live**: revisar documentação (`README.md`, `GUIA-DEPLOY*.md`) e adicionar roteiros de smoke-test cobrindo cadastro, criação de projeto, envio de bid, aceite, contrato, wallet e saques.

## Testes Recomendados
- Fluxo completo Cliente → Criação Projeto → Prestador envia bid → Cliente aceita → Contrato gerado → Entrega e aceite → Liberação financeira.
- Teste de regressão de filtros/paginação em `/projects` após alinhar contrato.
- Testes de segurança: tentar sacar valor sem saldo, chamar rotas protegidas com token expirado/verificação ausente.

_Com essas correções priorizadas, o produto fica alinhado ao escopo anunciado (marketplace com escrow) e preparado para um ciclo de homologação real._
