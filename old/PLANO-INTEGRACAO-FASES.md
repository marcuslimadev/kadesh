# 🚀 Plano de Integração em Fases - Marketplace Kadesh
## Roadmap Estruturado para Sistema Completo de Leilão Reverso

**Versão:** 1.0  
**Data:** 10/11/2025  
**Metodologia:** Desenvolvimento Ágil (Sprints de 2 semanas)  
**Duração Estimada:** 12 semanas (3 meses)

---

## 📊 Visão Geral das Fases

| Fase | Nome | Duração | Prioridade | Complexidade | Bloqueador? |
|------|------|---------|------------|--------------|-------------|
| **Fase 0** | Design System & Fundação | 1 semana | 🔴 Crítica | Média | ✅ Sim |
| **Fase 1** | KYC e Verificação Completa | 2 semanas | 🔴 Crítica | Alta | ✅ Sim |
| **Fase 2** | Leilão Reverso Core | 3 semanas | 🔴 Crítica | Muito Alta | ✅ Sim |
| **Fase 3** | Escrow e Pagamentos | 2 semanas | 🔴 Crítica | Alta | ✅ Sim |
| **Fase 4** | Execução e Acompanhamento | 2 semanas | 🟡 Alta | Média | ❌ Não |
| **Fase 5** | Disputas e Governança | 1 semana | 🟡 Alta | Média | ❌ Não |
| **Fase 6** | Timeline, Auditoria e Polish | 1 semana | 🟢 Média | Baixa | ❌ Não |

**Total:** 12 semanas = **MVP funcional completo**

---

## 🎨 FASE 0: Design System & Fundação
**Duração:** 1 semana (Sprint 0)  
**Objetivo:** Criar base sólida de componentes reutilizáveis e arquitetura escalável

### 📋 Entregas

#### 1. Design System (3 dias)
```
kadesh-design-system.css
├── Tokens
│   ├── Colors (primary, secondary, semantic)
│   ├── Typography (headings, body, code)
│   ├── Spacing (margins, paddings com sistema 8pt)
│   ├── Shadows (elevations)
│   ├── Border radius
│   └── Transitions
│
├── Components
│   ├── Buttons (primary, secondary, ghost, danger)
│   ├── Forms (input, textarea, select, checkbox, radio)
│   ├── Cards (default, hover, selected)
│   ├── Modals (small, medium, large, fullscreen)
│   ├── Alerts (success, warning, error, info)
│   ├── Badges (status, count, notification)
│   ├── Tables (sortable, paginated)
│   ├── Tabs
│   ├── Breadcrumbs
│   ├── Progress bars
│   └── Skeletons (loading states)
│
└── Layouts
    ├── Grid system (12 columns)
    ├── Navbar (3 variants: guest, user, admin)
    ├── Sidebar
    ├── Footer
    └── Page containers
```

**Arquivo:** `public/jquery-frontend/assets/css/kadesh-design-system.css`

#### 2. Componentes JavaScript Reutilizáveis (2 dias)
```javascript
kadesh-components.js
├── Modal({ title, content, actions })
├── Toast({ message, type, duration })
├── Confirm({ message, onConfirm, onCancel })
├── FileUpload({ multiple, accept, maxSize, onUpload })
├── DatePicker({ format, minDate, maxDate })
├── TimePicker()
├── Select2Wrapper() // Select com busca
├── ImagePreview()
├── ProgressTracker({ steps, current })
└── DataTable({ columns, data, sortable, paginated })
```

**Arquivo:** `public/jquery-frontend/assets/js/kadesh-components.js`

#### 3. Arquitetura de Rotas (2 dias)
```php
// Backend: Refatorar backend.php para estrutura modular
src/Backend/
├── Router.php (novo)
├── Middleware/
│   ├── AuthMiddleware.php
│   ├── RoleMiddleware.php
│   └── RateLimitMiddleware.php
└── Routes/
    ├── api.php
    ├── auth.php
    ├── admin.php
    └── web.php
```

