# 📋 Plano de Implementação - Solicitações do Cliente (Dezembro 2025)

**Data**: 26 de dezembro de 2025  
**Status**: Aguardando implementação  
**Baseado em**: Conversa WhatsApp de 12/12 a 26/12/2025

---

## 🎯 Visão Geral das Solicitações

### ✅ Concluído
- [x] Alteração do vídeo da Home para `novovideo.mp4`

### 🔄 Pendente de Implementação

---

## 📝 Detalhamento das Tarefas

### 1. 🐛 **CRÍTICO: Corrigir erro nos anúncios na Home**
**Prioridade**: ALTA  
**Status do Cliente**: "Abriu a primeira tela lindamente, ficou maravilhoso, mas logo depois ao entrar os anúncios, ficou assim [erro]"

**Análise Técnica**:
- Componente: `src/views/Home.vue` (linhas 2-3)
- Usa: `<AdRail position="left" />` e `<AdRail position="right" />`
- **Possíveis causas**:
  1. Componente AdRail não está carregando corretamente
  2. API de anúncios retornando erro
  3. Problema de layout/CSS que quebra após load dos anúncios
  4. Erro de comunicação com backend em `backend/routes/advertisements.js`

**Passos de Implementação**:
```powershell
# 1. Verificar console do navegador para erros
# 2. Testar rota backend: GET /api/advertisements
# 3. Adicionar error handling em AdRail component
# 4. Implementar fallback caso API falhe
# 5. Validar dados mockados se backend estiver down
```

**Arquivos a Modificar**:
- `src/components/AdRail.vue` - Adicionar try/catch e error boundary
- `backend/routes/advertisements.js` - Validar retorno correto
- `src/views/Home.vue` - Adicionar error handling condicional

---

### 2. 🦁 **Adicionar imagem do Leão**
**Prioridade**: MÉDIA  
**Status do Cliente**: "Poe o Leao Aqui"

**Análise Técnica**:
- **Contexto incerto**: Cliente não especificou local exato
- Possíveis locais:
  1. Hero section da Home (próximo ao logo atual)
  2. Substituir logo atual `/logo.jpeg`
  3. Adicionar como elemento decorativo na hero section

**Decisão Recomendada**:
- Solicitar ao cliente: **Onde exatamente colocar o leão?**
- Opções:
  - [ ] Substituir logo atual
  - [ ] Adicionar ao lado do logo
  - [ ] Background/watermark na hero section
  - [ ] Ícone no navbar

**Implementação Provisória**:
```vue
<!-- Opção 1: Adicionar ao lado do logo (Home.vue linha 28) -->
<div class="flex items-center justify-center gap-4 mb-8">
  <img src="/leao.png" alt="Leão" class="h-20 w-20 object-contain" />
  <img src="/logo.jpeg" alt="Kaddesh" class="h-16 w-16 rounded-2xl" />
</div>
```

---

### 3. 🎨 **Ajustar layout do Lobby (AuctionLobby.vue)**
**Prioridade**: ALTA  
**Status do Cliente**: "O Lobby ainda está diferente" + "Seguindo....." [enviou exemplos]

**Análise Técnica**:
- Arquivo: `src/views/AuctionLobby.vue`
- Cliente enviou imagens de referência (não visíveis na conversa)
- **Ação necessária**: Solicitar novamente as imagens ou descrição detalhada

**Possíveis Ajustes** (baseado em padrões comuns):
1. Layout dos cards de projeto
2. Posicionamento dos anúncios (AdRail)
3. Cores/estilo visual
4. Organização das informações

**Aguardando**: Clarificação do cliente sobre design esperado

---

### 4. ⏱️ **Implementar Contador Regressivo**
**Prioridade**: ALTA  
**Status do Cliente**: "Não esqueça de colocar o contador regressivo"

**Análise Técnica**:
- **Onde**: Leilões ativos no AuctionLobby e ProjectCard
- **Biblioteca**: Já usa `date-fns` (ver `package.json`)
- **Backend**: Campo `deadline` existe em `projects` table

**Implementação**:

