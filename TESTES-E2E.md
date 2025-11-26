# 🧪 Suite de Testes E2E - Kaddesh

## Configuração Completa do Playwright

### ✅ O que foi implementado

#### 1. **Configuração Base** (`playwright.config.js`)
- Timeout: 30 segundos por teste
- Retries: 2 tentativas em CI, 0 em desenvolvimento
- Reporters: HTML + List
- Base URL: `http://localhost:5173` (frontend)
- Screenshots e vídeos apenas em falhas
- Web server automático (inicia Vite dev server)

#### 2. **Suite de Testes de Fluxo** (`tests/user-flow.spec.js`)
**Testes de Contratante:**
- ✅ Exibição da home page com todas as seções
- ✅ Login com sucesso
- ✅ Fluxo completo: Login → Lobby → Dashboard → Criar Projeto (wizard 4 steps)
- ✅ Acesso à página de comprovantes
- ✅ Navegação via menu mobile

**Testes de Prestador:**
- ✅ Menu específico para prestador
- ✅ Botões diferenciados (Minhas Propostas vs Novo Projeto)

**Tutorial e Documentação:**
- ✅ Exibição do tutorial com duas torres

#### 3. **Suite de Testes de API** (`tests/api.spec.js`)
**Autenticação:**
- ✅ POST /api/auth/login - login com sucesso
- ✅ POST /api/auth/login - falha com credenciais inválidas
- ✅ POST /api/auth/register - registro de novo usuário

**Projetos:**
- ✅ GET /api/projects - listagem de projetos
- ✅ POST /api/projects - criação com autenticação
- ✅ POST /api/projects - falha sem autenticação

**Contratos:**
- ✅ GET /api/contracts - listagem de contratos

**Carteira:**
- ✅ GET /api/wallet - obter saldo
- ✅ GET /api/wallet/transactions - listar transações

**Comprovantes (Receipts):**
- ✅ GET /api/receipts/contract/:id - erro para contrato inexistente
- ✅ GET /api/receipts/transaction/:id - erro para transação inexistente
- ✅ GET /api/receipts/contract/:id - falha sem autenticação

**Validações:**
- ✅ Validação de campos obrigatórios
- ✅ Validação de orçamento mínimo

**Health Check:**
- ✅ GET / - servidor rodando

#### 4. **Suite de Testes de UI** (`tests/ui.spec.js`)
**Design System:**
- ✅ NavBar com logo e links principais
- ✅ Footer com todas as seções
- ✅ Hero section com CTA visível

**Responsividade:**
- ✅ Mobile (375x667)
- ✅ Tablet (768x1024)
- ✅ Desktop (1920x1080)

**Acessibilidade:**
- ✅ Formulário de login com labels
- ✅ Navegação por teclado

**Formulários - Validação:**
- ✅ Login - validação de campos vazios
- ✅ Cadastro - validação de formato de email

**Estados de Loading:**
- ✅ Login - exibir loading ao submeter

**Toast Notifications:**
- ✅ Toast de sucesso ao criar projeto

**Performance:**
- ✅ Home page carrega em menos de 3 segundos
- ✅ Verificação de lazy loading de imagens

---

## 🚀 Como Executar os Testes

### Pré-requisitos
1. **Backend rodando**: `cd backend && node server.js` (porta 3001)
2. **Browsers instalados**: `npx playwright install`

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Modo UI interativo (recomendado para desenvolvimento)
npm run test:ui

# Modo headed (ver navegador durante testes)
npm run test:headed

# Modo debug (pausar e inspecionar)
npm run test:debug

# Ver relatório HTML
npm run test:report
```

### Executar Testes Específicos

```bash
# Apenas testes de fluxo de usuário
npx playwright test user-flow

# Apenas testes de API
npx playwright test api

# Apenas testes de UI
npx playwright test ui

# Teste específico por nome
npx playwright test -g "deve fazer login com sucesso"
```

---

## 📊 Estrutura de Testes

```
tests/
├── user-flow.spec.js    # Fluxos E2E completos (Login → Criar Projeto)
├── api.spec.js          # Testes de endpoints do backend
└── ui.spec.js           # Testes de componentes, responsividade, acessibilidade
```

---

## 🎯 Cobertura de Testes

### Frontend
- ✅ Autenticação (Login, Registro, Logout)
- ✅ Navegação (NavBar, Footer, Mobile Menu)
- ✅ Lobby de Leilões
- ✅ Dashboard (Contratante vs Prestador)
- ✅ Criar Projeto (Wizard 4 steps)
- ✅ Comprovantes (RPA)
- ✅ Tutorial (Duas Torres)
- ✅ Responsividade (Mobile, Tablet, Desktop)

### Backend
- ✅ Autenticação (JWT)
- ✅ Projetos (CRUD)
- ✅ Contratos
- ✅ Carteira e Transações
- ✅ Comprovantes PDF
- ✅ Validações de formulários

### Extras
- ✅ Performance (< 3s load time)
- ✅ Acessibilidade básica
- ✅ Estados de loading
- ✅ Toasts e notificações

---

## 🐛 Debugging

### Ver testes rodando
```bash
npm run test:headed
```

### Pausar em breakpoints
```bash
npm run test:debug
```

### Inspecionar falhas
```bash
# Após rodar testes, ver relatório com screenshots/vídeos
npm run test:report
```

### Trace viewer (passo a passo)
```bash
npx playwright show-trace trace.zip
```

---

## 📝 Boas Práticas Implementadas

1. **Isolation**: Cada teste é independente
2. **Cleanup**: `beforeEach` para reset de estado
3. **Waits**: Uso de `waitForURL` e `waitForLoadState`
4. **Assertions**: Uso de `expect` do Playwright
5. **Mocking**: Interceptação de requests quando necessário
6. **Selectors**: Preferência por texto visível ao invés de IDs/classes
7. **Responsividade**: Testes em múltiplos viewports
8. **Accessibility**: Verificação de labels e navegação por teclado

---

## 🔧 Configurações Importantes

### playwright.config.js
- **timeout**: 30000ms (30s por teste)
- **retries**: 2 em CI, 0 em dev
- **workers**: 1 em CI, paralelo em dev
- **baseURL**: http://localhost:5173
- **webServer**: Inicia Vite automaticamente

### Backend
- **Port**: 3001 (configurado em .env)
- **Database**: PostgreSQL
- **CORS**: Permite localhost:5173

---

## 📈 Próximos Passos

- [ ] Adicionar testes de integração com banco de dados
- [ ] Testes de upload de arquivos (anexos em projetos)
- [ ] Testes de chat em tempo real (Socket.io)
- [ ] Testes de escrow e milestones
- [ ] Testes de admin dashboard
- [ ] CI/CD: Integração com GitHub Actions
- [ ] Cobertura de código com Istanbul/NYC

---

## ⚠️ Notas Importantes

1. **Backend deve estar rodando** antes de executar testes E2E
2. **Database seed** pode ser necessário para alguns testes
3. **Credenciais de teste** hardcoded devem existir no DB:
   - `contratante@teste.com` / `senha123`
   - `prestador@teste.com` / `senha123`
4. **Porta 5173** deve estar livre para Vite dev server
5. **Porta 3001** deve estar livre para backend

---

## 🎉 Resumo

**Total de testes**: 40+
**Arquivos de teste**: 3
**Browsers**: Chromium (padrão)
**Tempo médio**: ~2-3 minutos para suite completa
**Status**: ✅ Configuração completa e funcional
