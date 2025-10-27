# 🎨 REDESIGN KADESH - Plano de Desenvolvimento Visual
## Baseado em https://kaddeshsolucoes.com.br/kadeesh/

---

## 🎯 **OBJETIVOS PRINCIPAIS**

### 1. **VISUAL REFERENCE** - Kaddesh Soluções
- **Cores principais**: Azul escuro (`#1a365d`), Verde (`#38a169`), Branco, Cinza moderno
- **Tipografia**: Fonte moderna, bold, hierarquia clara
- **Layout**: Cards com imagens, grid responsivo, espaçamento generoso
- **Elementos**: Badges de "LANCE REVERSO", cronômetros, placar percentual
- **Conceito**: Leilão reverso profissional para construção civil

### 2. **FUNCIONALIDADES OBRIGATÓRIAS**
- **Projetos abertos visíveis SEM login** na página inicial
- **Login obrigatório apenas para dar lances/interagir**
- **Sistema de leilão reverso**: menor preço + reputação
- **Cronômetro de encerramento** em tempo real
- **Placar dinâmico** (70% preço + 30% reputação)

---

## 📋 **ESCOPO FUNCIONAL** (baseado em /escopo)

### 🏢 **CONTRATANTE** (Contractor)
```
✅ Cadastro KYC
✅ Validação do Cadastro  
✅ Inclusão de Proposta (criar projeto)
✅ Visualização das Propostas (lances recebidos)
✅ Acompanhamento do Leilão (tempo real)
✅ Conferência dos Lances
✅ Finalização da Proposta (escolher vencedor)
✅ Início de Trabalho
✅ Acompanhamento de Trabalho
✅ Término do Trabalho
✅ Validação da Finalização
✅ Pagamento ao contratado
✅ Avaliação do Contratado
✅ Finalização do Processo
```

### ⚡ **CONTRATADO/FORNECEDOR** (Provider)
```
✅ Cadastro
✅ Validação do Cadastro
✅ Buscar Propostas (filtros)
✅ Filtrar Propostas
✅ Dar Lance
✅ Acompanhar os Lances (tempo real)
✅ Concretizar proposta Ganha
✅ Executar Trabalho
✅ Finalizar trabalho
✅ Confirmar recebimento do Pagamento
✅ Avaliar o Contratante
```

---

## 🎨 **NOVA IDENTIDADE VISUAL**

### **PALETA DE CORES**
```css
:root {
  /* Primárias */
  --primary-dark: #1a365d;      /* Azul escuro principal */
  --primary-blue: #3182ce;      /* Azul médio */
  --success-green: #38a169;     /* Verde sucesso */
  --warning-orange: #ed8936;    /* Laranja avisos */
  --danger-red: #e53e3e;        /* Vermelho erro */
  
  /* Neutros */
  --gray-50: #f7fafc;
  --gray-100: #edf2f7;
  --gray-200: #e2e8f0;
  --gray-500: #718096;
  --gray-700: #2d3748;
  --gray-900: #1a202c;
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #1a365d 0%, #3182ce 100%);
  --gradient-success: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
}
```

### **TIPOGRAFIA**
```css
/* Fonte principal: Inter/Roboto */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

---

## 🏠 **HOMEPAGE REDESIGN**

### **SEÇÃO 1: HERO**
```vue
<section class="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
  <div class="container mx-auto px-4 py-20">
    <div class="text-center text-white">
      <h1 class="text-5xl font-extrabold mb-6">
        Ganhe contratos com 
        <span class="text-green-400">lances reversos</span>
      </h1>
      <p class="text-xl text-blue-200 mb-8">
        Menor preço + reputação. Sistema de leilão profissional.
      </p>
      <div class="flex gap-4 justify-center">
        <button class="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-lg font-bold">
          Ver Leilões Ativos
        </button>
        <button class="border border-white px-8 py-4 rounded-lg font-bold">
          Como Funciona
        </button>
      </div>
    </div>
  </div>