**Componente Novo**: `src/components/CountdownTimer.vue`
```vue
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { differenceInSeconds, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps({
  deadline: { type: String, required: true }
})

const now = ref(new Date())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const timeLeft = computed(() => {
  const seconds = differenceInSeconds(new Date(props.deadline), now.value)
  
  if (seconds <= 0) return { expired: true, display: 'Leilão Encerrado' }
  
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    expired: false,
    display: `${days}d ${hours}h ${mins}m ${secs}s`,
    urgent: seconds < 3600 // < 1 hora
  }
})
</script>

<template>
  <div :class="[
    'countdown',
    { 'urgent': timeLeft.urgent, 'expired': timeLeft.expired }
  ]">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>{{ timeLeft.display }}</span>
  </div>
</template>

<style scoped>
.countdown {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm;
}
.countdown.urgent {
  @apply bg-red-50 text-red-700 animate-pulse;
}
.countdown.expired {
  @apply bg-gray-100 text-gray-500;
}
</style>
```

**Usar em**: `AuctionLobby.vue` e `ProjectCard.vue`
```vue
<CountdownTimer :deadline="project.deadline" />
```

---

### 5. 💰 **Campo de Tipo de Pagamento na Criação de Projeto**
**Prioridade**: ALTA  
**Status do Cliente**: "Na aba de criação do Projeto deve ter um campo para selecionar se o valor estipulado é por hora, por Empreita, por projeto, Por turno, por dia, Semanal, Quinzenal, Mensal"

**Análise Técnica**:
- Arquivo frontend: `src/views/CreateProject.vue`
- Arquivo backend: `backend/routes/projects.js`
- **Necessário**: Migração de banco de dados

**Implementação**:

**1. Migração SQL** (`backend/database/migrations/003_add_payment_type.sql`):
```sql
-- Adicionar coluna payment_type em projects
ALTER TABLE projects 
ADD COLUMN payment_type VARCHAR(20) DEFAULT 'project' CHECK (
  payment_type IN ('hourly', 'daily', 'shift', 'weekly', 'biweekly', 'monthly', 'contract', 'project')
);

-- Comentários para documentação
COMMENT ON COLUMN projects.payment_type IS 'Tipo de cobrança: hourly (por hora), daily (diário), shift (turno), weekly (semanal), biweekly (quinzenal), monthly (mensal), contract (empreita), project (por projeto)';
```

**2. Frontend** (`CreateProject.vue` - adicionar após campo de budget):
```vue
<!-- Payment Type -->
<div>
  <label for="payment_type" class="block text-sm font-semibold text-gray-700 mb-2">
    Tipo de Cobrança *
  </label>
  <select
    id="payment_type"
    v-model="form.payment_type"
    required
    class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
  >
    <option value="">Selecione o tipo de cobrança</option>
    <option value="hourly">💵 Por Hora</option>
    <option value="shift">⏰ Por Turno</option>
    <option value="daily">📅 Por Dia</option>
    <option value="weekly">📆 Semanal</option>
    <option value="biweekly">🗓️ Quinzenal</option>
    <option value="monthly">📊 Mensal</option>
    <option value="contract">🏗️ Por Empreita (Valor fixo)</option>
    <option value="project">📦 Por Projeto (Valor fixo)</option>
  </select>
  <p class="mt-2 text-sm text-gray-500">
    💡 Defina como o valor será calculado para este projeto
  </p>
</div>
```

**3. Script Setup** (`CreateProject.vue` - adicionar ao form data):
```javascript
const form = reactive({
  // ... campos existentes
  payment_type: 'project', // Valor padrão
})
```

**4. Backend** (`backend/routes/projects.js` linha ~537):
```javascript
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      payment_type, // NOVO CAMPO
      estimated_hours,
      deadline,
      requirements,
      skills_required
    } = req.body;

    // Validação
    const validPaymentTypes = ['hourly', 'daily', 'shift', 'weekly', 'biweekly', 'monthly', 'contract', 'project'];
    if (payment_type && !validPaymentTypes.includes(payment_type)) {
      return res.status(400).json({ error: 'Tipo de pagamento inválido' });
    }

    // Create project
    const result = await db.query(`
      INSERT INTO projects (
        client_id, title, description, category, budget, payment_type, estimated_hours, deadline,
        requirements, skills_required, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'open', NOW(), NOW())
      RETURNING *
    `, [
      req.user.userId,
      title,
      description,
      category,
      parseFloat(budget),
      payment_type || 'project', // Padrão: por projeto
      estimated_hours ? parseInt(estimated_hours) : null,
      deadline,
      requirements || null,
      skills_required || null
    ]);

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
```

---

### 6. 🧮 **Calculadora Helper (Opcional)**
**Prioridade**: BAIXA  
**Status do Cliente**: "Se não for complicado, coloque ali um acesso à calculadora para ajudar o usuário, mas se for complicado não precisa"