### 🎯 Critérios de Aceite Fase 0
- [ ] 15+ componentes visuais documentados em style guide
- [ ] 10+ componentes JS funcionais com exemplos
- [ ] Design responsivo testado (mobile, tablet, desktop)
- [ ] Acessibilidade básica (ARIA labels, keyboard navigation)
- [ ] Performance: CSS < 50KB minificado
- [ ] Storybook ou página de demonstração funcional

---

## 🧾 FASE 1: KYC e Verificação Completa
**Duração:** 2 semanas (Sprint 1-2)  
**Objetivo:** Implementar compliance legal e verificação de identidade

### 📋 Backend (1 semana)

#### Controllers
```php
UserController.php (extensão)
├── uploadDocument(type, file)
├── getDocuments()
├── updateProfile(data)
├── addCertification(data)
├── addBankAccount(data)
├── grantConsent(type)
├── revokeConsent(type)
└── completeOnboarding()

DocumentController.php (novo)
├── verify(documentId, status, reason)
├── getPendingDocuments() // Admin
└── bulkApprove(documentIds)

AuditController.php (novo)
├── logAction(user, entity, action, data)
├── getAuditTrail(entityType, entityId)
└── calculateHash(previousHash, currentData)
```

#### Services
```php
DocumentVerificationService.php
├── validateCPF(cpf)
├── validateCNPJ(cnpj)
├── validateRG(rg, state)
├── detectDocumentType(file) // OCR
├── extractDocumentData(file) // OCR
└── checkDocumentExpiry(document)

AuditLoggerService.php
├── log(data)
├── generateHash(data, previousHash)
├── verifyChain(entityType, entityId)
└── exportToCSV(filters)

ServiceCategoryService.php
├── getTree()
├── search(query)
└── getSuggestions(userSkills)
```

### 📋 Frontend (1 semana)

#### Páginas
```html
1. kyc-onboarding.html
   ├── Step 1: Dados Pessoais (CPF/CNPJ, endereço)
   ├── Step 2: Upload de Documentos (RG, CNH, selfie)
   ├── Step 3: Categorias de Serviço (multi-select)
   ├── Step 4: Certificações (opcional)
   ├── Step 5: Dados Bancários (PIX)
   ├── Step 6: Consentimentos LGPD
   ├── Step 7: Questionário de Reputação
   └── Progress tracker visual

2. profile-settings.html
   ├── Aba: Dados Pessoais
   ├── Aba: Documentos
   ├── Aba: Certificações
   ├── Aba: Dados Bancários
   ├── Aba: Preferências
   └── Aba: Privacidade (LGPD)

3. admin-kyc-verification.html
   ├── Lista de documentos pendentes
   ├── Preview de documentos
   ├── Botões: Aprovar/Rejeitar
   └── Campo de motivo de rejeição
```

### 🎯 Critérios de Aceite Fase 1
- [ ] Upload de 5+ tipos de documentos (RG, CNH, CPF, Selfie, Comprovante)
- [ ] Validação automática de CPF/CNPJ
- [ ] Preview de documentos em modal
- [ ] Fluxo de aprovação/rejeição (admin)
- [ ] Notificação de documento rejeitado
- [ ] Logs de auditoria com hash SHA-256
- [ ] Verificação de integridade da cadeia de logs
- [ ] Onboarding completo em < 5 minutos
- [ ] Testes E2E do fluxo completo

---

## ⚙️ FASE 2: Leilão Reverso Core
**Duração:** 3 semanas (Sprint 3-5)  
**Objetivo:** Implementar coração do negócio - sistema de leilão com lances em tempo real

### 📋 Backend (2 semanas)