</section>
```

### **SEÇÃO 2: LEILÕES ATIVOS** (SEM LOGIN)
```vue
<section class="bg-gray-50 py-16">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Leilões Ativos</h2>
    
    <!-- Grid de projetos -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="project in activeProjects" :key="project.id" 
           class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        
        <!-- Imagem do projeto -->
        <div class="h-48 bg-gray-200 relative">
          <img :src="project.image" class="w-full h-full object-cover" />
          <div class="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            LANCE REVERSO {{ project.rating }}
          </div>
        </div>
        
        <!-- Conteúdo -->
        <div class="p-6">
          <h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>
          
          <!-- Métricas -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <span class="text-sm text-gray-500">Menor lance</span>
              <div class="text-2xl font-bold text-green-600">R$ {{ project.lowest_bid }}</div>
            </div>
            <div class="text-right">
              <span class="text-sm text-gray-500">Tempo restante</span>
              <div class="text-lg font-bold text-orange-600">{{ project.time_left }}</div>
            </div>
          </div>
          
          <!-- Placar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span>Placar (70% preço + 30% reputação)</span>
              <span class="font-bold">{{ project.score }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-green-500 h-2 rounded-full" :style="`width: ${project.score}%`"></div>
            </div>
          </div>
          
          <!-- Botão de ação -->
          <button @click="requireLogin" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors">
            Dar meu lance
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 🔧 **COMPONENTES A DESENVOLVER**

### **1. ProjectCard.vue** - Card de projeto na home
- ✅ Imagem de destaque
- ✅ Badge "LANCE REVERSO" + rating
- ✅ Título e descrição
- ✅ Menor lance atual
- ✅ Cronômetro tempo restante
- ✅ Barra de progresso do placar
- ✅ Botão "Dar meu lance" (redireciona para login)

### **2. CountdownTimer.vue** - Cronômetro tempo real
```vue
<template>
  <div class="text-center">
    <div class="text-2xl font-bold text-orange-600">
      {{ timeLeft.days }}d {{ timeLeft.hours }}h {{ timeLeft.minutes }}m {{ timeLeft.seconds }}s
    </div>
    <div class="text-sm text-gray-500">Tempo restante</div>
  </div>
</template>
```

### **3. ScoreProgress.vue** - Placar ponderado
```vue
<template>
  <div class="mb-4">
    <div class="flex justify-between text-sm mb-1">
      <span>Placar (70% preço + 30% reputação)</span>
      <span class="font-bold">{{ score }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
           :style="`width: ${score}%`"></div>
    </div>
  </div>
</template>
```

### **4. BidCard.vue** - Card de lance individual
```vue
<template>
  <div class="bg-white border-l-4 border-blue-500 p-4 rounded-lg shadow">
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {{ provider.name[0] }}
        </div>
        <div>
          <h4 class="font-bold">{{ provider.name }}</h4>
          <div class="flex items-center gap-2">
            <StarRating :rating="provider.rating" size="sm" />
            <span class="text-sm text-gray-500">({{ provider.reviews }} avaliações)</span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-green-600">R$ {{ bid.amount }}</div>
        <div class="text-sm text-gray-500">{{ bid.delivery_days }} dias</div>
      </div>
    </div>
    
    <p class="mt-3 text-gray-700">{{ bid.proposal }}</p>
    
    <div class="mt-4 flex justify-between items-center">
      <span class="text-sm font-medium text-blue-600">Placar: {{ bid.score }}%</span>
      <button v-if="canAccept" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
        Aceitar Lance
      </button>
    </div>
  </div>
</template>
```

---

## 📱 **PÁGINAS A REDESENHAR**

### **1. HOME** `/`
- ✅ Hero section com call-to-action
- ✅ Grid de leilões ativos (sem login)
- ✅ Seção "Como funciona"
- ✅ Estatísticas da plataforma
- ✅ Footer com áreas de atuação

### **2. PROJETOS** `/projects`
- ✅ Filtros por categoria/localização
- ✅ Ordenação por: tempo restante, menor lance, placar
- ✅ Visualização: grid/lista
- ✅ Paginação
- ✅ Search/filtros avançados

### **3. PROJETO INDIVIDUAL** `/projects/:id`
- ✅ Galeria de imagens
- ✅ Descrição completa
- ✅ Cronômetro grande
- ✅ Lista de lances em tempo real
- ✅ Formulário para dar lance (logado)
- ✅ Chat do projeto
- ✅ Anexos/documentos

### **4. DASHBOARD FORNECEDOR** `/provider/dashboard`
- ✅ Meus lances ativos
- ✅ Projetos ganhos
- ✅ Calendário de entregas
- ✅ Estatísticas pessoais
- ✅ Notificações

### **5. DASHBOARD CONTRATANTE** `/contractor/dashboard`
- ✅ Meus projetos publicados
- ✅ Lances recebidos
- ✅ Projetos em andamento
- ✅ Histórico de pagamentos

---

## ⚡ **FUNCIONALIDADES CRÍTICAS**

### **1. SISTEMA DE LANCES**
```javascript
// Cálculo do placar ponderado
function calculateScore(bid, project) {
  const priceScore = (project.max_budget - bid.amount) / project.max_budget * 100;
  const reputationScore = bid.provider.rating / 5 * 100;
  
  return (priceScore * 0.7) + (reputationScore * 0.3);
}

// WebSocket para lances em tempo real
socket.on('new_bid', (data) => {
  updateProjectBids(data.project_id, data.bid);
  updateLeaderboard(data.project_id);
});
```

### **2. CRONÔMETRO TEMPO REAL**
```javascript
// Countdown timer component
function useCountdown(endDate) {
  const timeLeft = ref({});
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = new Date(endDate).getTime() - now;
    
    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  };
  
  const interval = setInterval(updateCountdown, 1000);
  onUnmounted(() => clearInterval(interval));
  
  return timeLeft;
}
```

### **3. FILTROS AVANÇADOS**
- **Por categoria**: Obra, Pintura, Elétrica, Hidráulica, etc.
- **Por localização**: CEP, cidade, região
- **Por prazo**: até 7 dias, até 30 dias, etc.
- **Por orçamento**: faixas de valor
- **Por status**: aberto, em andamento, encerrado

---

## 🚀 **CRONOGRAMA DE DESENVOLVIMENTO**

### **FASE 1: FOUNDATION** (3-4 dias)
- ✅ Setup das novas cores/tipografia
- ✅ Componentes base (Button, Card, Input)
- ✅ Layout responsivo mobile-first
- ✅ Sistema de grid

### **FASE 2: HOMEPAGE** (2-3 dias)
- ✅ Hero section redesign
- ✅ Grid de projetos sem login
- ✅ Integração API projetos ativos
- ✅ Call-to-action para registro

### **FASE 3: COMPONENTES CORE** (4-5 dias)
- ✅ ProjectCard component
- ✅ CountdownTimer component
- ✅ ScoreProgress component
- ✅ BidCard component
- ✅ FilterBar component

### **FASE 4: PÁGINAS PRINCIPAIS** (5-6 dias)
- ✅ /projects redesign
- ✅ /projects/:id redesign
- ✅ Dashboards contractor/provider
- ✅ Formulários de lance

### **FASE 5: TEMPO REAL** (3-4 dias)
- ✅ WebSocket setup
- ✅ Lances em tempo real
- ✅ Cronômetros sincronizados
- ✅ Notificações push

### **FASE 6: POLIMENTO** (2-3 dias)
- ✅ Animações e microinterações
- ✅ Testes responsivos
- ✅ Performance optimization
- ✅ Deploy e testes

---

## 🎯 **PRÓXIMOS PASSOS**

1. **APROVAR** este plano de redesign
2. **IMPLEMENTAR** Fase 1 (cores, tipografia, componentes base)
3. **REDESENHAR** homepage com projetos visíveis
4. **DESENVOLVER** sistema de lances em tempo real
5. **TESTAR** e ajustar UX/UI
6. **DEPLOY** versão modernizada

---

**Total estimado**: 18-24 dias de desenvolvimento
**Resultado**: Sistema moderno, profissional e competitivo com Kaddesh Soluções 🚀