**Implementação Simples**:

**Componente**: `src/components/BudgetCalculator.vue`
```vue
<script setup>
import { ref, computed } from 'vue'

const hours = ref(0)
const hourlyRate = ref(0)
const days = ref(0)

const emit = defineEmits(['updateBudget'])

const calculated = computed(() => {
  if (hours.value && hourlyRate.value) {
    return (hours.value * hourlyRate.value).toFixed(2)
  }
  if (days.value && hourlyRate.value) {
    return (days.value * 8 * hourlyRate.value).toFixed(2) // 8h/dia
  }
  return '0.00'
})

const applyCalculated = () => {
  emit('updateBudget', parseFloat(calculated.value))
}
</script>

<template>
  <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
    <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
      <span>🧮</span> Calculadora de Orçamento
    </h3>
    
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div>
        <label class="text-xs text-gray-600">Horas estimadas</label>
        <input v-model.number="hours" type="number" min="0" 
               class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
      <div>
        <label class="text-xs text-gray-600">Valor/hora (R$)</label>
        <input v-model.number="hourlyRate" type="number" min="0" step="0.01"
               class="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>
    </div>

    <div class="bg-white rounded-lg p-3 mb-3">
      <p class="text-xs text-gray-600">Valor calculado:</p>
      <p class="text-2xl font-bold text-amber-600">R$ {{ calculated }}</p>
    </div>

    <button 
      @click="applyCalculated"
      type="button"
      class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-semibold"
    >
      Aplicar ao Orçamento
    </button>
  </div>
</template>
```

**Uso em CreateProject.vue**:
```vue
<BudgetCalculator @updateBudget="form.budget = $event" />
```

---

### 7. 🐛 **CRÍTICO: Bug ao criar projeto**
**Prioridade**: CRÍTICA  
**Status do Cliente**: "Sistema não deixou criar o projeto"

**Análise de Possíveis Causas**:

1. **Validação de fundos não implementada**
   - Cliente menciona: "A liberação do projeto tem que estar ligada ao usuário ter fundos"
   - **Solução**: Verificar saldo na carteira antes de criar projeto

2. **Validação de dados falhando**
   - Ver `backend/utils/validators.js` - função `validateProjectData`
   - Possíveis campos obrigatórios não preenchidos

3. **Erro no frontend**
   - Ver console do navegador
   - Validação client-side bloqueando submit

**Implementação da Validação de Fundos**:

**Backend** (`backend/routes/projects.js` - adicionar ANTES do INSERT):
```javascript
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, budget, /* ... */ } = req.body;

    // *** NOVA VALIDAÇÃO: Verificar fundos ***
    const walletCheck = await db.query(`
      SELECT balance
      FROM wallets
      WHERE user_id = $1
    `, [req.user.userId]);

    if (walletCheck.rows.length === 0) {
      return res.status(400).json({
        error: 'Carteira não encontrada. Por favor, configure sua carteira primeiro.',
        requiresWallet: true
      });
    }

    const currentBalance = parseFloat(walletCheck.rows[0].balance);
    const projectBudget = parseFloat(budget);

    if (currentBalance < projectBudget) {
      return res.status(400).json({
        error: `Saldo insuficiente. Você precisa ter pelo menos R$ ${projectBudget.toFixed(2)} na carteira. Saldo atual: R$ ${currentBalance.toFixed(2)}`,
        insufficientFunds: true,
        required: projectBudget,
        available: currentBalance
      });
    }
    // *** FIM DA VALIDAÇÃO ***

    // Validação existente...
    const validation = validateProjectData({ /* ... */ });
    
    // ... resto do código
  }
});
```

**Frontend** (`CreateProject.vue` - melhorar error handling):
```javascript
const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    const response = await api.post('/projects', form)
    
    if (response.data.insufficientFunds) {
      errors.value.general = response.data.error
      // Mostrar modal sugerindo adicionar fundos
      showAddFundsModal.value = true
      return
    }
    
    // Sucesso
    router.push('/lobby')
    
  } catch (error) {
    if (error.response?.data?.insufficientFunds) {
      errors.value.general = error.response.data.error
      showAddFundsModal.value = true
    } else {
      errors.value.general = error.response?.data?.error || 'Erro ao criar projeto'
    }
  } finally {
    loading.value = false
  }
}
```

---

### 8. ✅ **Validar Fluxo Completo do Contratante**
**Prioridade**: ALTA  
**Tipo**: Teste E2E