#### Controllers
```php
AuctionController.php (novo)
├── create(projectId, config) // Criar leilão
├── start(auctionId) // Iniciar timer
├── getActive(filters) // Listar leilões abertos
├── getDetail(auctionId) // Detalhes + placar
├── checkSoftClose(auctionId) // Verificar extensão
├── extend(auctionId) // Aplicar soft close
├── end(auctionId) // Encerrar
├── selectWinner(auctionId) // Escolher vencedor
└── cancel(auctionId, reason)

BidController.php (novo)
├── place(auctionId, amount, proposal) // Dar lance
├── update(bidId, amount) // Editar lance
├── withdraw(bidId, reason) // Retirar lance
├── getMyBids(userId)
├── getLeaderboard(auctionId) // Placar
├── calculateScore(bid) // 70% preço + 30% reputação
└── checkMinDecrement(auctionId, newAmount)

QuestionController.php (novo)
├── ask(projectId, question)
├── answer(questionId, answer) // Contratante responde
└── getProjectQuestions(projectId)
```

#### Services
```php
AuctionTimerService.php (Cron Job)
├── checkEndingAuctions()
├── applySoftClose(auctionId)
├── finalizeAuction(auctionId)
└── notifyParticipants(auctionId, event)

BidScoringService.php
├── calculatePriceScore(amount, minBudget, maxBudget)
├── calculateReputationScore(providerId)
├── calculateFinalScore(priceScore, repScore, weights)
└── updateRankings(auctionId)

RealtimeNotificationService.php
├── broadcastNewBid(auctionId, bid)
├── notifyOutbid(userId, auctionId)
├── notifyLeading(userId, auctionId)
├── notifyEndingSoon(auctionId)
└── notifyWinner(auctionId, winnerId)
```

### 📋 Frontend (1 semana)

#### Páginas
```html
1. auctions-marketplace.html
   ├── Filtros: Categoria, Região, Orçamento, Prazo
   ├── Ordenação: Mais recentes, Encerrando logo, Maior valor
   ├── Card de leilão:
   │   ├── Título e descrição
   │   ├── Orçamento (min-max)
   │   ├── Timer regressivo (atualização a cada segundo)
   │   ├── Número de lances
   │   ├── Menor lance atual
   │   └── Botão "Dar Lance"
   └── Paginação

2. auction-detail.html
   ├── Header com status e timer
   ├── Descrição completa do projeto
   ├── Anexos e requisitos
   ├── Perguntas e respostas (Q&A)
   ├── Formulário de pergunta
   ├── PLACAR DE LANCES (real-time):
   │   ├── Posição
   │   ├── Fornecedor (anônimo ou nome)
   │   ├── Valor
   │   ├── Score calculado
   │   └── Indicador "Você" se for seu lance
   ├── Formulário de lance:
   │   ├── Input valor (validação de decremento)
   │   ├── Textarea proposta
   │   ├── Upload portfólio
   │   └── Botão "Enviar Lance"
   └── Histórico de seus lances

3. my-bids.html (Dashboard do Fornecedor)
   ├── Lances ativos
   ├── Lances vencedores
   ├── Lances perdidos
   ├── Estatísticas (taxa de vitória, valor médio)
   └── Filtros

4. auction-admin-panel.html
   ├── Leilões em andamento
   ├── Timer dashboard (múltiplos leilões)
   ├── Botão de encerrar manualmente
   ├── Logs de eventos
   └── Métricas (lances/hora, participação)
```

#### JavaScript Real-Time
```javascript
auction-realtime.js
├── connectWebSocket(auctionId)
├── onNewBid(callback)
├── onOutbid(callback)
├── onTimerUpdate(callback)
├── onAuctionExtended(callback)
├── onAuctionEnded(callback)
├── updateLeaderboard(data)
└── updateTimer(remainingSeconds)
```

### 🔧 Infraestrutura Necessária
```
- WebSocket Server (Node.js + Socket.io) ou
- SSE (Server-Sent Events) ou
- Pusher / Ably (SaaS)

- Cron Job configurado:
  - A cada 1 minuto: verificar leilões encerrando
  - A cada 5 minutos: sincronizar timers
  - A cada 1 hora: limpar notificações antigas

- Redis (opcional):
  - Cache de placar
  - Pub/Sub para notificações
```

