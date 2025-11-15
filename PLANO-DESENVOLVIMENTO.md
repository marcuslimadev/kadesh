# 🚀 PLANO DE DESENVOLVIMENTO - KADESH MARKETPLACE
**Migração do Sistema Legacy (jQuery/PHP) → Stack Moderna (Vue 3 + Render/Vercel)**

**Data:** 15/11/2025  
**Versão Atual:** 2.0.0 (Estrutura base moderna criada)  
**Status:** 🟡 Fase 1 concluída - Frontend base implantado

---

## 📊 ANÁLISE DO SISTEMA LEGADO

### ✅ O que JÁ estava implementado no sistema antigo:

#### **1. INFRAESTRUTURA DE BANCO** (100% completo)
- ✅ 20 migrations SQL executadas
- ✅ Sistema KYC completo (documentos, certificações, bank accounts)
- ✅ Sistema de leilão reverso (auction_config, bids, bid_history)
- ✅ Wallet e Escrow (transactions, holds, releases)
- ✅ Disputas e mediação (disputes, dispute_messages, resolutions)
- ✅ Notificações e timeline (notifications, project_events, audit_logs)
- ✅ Reviews multidimensional (quality, communication, deadline)
- ✅ Provider profiles e portfolios
- ✅ Sistema de pagamentos Mercado Pago (payments table, webhooks)
- ✅ Painel admin completo (admin_users, system_settings)

#### **2. BACKEND PHP** (70% implementado)
**Arquivo:** `old/backend.php` (1.815 linhas)

**Endpoints Funcionais:**
- ✅ Auth: `/api/register`, `/api/login`, `/api/logout`, `/api/forgot-password`
- ✅ Projetos: CRUD completo + `/api/projects/{id}/bids`, `/api/projects/{id}/accept-bid`
- ✅ Bids: `/api/bids` (create), cálculo de score (70% preço + 30% reputação)
- ✅ Leilões: `/api/auctions/active`, `/api/auctions/{id}`, `/api/projects/{id}/confirm-winner`
- ✅ Dashboard: `/api/dashboard/stats` (estatísticas gerais)
- ✅ Escrow: `/api/projects/{id}/milestones`, `/api/milestones/{id}/fund`, `/api/milestones/{id}/release`
- ✅ Wallet: `/api/wallet/balance`, `/api/wallet/transactions`
- ✅ Disputas: `/api/projects/{id}/disputes`, `/api/disputes/{id}`, `/api/disputes/{id}/messages`
- ✅ KYC: `/api/kyc/upload` (documentos)
- ✅ Reviews: `/api/reviews`, `/api/users/{id}/reviews`
- ✅ Notificações: `/api/notifications`

**Endpoints Stub (não implementados):**
- 🟡 Provider: `/api/providers/{id}/profile`, `/api/profile` (update), `/api/portfolio/upload`
- 🟡 Pagamentos: `/api/projects/{id}/payment`, `/api/webhooks/mercadopago`
- 🟡 Conclusão: `/api/projects/{id}/complete`

**Arquivos Backend Especializados:**
- `backend-provider.php` (363 linhas) - Perfis e portfolios
- `backend-reviews.php` (294 linhas) - Sistema de avaliações
- `backend-admin.php` (402 linhas) - Painel admin
- `MercadoPago.php` (170 linhas) - Helper class MP

#### **3. FRONTEND LEGADO** (jQuery - 50% completo)
**Localização:** `old/public/jquery-frontend/`

**Páginas Implementadas:**
- ✅ `index.html` - Landing page
- ✅ `login.html`, `register.html` - Autenticação
- ✅ `dashboard.html` - Dashboard geral
- ✅ `create-project.html` - Criar projeto
- ✅ `project-details.html` - Detalhes + leilão
- ✅ `admin-dashboard.html`, `admin-users.html`, `admin-projects.html`, `admin-settings.html` - Admin

**Funcionalidades jQuery:**
- ✅ Formulários de login/registro com validação
- ✅ Dashboard com estatísticas (cards animados)
- ✅ Criação de projetos (form multi-step)
- ✅ Visualização de detalhes (timeline, bids)
- ✅ Painel admin (tables, filters, paginação)