**Fluxo Definido pelo Cliente**:
1. ✓ Cadastrar Usuário
2. ✓ Logar
3. **→ Inserir Fundos** (crítico)
4. **→ Cadastrar Projeto (com validação de fundos)**
5. ✓ Acompanhar Leilão
6. ✓ Iniciar e acompanhar o projeto junto ao prestador
7. ✓ Conferir Projeto Feito
8. ✓ Liberar Pagamento
9. ✓ Avaliar Prestador

**Teste Playwright** (`tests/contractor-flow.spec.js`):
```javascript
import { test, expect } from '@playwright/test'

test.describe('Fluxo Completo do Contratante', () => {
  const timestamp = Date.now()
  const contractorEmail = `contractor_${timestamp}@test.com`
  
  test('Deve completar todo o fluxo desde cadastro até avaliação', async ({ page }) => {
    // 1. Cadastro
    await page.goto('/register')
    await page.fill('input[name="name"]', 'Contratante Teste')
    await page.fill('input[name="email"]', contractorEmail)
    await page.fill('input[name="password"]', 'Kadesh2025!')
    await page.selectOption('select[name="type"]', 'client')
    await page.click('button[type="submit"]')
    
    // 2. Login
    await expect(page).toHaveURL('/login')
    await page.fill('input[name="email"]', contractorEmail)
    await page.fill('input[name="password"]', 'Kadesh2025!')
    await page.click('button[type="submit"]')
    
    // 3. Inserir Fundos
    await page.goto('/wallet')
    await page.click('button:has-text("Adicionar Fundos")')
    await page.fill('input[name="amount"]', '1000')
    await page.click('button:has-text("Confirmar")')
    await expect(page.locator('.balance')).toContainText('1.000,00')
    
    // 4. Cadastrar Projeto (com validação de fundos)
    await page.goto('/projects/create')
    await page.fill('input[name="title"]', `Projeto Teste ${timestamp}`)
    await page.selectOption('select[name="category"]', 'development')
    await page.fill('textarea[name="description"]', 'Descrição do projeto de teste')
    await page.fill('input[name="budget"]', '500')
    await page.selectOption('select[name="payment_type"]', 'project')
    await page.fill('input[name="deadline"]', '2025-12-31T23:59')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/lobby')
    
    // 5-9. Resto do fluxo...
  })
})
```

---

### 9. ✅ **Validar Fluxo Completo do Prestador**
**Prioridade**: ALTA  
**Tipo**: Teste E2E

**Fluxo Definido pelo Cliente**:
1. ✓ Cadastrar Usuário
2. ✓ Logar
3. ✓ Buscar Oportunidades
4. ✓ Dar Lance
5. ✓ Acompanhar Leilão
6. ✓ Iniciar e acompanhar o projeto junto ao Contratante
7. ✓ Informar Projeto Finalizado
8. ✓ Aguardar Validação
9. ✓ Confirmar recebimento de Pagamento
10. ✓ Avaliar Contratante

**Teste Playwright** (`tests/provider-flow.spec.js`):
```javascript
import { test, expect } from '@playwright/test'

test.describe('Fluxo Completo do Prestador', () => {
  const timestamp = Date.now()
  const providerEmail = `provider_${timestamp}@test.com`
  
  test('Deve completar todo o fluxo desde cadastro até avaliação', async ({ page }) => {
    // 1. Cadastro
    await page.goto('/register')
    await page.fill('input[name="name"]', 'Prestador Teste')
    await page.fill('input[name="email"]', providerEmail)
    await page.fill('input[name="password"]', 'Kadesh2025!')
    await page.selectOption('select[name="type"]', 'provider')
    await page.click('button[type="submit"]')
    
    // 2. Login
    await expect(page).toHaveURL('/login')
    await page.fill('input[name="email"]', providerEmail)
    await page.fill('input[name="password"]', 'Kadesh2025!')
    await page.click('button[type="submit"]')
    
    // 3. Buscar Oportunidades
    await page.goto('/lobby')
    await expect(page.locator('.project-card')).toBeVisible()
    
    // 4. Dar Lance
    await page.click('.project-card:first-child')
    await page.fill('input[name="bid_amount"]', '450')
    await page.fill('textarea[name="proposal"]', 'Proposta do prestador de teste')
    await page.click('button:has-text("Enviar Lance")')
    
    // 5-10. Resto do fluxo...
  })
})
```

---