### 🎯 Critérios de Aceite Fase 2
- [ ] Criar leilão com configuração personalizada
- [ ] Timer regressivo funcional em todas as páginas
- [ ] Dar lance com validação de decremento mínimo
- [ ] Placar atualizado em tempo real (< 2s de latência)
- [ ] Soft close funcionando (+ 2min após lance nos últimos 2min)
- [ ] Máximo 5 extensões de soft close
- [ ] Notificação "Você foi superado" instantânea
- [ ] Cálculo de score: 70% preço + 30% reputação
- [ ] Seleção automática de vencedor ao fim do timer
- [ ] Testes de carga: 50 lances simultâneos
- [ ] Testes E2E: Criar > Dar lance > Receber notificação > Vencer

---

## 💰 FASE 3: Escrow e Pagamentos
**Duração:** 2 semanas (Sprint 6-7)  
**Objetivo:** Implementar carteira virtual, escrow e integração com gateway

### 📋 Backend (1.5 semanas)

#### Controllers
```php
WalletController.php (novo)
├── getBalance(userId)
├── deposit(userId, amount, method) // PIX, TED, boleto
├── withdraw(userId, amount, bankAccountId)
├── getStatement(userId, filters)
├── getTransactionDetails(transactionId)
└── exportStatement(userId, format) // PDF, CSV

EscrowController.php (novo)
├── createAccount(projectId, amount)
├── holdFunds(escrowId, amount) // Congelar na carteira
├── releaseMilestone(milestoneId)
├── refundFunds(escrowId, reason)
├── calculateFees(amount)
├── splitPayment(escrowId, splits) // Plataforma + Fornecedor
└── getEscrowStatus(projectId)

MilestoneController.php (novo)
├── create(projectId, milestones[])
├── submitEvidence(milestoneId, files, notes)
├── approve(milestoneId)
├── reject(milestoneId, reason)
├── requestRevision(milestoneId, description)
└── getProjectMilestones(projectId)

InvoiceController.php (novo)
├── upload(projectId, milestoneId, file, data)
├── verify(invoiceId, status)
├── download(invoiceId)
└── getInvoices(userId, filters)

PaymentWebhookController.php (novo)
├── handlePixWebhook(data) // Mercado Pago, PagSeguro
├── handleBoletoWebhook(data)
├── verifySignature(payload, signature)
└── processPayment(data)
```

#### Services
```php
PaymentGatewayService.php
├── createPixCharge(amount, description)
├── createBoleto(amount, dueDate)
├── checkPaymentStatus(transactionId)
├── processWebhook(data)
└── refundPayment(transactionId)

EscrowService.php
├── calculatePlatformFee(amount, percentage)
├── holdAmount(userId, amount, reference)
├── releaseToProvider(amount, providerId, projectId)
├── refundToContractor(amount, contractorId, projectId)
└── generateReleaseHash(data)

TransactionHashService.php
├── generateHash(transaction, previousHash)
├── verifyTransactionChain(userId)
└── exportProofOfFunds(transactionId) // PDF auditável
```

### 📋 Frontend (0.5 semanas)