---

## 🎯 ESTADO ATUAL DO SISTEMA NOVO

### ✅ O que JÁ foi migrado (Fase 1):

#### **Frontend Vue 3**
- ✅ Estrutura Vite + Vue Router + Pinia
- ✅ Tailwind CSS + PostCSS pipeline configurado
- ✅ Componentes base: `NavBar.vue`, `Footer.vue`
- ✅ **Home.vue** - Landing page completa com design legado (hero, categorias, projetos, newsletter)
- ✅ Views stub: `Login.vue`, `Register.vue`, `Dashboard.vue`, `Projects.vue`, `CreateProject.vue`, `ProjectDetail.vue`, `MyProjects.vue`, `MyBids.vue`, `Wallet.vue`, `ProviderProfile.vue`, `Notifications.vue`
- ✅ Auth store (Pinia) com login/logout
- ✅ API service (Axios) com interceptors, fallback para backend produção
- ✅ Toast notifications (vue-toastification)
- ✅ Assets legados importados (`public/assets/images/`)

#### **Infraestrutura**
- ✅ Repositório GitHub (`marcuslimadev/kadesh`)
- ✅ Deploy Vercel configurado (frontend em `https://kadesh-seven.vercel.app`)
- ✅ Backend Render preparado (`https://kadesh-backend.onrender.com`)
- ✅ Build otimizado (Terser, chunks separados: vue, ui, utils)
- ✅ Env vars configuradas (`.env.production.frontend`, `.env.production`)

### ❌ O que FALTA implementar:

#### **1. Views Funcionais (Prioridade ALTA)**
Todas as views estão criadas mas mostram apenas placeholder "Em desenvolvimento...":

**Autenticação:**
- 🔴 `Login.vue` - Formulário funcional + validação + integração auth store
- 🔴 `Register.vue` - Form multi-step (dados pessoais, tipo de conta, termos)

**Dashboard:**
- 🔴 `Dashboard.vue` - Cards de estatísticas, projetos recentes, notificações
- 🔴 `MyProjects.vue` - Lista com filtros (status, categoria), paginação
- 🔴 `MyBids.vue` - Propostas enviadas, status, timeline

**Projetos:**
- 🔴 `Projects.vue` - Marketplace com filtros, busca, paginação
- 🔴 `CreateProject.vue` - Form completo (título, descrição, orçamento, prazo, anexos)
- 🔴 `ProjectDetail.vue` - Visualização completa, sistema de leilão, bids, timeline, chat

**Fornecedor:**
- 🔴 `ProviderProfile.vue` - Perfil público, portfólio (galeria de imagens), reviews, estatísticas

**Financeiro:**
- 🔴 `Wallet.vue` - Saldo, transações, escrow, saques, depósitos

**Comunicação:**
- 🔴 `Notifications.vue` - Lista de notificações, marcar como lida, filtros

#### **2. Componentes Reutilizáveis (Prioridade MÉDIA)**
- 🟡 `ProjectCard.vue` - Card de projeto (reusável em Home, Projects, Dashboard)
- 🟡 `BidCard.vue` - Card de proposta
- 🟡 `UserAvatar.vue` - Avatar com fallback, badge de verificação
- 🟡 `StatusBadge.vue` - Badge de status (projeto, pagamento, etc)
- 🟡 `ProgressBar.vue` - Barra de progresso (projeto, milestones)
- 🟡 `FileUpload.vue` - Component drag-drop para uploads
- 🟡 `Modal.vue` - Modal genérico (confirmações, forms)
- 🟡 `Pagination.vue` - Paginação reutilizável
- 🟡 `EmptyState.vue` - Estado vazio (sem projetos, sem bids, etc)
- 🟡 `LoadingSpinner.vue` - Loading states