### 10. 🔐 **Corrigir Acesso ao Painel Admin**
**Prioridade**: ALTA  
**Status do Cliente**: "A base do ADM, eu não consegui visualizar ainda"

**Análise Técnica**:
- Rota: `/admin`
- Backend: `backend/routes/admin.js`
- Middleware: `backend/middleware/adminAuth.js`
- Frontend: `src/views/AdminPanel.vue` (verificar se existe)

**Verificações Necessárias**:

1. **Usuário admin existe no DB?**
```sql
SELECT id, email, is_admin FROM users WHERE is_admin = true;
```

2. **Middleware validando corretamente?**
```javascript
// backend/middleware/adminAuth.js
module.exports = async (req, res, next) => {
  try {
    const userId = req.user.userId // De auth middleware
    
    const result = await db.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({
        error: 'Acesso negado. Apenas administradores.'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar permissões' });
  }
};
```

3. **Rota protegida no frontend?**
```javascript
// src/router/index.js
{
  path: '/admin',
  name: 'Admin',
  component: () => import('../views/AdminPanel.vue'),
  meta: { requiresAuth: true, requiresAdmin: true }
}
```

4. **Guard validando admin?**
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    // Verificar se usuário é admin
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.is_admin) {
      return next('/dashboard')
    }
  }
  next()
})
```

---

## 🚀 Ordem de Implementação Recomendada

### Fase 1: Críticos (1-2 dias)
1. **Bug ao criar projeto** (Task 7) - BLOQUEADOR
2. **Validação de fundos** (Task 7) - BLOQUEADOR
3. **Erro nos anúncios** (Task 1) - UX crítico
4. **Acesso Admin** (Task 10) - Cliente precisa testar

### Fase 2: Features Principais (2-3 dias)
5. **Contador regressivo** (Task 4) - Experiência de leilão
6. **Tipo de pagamento** (Task 5) - Feature solicitada
7. **Layout do Lobby** (Task 3) - Aguarda clarificação do cliente

### Fase 3: Melhorias (1 dia)
8. **Calculadora** (Task 6) - Nice to have
9. **Imagem do Leão** (Task 2) - Aguarda especificação

### Fase 4: Validação (1 dia)
10. **Testes E2E completos** (Tasks 8, 9)

---

## 📋 Checklist de Implementação

### Antes de Começar
- [ ] Confirmar com cliente as especificações faltantes:
  - [ ] Imagens de referência do Lobby
  - [ ] Local exato para a imagem do leão
  - [ ] Priorização das tarefas
- [ ] Fazer backup do banco de dados
- [ ] Criar branch de desenvolvimento: `git checkout -b feature/client-requests-dec-2025`

### Durante Implementação
- [ ] Testar cada feature em ambiente local
- [ ] Rodar testes E2E após cada mudança: `npm test`
- [ ] Documentar mudanças no CHANGELOG
- [ ] Fazer commits incrementais

### Antes do Deploy
- [ ] Rodar suite completa de testes
- [ ] Testar em ambiente de staging
- [ ] Validar com cliente antes de produção
- [ ] Preparar rollback plan

---

## 📞 Perguntas Pendentes para o Cliente

1. **Leão**: Pode enviar a imagem e especificar onde deve ser colocada?
2. **Lobby**: Pode reenviar as imagens de referência do layout esperado?
3. **Prioridade**: Qual feature é mais urgente para você?
4. **Erro anúncios**: Consegue tirar print do erro que aparece no console?
5. **Admin**: Qual email você está usando para tentar acessar o painel admin?

---

## 🔧 Comandos Úteis para Implementação

```powershell
# Setup inicial
.\backend\scripts\setup-local-db.ps1

# Rodar migração
cd backend
npm run db:migrate

# Testar feature específica
npm test -- tests/contractor-flow.spec.js

# Build para produção
npm run build

# Deploy backend (Render)
git push origin main

# Deploy frontend (Vercel)
# Automático via GitHub
```

---

## 📊 Estimativa de Tempo

| Fase | Tarefas | Tempo Estimado |
|------|---------|----------------|
| Fase 1: Críticos | 4 tarefas | 1-2 dias |
| Fase 2: Features | 3 tarefas | 2-3 dias |
| Fase 3: Melhorias | 2 tarefas | 1 dia |
| Fase 4: Validação | 2 tarefas | 1 dia |
| **TOTAL** | **11 tarefas** | **5-7 dias** |

---

**Última atualização**: 26/12/2025  
**Responsável**: Marcus Lima  
**Status**: Aguardando aprovação do cliente