#### Páginas
```html
1. wallet-dashboard.html
   ├── Card de saldo
   ├── Botões: Depositar / Sacar
   ├── Extrato (tabela paginada)
   ├── Filtros: Período, Tipo, Status
   ├── Gráfico de movimentação (Chart.js)
   └── Exportar PDF/CSV

2. deposit-modal.html
   ├── Seletor de método: PIX / Boleto / Cartão
   ├── Input de valor
   ├── QR Code PIX (dinâmico)
   ├── Botão "Copiar código PIX"
   ├── Status "Aguardando pagamento..."
   └── Webhook: Atualizar ao receber confirmação

3. withdraw-modal.html
   ├── Saldo disponível
   ├── Select de conta bancária
   ├── Input de valor
   ├── Taxa de saque (se houver)
   ├── Valor líquido
   └── Confirmação com senha

4. escrow-panel.html (Aba no projeto)
   ├── Total em escrow
   ├── Marcos do projeto (kanban)
   ├── Status de cada marco:
   │   ├── Pendente
   │   ├── Em Progresso
   │   ├── Aguardando Aprovação
   │   ├── Aprovado
   │   └── Pagamento Liberado
   ├── Upload de evidências
   ├── Botões de ação (aprovar/rejeitar)
   └── Histórico de liberações

5. milestone-submission.html
   ├── Título do marco
   ├── Descrição
   ├── Upload múltiplo de arquivos
   ├── Campo de notas
   ├── Checkbox "Confirmo que o trabalho está completo"
   └── Botão "Submeter para Aprovação"
```

### 🔧 Infraestrutura Necessária
```
- Gateway de Pagamento:
  - Mercado Pago (recomendado) ou
  - PagSeguro ou
  - Asaas (para SaaS)

- Webhook Endpoint:
  - URL pública (ngrok para dev)
  - SSL obrigatório
  - Validação de signature

- Armazenamento de Arquivos:
  - Local: storage/invoices/
  - Produção: AWS S3 ou Cloudinary
```

### 🎯 Critérios de Aceite Fase 3
- [ ] Depositar via PIX com QR Code dinâmico
- [ ] Webhook atualiza saldo em < 5s
- [ ] Sacar para conta bancária cadastrada
- [ ] Criar escrow ao aceitar proposta vencedora
- [ ] Congelar 60-70% do valor total
- [ ] Criar 3-5 marcos configuráveis
- [ ] Upload de evidências (imagens, PDFs, links)
- [ ] Aprovar marco e liberar pagamento parcial
- [ ] Cálculo automático de taxa da plataforma (1-10%)
- [ ] Nota fiscal anexada ao pagamento
- [ ] Hash imutável de cada transação
- [ ] Extrato exportável em PDF
- [ ] Testes E2E: Depositar > Criar escrow > Liberar marco > Receber

---

## 💼 FASE 4: Execução e Acompanhamento
**Duração:** 2 semanas (Sprint 8-9)  
**Objetivo:** Ferramentas de gestão de projetos e avaliações

### 📋 Backend (1 semana)

#### Controllers
```php
ProjectExecutionController.php (novo)
├── startProject(projectId)
├── updateStatus(projectId, status)
├── addUpdate(projectId, message, attachments)
├── getTimeline(projectId)
└── finalizeProject(projectId)

ReviewController.php (novo)
├── create(projectId, reviewedUserId, rating, comment)
├── reply(reviewId, comment) // Resposta do avaliado
├── report(reviewId, reason) // Denunciar avaliação
├── getUserReviews(userId)
├── getProjectReviews(projectId)
└── calculateNewRating(userId)

ReputationController.php (novo)
├── getUserReputation(userId)
├── getReputationBreakdown(userId) // Detalhes
├── getReputationHistory(userId) // Gráfico
└── calculateReputationScore(userId) // Fórmula complexa
```

#### Services
```php
ReputationCalculationService.php
├── calculateOverallRating(reviews)
├── calculateCompletionRate(projects)
├── calculateOnTimeDelivery(projects)
├── calculateResponseTime(messages)
├── calculateDisputeRate(disputes)
├── applyPenalties(userId, violations)
├── applyBonuses(userId, achievements)
└── generateReputationScore(0-100)
```

### 📋 Frontend (1 semana)