#### **3. Services e Stores (Prioridade ALTA)**
**Services:**
- 🔴 `projectService.js` - CRUD projetos, filtros, busca
- 🔴 `bidService.js` - Criar bid, listar, aceitar
- 🔴 `auctionService.js` - Leilões ativos, detalhes, countdown
- 🔴 `walletService.js` - Balance, transações, escrow
- 🔴 `paymentService.js` - Mercado Pago integration
- 🔴 `notificationService.js` - CRUD notificações, mark as read
- 🔴 `uploadService.js` - Upload de arquivos (projetos, portfolios, documentos)

**Stores (Pinia):**
- 🔴 `projectStore.js` - Estado global de projetos, cache
- 🔴 `bidStore.js` - Propostas do usuário
- 🔴 `walletStore.js` - Saldo, transações em tempo real
- 🔴 `notificationStore.js` - Notificações não lidas, contador

#### **4. Backend API (Prioridade CRÍTICA)**
**Opção A:** Migrar backend PHP legado para Node.js/Express (mais trabalhoso)  
**Opção B:** Adaptar backend PHP legado para funcionar com Render (mais rápido)

**Endpoints que DEVEM funcionar primeiro (MVP):**
- 🔴 `POST /api/register` - Cadastro
- 🔴 `POST /api/login` - Login
- 🔴 `GET /api/user` - Dados do usuário autenticado
- 🔴 `GET /api/projects` - Listar projetos (filtros, paginação)
- 🔴 `POST /api/projects` - Criar projeto
- 🔴 `GET /api/projects/:id` - Detalhes do projeto
- 🔴 `POST /api/projects/:id/bids` - Criar proposta
- 🔴 `GET /api/projects/:id/bids` - Listar propostas
- 🔴 `POST /api/projects/:id/accept-bid` - Aceitar proposta
- 🔴 `GET /api/dashboard/stats` - Estatísticas do dashboard
- 🔴 `GET /api/wallet/balance` - Saldo da carteira
- 🔴 `GET /api/notifications` - Notificações

**Endpoints Secundários (Fase 2):**
- 🟡 Escrow/Milestones
- 🟡 Disputas
- 🟡 Reviews
- 🟡 Provider profiles
- 🟡 Painel admin
- 🟡 KYC
- 🟡 Pagamentos Mercado Pago

#### **5. Funcionalidades Avançadas (Prioridade BAIXA)**
- 🟡 Sistema de chat em tempo real (Socket.io ou Pusher)
- 🟡 Upload de múltiplos arquivos com preview
- 🟡 Notificações push (Service Workers)
- 🟡 Sistema de reputação e badges
- 🟡 Analytics e métricas
- 🟡 Suporte a múltiplos idiomas (i18n)
- 🟡 Dark mode
- 🟡 PWA (Progressive Web App)

---

## 📅 CRONOGRAMA DE DESENVOLVIMENTO

### **FASE 1: MVP FUNCIONAL** (2-3 semanas) ✅ 20% COMPLETO

#### Semana 1: Auth + Projetos Básicos
**Objetivo:** Usuário consegue se cadastrar, logar, criar e visualizar projetos.

**Backend:**
- [ ] Configurar servidor Node.js/Express no Render **OU** adaptar PHP legado
- [ ] Implementar endpoints de auth (`/register`, `/login`, `/user`)
- [ ] Implementar CRUD de projetos (`/projects`, `/projects/:id`)
- [ ] Configurar CORS e variáveis de ambiente
- [ ] Testar endpoints via Postman/Insomnia

**Frontend:**
- [ ] Implementar `Login.vue` (form + validação + integração auth store)
- [ ] Implementar `Register.vue` (form multi-step + validação)
- [ ] Implementar `Projects.vue` (listagem + filtros + paginação)
- [ ] Implementar `CreateProject.vue` (form completo + upload de anexos)
- [ ] Implementar `ProjectDetail.vue` (visualização básica)
- [ ] Criar `projectService.js` e `projectStore.js`
- [ ] Criar componentes: `ProjectCard.vue`, `StatusBadge.vue`, `Pagination.vue`

**Testes:**
- [ ] Fluxo completo: cadastro → login → criar projeto → visualizar projeto
- [ ] Testar responsividade mobile
- [ ] Validar erros e loading states

---