#### Páginas
```html
1. project-execution-board.html
   ├── Header: Status, Progresso, Prazo
   ├── Kanban Board:
   │   ├── Coluna: Pendente
   │   ├── Coluna: Em Progresso
   │   ├── Coluna: Concluído
   │   └── Drag & Drop de marcos
   ├── Timeline de atualizações
   ├── Formulário de nova atualização
   ├── Chat entre contratante e fornecedor
   └── Botão "Finalizar Projeto"

2. project-finalization-modal.html
   ├── Checklist de conclusão
   ├── Confirmação de todos os marcos pagos
   ├── Formulário de avaliação:
   │   ├── Stars rating (1-5)
   │   ├── Aspectos:
   │   │   ├── Qualidade do trabalho
   │   │   ├── Comunicação
   │   │   ├── Pontualidade
   │   │   └── Custo-benefício
   │   ├── Comentário (opcional)
   │   └── Recomendaria? (Sim/Não)
   └── Botão "Finalizar e Avaliar"

3. reputation-profile.html (Aba no perfil)
   ├── Score geral (0-100)
   ├── Badge de nível (Bronze, Prata, Ouro)
   ├── Gráfico de evolução
   ├── Estatísticas:
   │   ├── Projetos concluídos
   │   ├── Taxa de sucesso
   │   ├── Entregas no prazo
   │   ├── Tempo médio de resposta
   │   └── Taxa de disputa
   ├── Avaliações recebidas
   ├── Conquistas (badges)
   └── Certificados
```

### 🎯 Critérios de Aceite Fase 4
- [ ] Kanban funcional com drag & drop
- [ ] Timeline de eventos do projeto
- [ ] Formulário de avaliação completo
- [ ] Cálculo automático de nova média de rating
- [ ] Perfil de reputação com score 0-100
- [ ] Badges e conquistas automáticas
- [ ] Avaliação mútua obrigatória para finalizar
- [ ] Prevenir avaliações duplicadas
- [ ] Testes E2E: Executar > Concluir > Avaliar

---

## ⚖️ FASE 5: Disputas e Governança
**Duração:** 1 semana (Sprint 10)  
**Objetivo:** Sistema de resolução de conflitos

### 📋 Backend (3 dias)

#### Controllers
```php
DisputeController.php (novo)
├── open(projectId, reason, description, evidences)
├── addMessage(disputeId, message)
├── uploadEvidence(disputeId, files)
├── mediate(disputeId, decision) // Admin
├── resolve(disputeId, resolution, splits)
├── freeze Escrow(projectId)
├── executeSplit(disputeId, amounts)
└── getDisputeHistory(userId)

MediationController.php (novo - Admin)
├── getOpenDisputes()
├── getDisputeDetails(disputeId)
├── assignMediator(disputeId, adminId)
├── requestAdditionalInfo(disputeId, userId, question)
└── closeDispute(disputeId, decision, reason)
```

### 📋 Frontend (2 dias)

#### Páginas
```html
1. dispute-form.html
   ├── Select: Tipo de disputa
   │   ├── Entrega insatisfatória
   │   ├── Atraso injustificado
   │   ├── Divergência de escopo
   │   └── Não pagamento
   ├── Textarea: Descrição detalhada
   ├── Upload de evidências
   └── Botão "Abrir Disputa"

2. dispute-chat.html
   ├── Header: Status, Mediador
   ├── Chat entre partes + mediador
   ├── Anexar documentos
   ├── Timeline de eventos
   └── Aguardando decisão...

3. admin-mediation-panel.html
   ├── Lista de disputas abertas
   ├── Filtros: Status, Categoria, Valor
   ├── Card de disputa:
   │   ├── Partes envolvidas
   │   ├── Valor em disputa
   │   ├── Tempo aberto
   │   └── Botão "Mediar"
   └── Dashboard de métricas

4. dispute-resolution-modal.html
   ├── Resumo da disputa
   ├── Evidências de ambas as partes
   ├── Select: Decisão
   │   ├── Favor do Contratante (refund 100%)
   │   ├── Favor do Fornecedor (release 100%)
   │   ├── Split personalizado
   │   └── Cancelar disputa
   ├── Inputs de split (se aplicável)
   ├── Textarea: Justificativa
   └── Botão "Aplicar Decisão"
```