#### Semana 2: Sistema de Leilão + Bids
**Objetivo:** Fornecedores conseguem fazer propostas, contratantes aceitam.

**Backend:**
- [ ] Implementar `/api/projects/:id/bids` (criar proposta)
- [ ] Implementar `/api/projects/:id/bids` (listar propostas)
- [ ] Implementar `/api/projects/:id/accept-bid` (aceitar proposta)
- [ ] Implementar cálculo de score (70% preço + 30% reputação)
- [ ] Configurar soft close (extensão automática de 2min)

**Frontend:**
- [ ] Adicionar seção de leilão em `ProjectDetail.vue`:
  - Timer countdown
  - Lista de propostas ordenadas por score
  - Form de criar proposta
  - Botão de aceitar proposta (apenas contratante)
- [ ] Implementar `MyBids.vue` (propostas enviadas pelo usuário)
- [ ] Criar `bidService.js` e `bidStore.js`
- [ ] Criar `BidCard.vue` component
- [ ] Implementar notificações toast (nova proposta, proposta aceita)

**Testes:**
- [ ] Fluxo: contratante cria projeto → fornecedor vê projeto → fornecedor envia proposta → contratante aceita proposta
- [ ] Validar timer e soft close
- [ ] Testar cálculo de score

---

#### Semana 3: Dashboard + Wallet Básico
**Objetivo:** Usuário vê resumo de atividades e saldo da carteira.

**Backend:**
- [ ] Implementar `/api/dashboard/stats` (projetos criados, propostas recebidas, projetos ganhos, etc)
- [ ] Implementar `/api/wallet/balance` (saldo disponível, em escrow, pendente)
- [ ] Implementar `/api/wallet/transactions` (histórico de transações)

**Frontend:**
- [ ] Implementar `Dashboard.vue`:
  - Cards de estatísticas
  - Projetos recentes
  - Notificações recentes
  - Atalhos rápidos
- [ ] Implementar `Wallet.vue`:
  - Card de saldo
  - Lista de transações
  - Filtros (tipo, data)
- [ ] Implementar `Notifications.vue` (lista de notificações + mark as read)
- [ ] Criar `walletService.js`, `walletStore.js`, `notificationService.js`, `notificationStore.js`
- [ ] Criar componentes: `EmptyState.vue`, `LoadingSpinner.vue`

**Testes:**
- [ ] Validar cálculo de estatísticas
- [ ] Testar paginação de transações
- [ ] Verificar atualização em tempo real de notificações

---

### **FASE 2: FUNCIONALIDADES AVANÇADAS** (2-3 semanas) 🔴 0% COMPLETO

#### Semana 4: Escrow + Milestones
**Objetivo:** Sistema de pagamentos seguro com liberação por etapas.

**Backend:**
- [ ] Implementar `/api/projects/:id/milestones` (criar milestones)
- [ ] Implementar `/api/milestones/:id/fund` (bloquear valor em escrow)
- [ ] Implementar `/api/milestones/:id/release` (liberar pagamento)
- [ ] Integrar com Mercado Pago:
  - Criar preferência de pagamento
  - Processar webhook
  - Calcular taxas da plataforma (1%)

**Frontend:**
- [ ] Adicionar seção de milestones em `ProjectDetail.vue`
- [ ] Modal de criar milestone
- [ ] Timeline de progresso
- [ ] Botões de fundear/liberar milestone
- [ ] Integração com checkout Mercado Pago

**Testes:**
- [ ] Fluxo: criar milestone → fundear → marcar como completo → liberar pagamento
- [ ] Validar cálculo de taxas
- [ ] Testar webhook do Mercado Pago

---

#### Semana 5: Provider Profiles + Reviews
**Objetivo:** Fornecedores têm perfil público com portfólio e avaliações.

**Backend:**
- [ ] Implementar `/api/providers/:id/profile` (perfil público)
- [ ] Implementar `/api/profile` (atualizar perfil próprio)
- [ ] Implementar `/api/portfolio/upload` (upload de imagens)
- [ ] Implementar `/api/reviews` (criar avaliação)
- [ ] Implementar `/api/providers/:id/reviews` (listar avaliações)
- [ ] Recalcular estatísticas do fornecedor (rating médio, total de projetos)