### 🎯 Critérios de Aceite Fase 5
- [ ] Abrir disputa congela escrow imediatamente
- [ ] Chat tripartite (contratante, fornecedor, mediador)
- [ ] Upload de evidências por ambas as partes
- [ ] Admin pode decidir split customizado
- [ ] Decisão aplica automaticamente no escrow
- [ ] Notificações de decisão
- [ ] Histórico permanente de disputas
- [ ] Testes E2E: Abrir > Mediar > Resolver

---

## 🕓 FASE 6: Timeline, Auditoria e Polish
**Duração:** 1 semana (Sprint 11)  
**Objetivo:** Transparência total e refinamentos finais

### 📋 Backend (2 dias)

#### Controllers
```php
TimelineController.php (novo)
├── getProjectTimeline(projectId, filters)
├── exportToPDF(projectId)
├── filterByType(projectId, eventTypes[])
└── getEventDetails(eventId)

AuditDashboardController.php (Admin)
├── getSystemLogs(filters)
├── getUserActivity(userId, dateRange)
├── getFinancialAudit(projectId)
├── exportAuditReport(format) // PDF, CSV
└── verifyHashChain(entityType, entityId)
```

### 📋 Frontend (2 dias)

#### Páginas
```html
1. project-timeline.html
   ├── Timeline vertical com eventos:
   │   ├── Ícones por tipo
   │   ├── Cores por categoria
   │   ├── Tooltip com detalhes
   │   └── Timestamps precisos
   ├── Filtros:
   │   ├── Tipo (financeiro, técnico, admin)
   │   ├── Período
   │   └── Usuário
   ├── Botão "Exportar PDF"
   └── Zoom timeline

2. admin-audit-dashboard.html
   ├── Métricas gerais
   ├── Gráficos de atividade
   ├── Logs de ações críticas
   ├── Verificador de hash chain
   └── Exportar relatórios
```

### 📋 Polish e Refinamentos (1 dia)
- [ ] Animações de transição suaves
- [ ] Micro-interações (botões, cards)
- [ ] Loading skeletons
- [ ] Empty states ilustrados
- [ ] Error pages (404, 500) customizadas
- [ ] Toast notifications consistentes
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] Performance (Lighthouse > 90)

### 🎯 Critérios de Aceite Fase 6
- [ ] Timeline visual completa e exportável
- [ ] Filtros funcionais
- [ ] PDF gerado com marca d'água
- [ ] Verificação de hash chain funcional
- [ ] Dashboard de auditoria (admin)
- [ ] Polish visual em todas as páginas
- [ ] Sem bugs críticos
- [ ] Testes E2E de todos os fluxos principais

---

## 🎨 Visões por Perfil de Usuário

### 👤 Contratante (Cliente)
```
Dashboard Contratante
├── Meus Projetos
│   ├── Rascunhos
│   ├── Em Leilão (timer visível)
│   ├── Em Execução
│   └── Concluídos
├── Ações Rápidas
│   ├── Criar Novo Projeto
│   ├── Ver Leilões Ativos
│   └── Mensagens
├── Carteira
│   ├── Saldo
│   ├── Em Escrow
│   └── Histórico
└── Avaliações Recebidas
```

### 🔧 Fornecedor (Prestador)
```
Dashboard Fornecedor
├── Leilões Disponíveis
│   ├── Novos
│   ├── Encerrando Hoje
│   └── Salvos (watchlist)
├── Meus Lances
│   ├── Vencendo
│   ├── Perdendo
│   └── Histórico
├── Projetos Ativos
│   ├── Em Execução
│   ├── Aguardando Pagamento
│   └── Concluídos
├── Carteira
│   ├── Saldo
│   ├── A Receber
│   └── Histórico
└── Minha Reputação
    ├── Score
    ├── Avaliações
    └── Badges
```