**Frontend:**
- [ ] Implementar `ProviderProfile.vue`:
  - Cabeçalho com avatar, nome, rating
  - Galeria de portfólio (lightbox)
  - Lista de reviews com filtros
  - Estatísticas (projetos completos, taxa de sucesso)
- [ ] Modal de criar review (após conclusão de projeto)
- [ ] Componente `FileUpload.vue` (drag-drop para portfólio)
- [ ] Criar `providerService.js`

**Testes:**
- [ ] Upload de múltiplas imagens
- [ ] Validar cálculo de rating médio
- [ ] Verificar ordenação de reviews (mais úteis primeiro)

---

#### Semana 6: Disputas + Painel Admin
**Objetivo:** Sistema de resolução de conflitos e administração da plataforma.

**Backend:**
- [ ] Implementar `/api/projects/:id/disputes` (abrir disputa)
- [ ] Implementar `/api/disputes/:id` (detalhes da disputa)
- [ ] Implementar `/api/disputes/:id/messages` (mensagens da disputa)
- [ ] Implementar endpoints de admin:
  - `/api/admin/stats` (estatísticas gerais)
  - `/api/admin/users` (listar/editar usuários)
  - `/api/admin/projects` (listar/moderar projetos)
  - `/api/admin/settings` (configurações do sistema)

**Frontend:**
- [ ] Implementar sistema de disputas em `ProjectDetail.vue`
- [ ] Modal de abrir disputa
- [ ] Chat de disputa (admin pode intervir)
- [ ] Criar views de admin:
  - `AdminDashboard.vue`
  - `AdminUsers.vue`
  - `AdminProjects.vue`
  - `AdminSettings.vue`
- [ ] Middleware de rota para admin

**Testes:**
- [ ] Fluxo de disputa: abrir → enviar mensagens → admin resolve
- [ ] Validar permissões de admin
- [ ] Testar configurações dinâmicas (taxas, limites)

---

### **FASE 3: POLISH & OTIMIZAÇÃO** (1-2 semanas) 🔴 0% COMPLETO

#### Semana 7: UX/UI Refinements
- [ ] Animações e transições suaves
- [ ] Loading states em todos os componentes
- [ ] Error boundaries e fallbacks
- [ ] Skeleton screens
- [ ] Tooltips e help texts
- [ ] Formulários com feedback visual
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Testes de usabilidade

#### Semana 8: Performance & SEO
- [ ] Code splitting e lazy loading
- [ ] Image optimization (WebP, lazy loading)
- [ ] Meta tags dinâmicas (vue-meta ou Unhead)
- [ ] Sitemap e robots.txt
- [ ] Analytics (Google Analytics ou Plausible)
- [ ] Lighthouse audit (score 90+)
- [ ] Cache strategies
- [ ] CDN para assets estáticos

---

### **FASE 4: FUNCIONALIDADES OPCIONAIS** (Backlog) 🟡

- [ ] Sistema de chat em tempo real (Socket.io)
- [ ] Notificações push (Service Workers)
- [ ] Suporte a múltiplos idiomas (vue-i18n)
- [ ] Dark mode
- [ ] PWA (offline support)
- [ ] Sistema de badges e reputação
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Integração com WhatsApp Business
- [ ] Sistema de referral (indique e ganhe)
- [ ] Testes E2E com Playwright
- [ ] CI/CD pipeline (GitHub Actions)

---

## 🎯 MÉTRICAS DE SUCESSO

### **MVP Pronto (Fase 1):**
- ✅ Usuário consegue se cadastrar e fazer login
- ✅ Contratante pode criar projeto
- ✅ Fornecedor pode fazer proposta
- ✅ Contratante pode aceitar proposta
- ✅ Dashboard mostra estatísticas básicas
- ✅ Wallet mostra saldo e transações
- ✅ Sistema responsivo (mobile + desktop)
- ✅ Deploy em produção (Vercel + Render)

### **Sistema Completo (Fase 2 + 3):**
- ✅ Sistema de escrow funcionando
- ✅ Integração Mercado Pago completa
- ✅ Provider profiles com portfólio
- ✅ Sistema de reviews multidimensional
- ✅ Disputas e mediação
- ✅ Painel admin funcional
- ✅ Notificações em tempo real
- ✅ Performance (Lighthouse 90+)
- ✅ Testes E2E (80%+ coverage)

---

## 🛠️ STACK TECNOLÓGICA

### **Frontend:**
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (state management)
- Tailwind CSS
- Axios
- vue-toastification
- @heroicons/vue
- @headlessui/vue
- date-fns
- vee-validate + yup

### **Backend:**
- Node.js + Express **OU** PHP 8.1+
- PostgreSQL (via Render)
- Mercado Pago SDK
- JWT authentication
- bcrypt
- CORS

### **DevOps:**
- Vercel (frontend)
- Render (backend + database)
- GitHub (repositório)
- Vite (build tool)
- ESLint + Prettier

---

## 📝 NOTAS IMPORTANTES

### **Decisões Arquiteturais:**
1. **Backend:** Avaliar se vale migrar PHP legado para Node.js ou adaptar backend PHP para Render. **Recomendação:** Adaptar PHP (mais rápido, menos risco).
2. **Banco de Dados:** Usar PostgreSQL no Render (já criado: `kadesh_modern`). Migrar schema das 20 migrations SQL legadas.
3. **Pagamentos:** Iniciar com sandbox do Mercado Pago, migrar para produção após testes.
4. **Real-time:** Avaliar necessidade de WebSockets (Socket.io) vs polling para notificações.
5. **Uploads:** Configurar storage no Render (`/tmp/uploads` ou S3-compatible).

### **Riscos e Mitigações:**
- **Risco:** Backend PHP legado não funciona no Render.  
  **Mitigação:** Testar deploy PHP simples no Render antes de migrar todo o código.
- **Risco:** Integração Mercado Pago falha em produção.  
  **Mitigação:** Usar sandbox extensivamente, validar webhook com ngrok local.
- **Risco:** Performance ruim com banco PostgreSQL free tier.  
  **Mitigação:** Implementar cache em memória (Redis futuro), otimizar queries.

### **Priorização:**
- **Crítico (fazer primeiro):** Auth, projetos, bids, dashboard básico.
- **Alto:** Escrow, Mercado Pago, provider profiles.
- **Médio:** Disputas, admin, reviews.
- **Baixo:** Chat real-time, PWA, i18n.

---

## 🚦 PRÓXIMOS PASSOS IMEDIATOS

1. **Configurar Backend no Render:**
   - [ ] Criar Web Service no Render (Node.js ou PHP)
   - [ ] Conectar ao banco PostgreSQL `kadesh_modern`
   - [ ] Importar schema das migrations SQL legadas
   - [ ] Testar endpoint `/health` e `/api/register`
   - [ ] Configurar variáveis de ambiente (JWT_SECRET, DB credentials, etc)

2. **Implementar Login e Register:**
   - [ ] Criar `Login.vue` funcional
   - [ ] Criar `Register.vue` funcional
   - [ ] Testar fluxo completo de autenticação
   - [ ] Validar persistência de sessão (localStorage + Pinia)

3. **Implementar Listagem de Projetos:**
   - [ ] Criar `projectService.js` com método `getProjects(filters, page)`
   - [ ] Implementar `Projects.vue` com filtros e paginação
   - [ ] Criar `ProjectCard.vue` component
   - [ ] Testar carregamento e filtros

4. **Deploy e Validação:**
   - [ ] Push para GitHub
   - [ ] Verificar deploy automático no Vercel
   - [ ] Testar app em produção (`https://kadesh-seven.vercel.app`)
   - [ ] Validar comunicação frontend ↔ backend

---

**🎯 Meta:** MVP funcional em 3 semanas, sistema completo em 8 semanas.

**📧 Contato:** marcuslimadev  
**📦 Repositório:** https://github.com/marcuslimadev/kadesh