### 👔 Administrador
```
Admin Dashboard
├── Visão Geral
│   ├── Usuários Ativos
│   ├── Leilões em Andamento
│   ├── Volume Financeiro
│   └── Disputas Abertas
├── KYC Pendente
│   ├── Documentos para Verificar
│   ├── Aprovações Rápidas
│   └── Rejeitados
├── Gestão de Leilões
│   ├── Monitoramento de Timers
│   ├── Intervenções Manuais
│   └── Logs de Eventos
├── Mediação de Disputas
│   ├── Novas
│   ├── Em Análise
│   └── Resolvidas
├── Financeiro
│   ├── Transações
│   ├── Escrow Total
│   ├── Taxas Cobradas
│   └── Relatórios
└── Auditoria
    ├── Logs do Sistema
    ├── Ações de Usuários
    └── Verificação de Hash
```

---

## 🔧 Stack Tecnológico Recomendado

### Backend
```yaml
Core:
  - PHP 8.1+ (sem framework, puro)
  - MySQL/MariaDB

Bibliotecas:
  - PHPMailer (emails)
  - Firebase JWT (tokens)
  - GuzzleHTTP (API calls)
  - Intervention Image (processamento de imagens)
  - mPDF ou TCPDF (geração de PDFs)

Segurança:
  - password_hash/verify (bcrypt)
  - filter_var (sanitização)
  - prepared statements (PDO)
```

### Frontend
```yaml
Core:
  - jQuery 3.7+
  - HTML5 + CSS3

Bibliotecas:
  - Chart.js (gráficos)
  - Dropzone.js (upload)
  - Select2 (autocomplete)
  - Moment.js (datas)
  - Socket.io Client (websocket)
  - SweetAlert2 (modals)
  - DataTables (tabelas)
```

### Infraestrutura
```yaml
Servidor Web:
  - Apache 2.4+ ou Nginx

Real-Time:
  - Node.js + Socket.io (websocket)
  - ou Laravel Echo Server
  - ou Pusher (SaaS)

Cron Jobs:
  - crontab (Linux)
  - ou Task Scheduler (Windows)
  - Frequência: 1min, 5min, 1h

Cache (Opcional):
  - Redis ou Memcached

Storage:
  - Local (dev)
  - AWS S3 ou Cloudinary (prod)

Pagamentos:
  - Mercado Pago SDK
  - ou Asaas SDK
```

---

## 📊 Métricas de Sucesso

### KPIs Técnicos
- [ ] Uptime: > 99.5%
- [ ] Response time: < 200ms (95th percentile)
- [ ] Lighthouse Score: > 90
- [ ] Cobertura de testes: > 80%
- [ ] Zero vulnerabilidades críticas (OWASP)

### KPIs de Negócio
- [ ] Taxa de conversão cadastro → KYC completo: > 70%
- [ ] Taxa de conversão projeto → lances: > 60%
- [ ] Tempo médio de leilão: 3-7 dias
- [ ] Taxa de conclusão de projetos: > 85%
- [ ] NPS (Net Promoter Score): > 50

---

## 🚀 Próximos Passos Imediatos

### Semana 1 (Agora)
1. ✅ Aprovar este plano
2. ⏳ Executar **Fase 0** (Design System)
3. ⏳ Configurar ambiente de desenvolvimento
4. ⏳ Criar repositório Git com branches por fase
5. ⏳ Configurar CI/CD básico

### Sugestão de Workflow
```
main (produção)
├── develop (staging)
    ├── feature/fase-0-design-system
    ├── feature/fase-1-kyc
    ├── feature/fase-2-auction
    ├── feature/fase-3-escrow
    ├── feature/fase-4-execution
    ├── feature/fase-5-disputes
    └── feature/fase-6-timeline
```

---

**Criado por:** GitHub Copilot  
**Data:** 10/11/2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para execução

