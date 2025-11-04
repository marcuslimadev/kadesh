<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>

      <div class="container-responsive relative">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Logo/Badge -->
          <div class="inline-flex items-center gap-3 px-6 py-3 mb-8 border border-primary-200 bg-white/80 backdrop-blur-sm rounded-full shadow-primary">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">K</span>
            </div>
            <span class="font-bold text-lg text-primary-700">KADESH</span>
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
            Ganhe contratos com
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
              lances reversos
            </span>
          </h1>

          <p class="text-xl lg:text-2xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Menor preço + reputação. Sistema de leilão profissional para construção civil e serviços.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button @click="scrollToProjects" class="btn-primary btn-lg px-8 py-4 text-lg">
              <span class="flex items-center gap-2">
                🔍 Ver leilões ativos
              </span>
            </button>
            <router-link to="/register" class="btn-outline-primary btn-lg px-8 py-4 text-lg">
              <span class="flex items-center gap-2">
                🚀 Participar agora
              </span>
            </router-link>
          </div>

          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div class="card card-hover group p-6 text-center">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📊</div>
              <div class="text-3xl font-bold text-primary-600 mb-1">
                <span class="text-primary-500">+</span>{{ stats.totalProjects }}<span class="text-primary-500">+</span>
              </div>
              <div class="text-neutral-600 font-medium">Projetos ativos</div>
            </div>

            <div class="card card-hover group p-6 text-center">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👥</div>
              <div class="text-3xl font-bold text-secondary-600 mb-1">
                <span class="text-secondary-500">+</span>{{ stats.totalProviders }}<span class="text-secondary-500">+</span>
              </div>
              <div class="text-neutral-600 font-medium">Fornecedores</div>
            </div>

            <div class="card card-hover group p-6 text-center">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
              <div class="text-3xl font-bold text-success-600 mb-1">35%</div>
              <div class="text-neutral-600 font-medium">Economia média</div>
            </div>

            <div class="card card-hover group p-6 text-center">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <div class="text-3xl font-bold text-warning-600 mb-1">24h</div>
              <div class="text-neutral-600 font-medium">Tempo médio</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Leilões Ativos - PÚBLICO (sem login) -->
    <section ref="projectsSection" class="py-20 bg-white">
      <div class="container-responsive">
        <!-- Barra de categorias -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'badge px-4 py-2 transition-all duration-200 hover:scale-105',
              selectedCategory === cat ? 'badge-primary' : 'badge-neutral hover:bg-neutral-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <div class="text-center mb-12">
          <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Leilões Ativos
          </h2>
          <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
            Padrão: 70% preço + 30% reputação
          </p>
        </div>

        <!-- Filtros avançados -->
        <div class="card card-elevated p-8 mb-12 max-w-6xl mx-auto">
          <div class="grid grid-responsive-cols-4 gap-6 mb-6">
            <!-- Filtro por categoria -->
            <div>
              <label class="label">🏷️ Categoria</label>
              <select v-model="selectedCategory" class="select">
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Filtro por orçamento -->
            <div>
              <label class="label">💰 Orçamento</label>
              <select v-model="budgetFilter" class="select">
                <option value="">Todos os valores</option>
                <option value="0-1000">Até R$ 1.000</option>
                <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
                <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                <option value="10000-">Acima de R$ 10.000</option>
              </select>
            </div>

            <!-- Filtro por localização -->
            <div>
              <label class="label">📍 Localização</label>
              <select v-model="locationFilter" class="select">
                <option value="">Todas as cidades</option>
                <option value="SP">São Paulo - SP</option>
                <option value="RJ">Rio de Janeiro - RJ</option>
                <option value="BH">Belo Horizonte - MG</option>
                <option value="DF">Brasília - DF</option>
                <option value="RS">Porto Alegre - RS</option>
              </select>
            </div>

            <!-- Filtro por urgência -->
            <div>
              <label class="label">⏰ Urgência</label>
              <select v-model="urgencyFilter" class="select">
                <option value="">Todos os prazos</option>
                <option value="urgent">Urgente (&lt; 24h)</option>
                <option value="soon">Breve (&lt; 3 dias)</option>
                <option value="normal">Normal (&gt; 3 dias)</option>
              </select>
            </div>
          </div>

          <!-- Busca por texto -->
          <div class="mb-6">
            <input
              v-model="searchText"
              type="text"
              placeholder="🔍 Buscar por título, descrição ou habilidades"
              class="input input-lg w-full"
            />
          </div>

          <!-- Contador de resultados e controles -->
          <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
            <p class="text-neutral-700 font-medium">
              Mostrando <strong class="text-primary-600">{{ filteredProjects.length }}</strong> de <strong class="text-primary-600">{{ projects.length }}</strong> leilões ativos
            </p>

            <div class="flex flex-wrap items-center gap-4">
              <!-- Ordenação -->
              <div class="flex items-center gap-2">
                <label class="text-sm text-neutral-600 font-medium">Ordenar por:</label>
                <select class="select text-sm min-w-48">
                  <option>Placar (maior)</option>
                  <option>Menor preço</option>
                  <option>Maior reputação</option>
                  <option>Menor tempo restante</option>
                </select>
              </div>

              <!-- Auto refresh toggle -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="autoRefresh"
                  @change="autoRefresh ? startAutoRefresh() : stopAutoRefresh()"
                  class="checkbox"
                />
                <span class="text-sm text-neutral-600 font-medium">Atualização automática</span>
              </label>

              <!-- Manual refresh button -->
              <button
                @click="fetchProjects()"
                :disabled="loading"
                class="btn-secondary btn-sm"
              >
                <span v-if="loading" class="loading-spinner mr-2"></span>
                <span v-if="loading">Atualizando…</span>
                <span v-else>🔄 Atualizar</span>
              </button>

              <!-- Last refresh time -->
              <span class="text-sm text-neutral-500">
                Atualizado {{ getLastRefreshTime() }} atrás
              </span>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p class="text-xl font-semibold text-neutral-600">Carregando leilões...</p>
        </div>

        <!-- Grid de Projetos -->
        <div v-else class="grid grid-responsive-cols-3 gap-8">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="card card-hover group"
          >
            <!-- Imagem do projeto -->
            <div class="relative h-48 bg-neutral-100 overflow-hidden rounded-t-xl">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <div class="text-center text-neutral-400">
                  <div class="text-4xl mb-2">🏗️</div>
                  <div class="text-sm font-medium uppercase">Sem imagem</div>
                </div>
              </div>
              <!-- Badge categoria -->
              <div class="absolute top-3 right-3">
                <span class="badge badge-neutral">{{ project.category || 'Obra' }}</span>
              </div>
            </div>

            <!-- Conteúdo -->
            <div class="card-body">
              <div class="flex justify-between items-start mb-3">
                <span class="badge badge-primary">LANCE REVERSO</span>
                <span class="badge badge-neutral flex items-center gap-1">
                  ⭐ {{ project.provider_rating?.toFixed ? project.provider_rating.toFixed(1) : project.provider_rating || '4.5' }}
                </span>
              </div>

              <h3 class="text-xl font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {{ project.title }}
              </h3>

              <p class="text-neutral-600 mb-4 line-clamp-2">
                {{ project.description }}
              </p>

              <!-- Métricas principais -->
              <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs text-neutral-500 uppercase font-semibold mb-1">Menor lance</div>
                    <div class="text-lg font-bold text-success-600">
                      R$ {{ formatCurrency(project.lowest_bid) }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-neutral-500 uppercase font-semibold mb-1">Tempo restante</div>
                    <CountdownTimer
                      :endTime="project.bidding_ends_at"
                      size="small"
                      @expired="() => onTimerExpired(project)"
                      @urgent="() => onTimerUrgent(project)"
                    />
                  </div>
                </div>
              </div>

              <!-- Placar dinâmico -->
              <div class="mb-4">
                <div class="text-sm text-neutral-600 mb-2">Placar (70% preço + 30% reputação)</div>
                <ScoreProgress
                  :currentBid="project.lowest_bid"
                  :maxBudget="project.max_budget"
                  :providerRating="project.provider_rating"
                  :priceWeight="70"
                  :reputationWeight="30"
                  @scoreChange="(scoreData) => onScoreChange(project, scoreData)"
                />
              </div>

              <!-- Informações extras -->
              <div class="flex justify-between items-center text-sm text-neutral-600 mb-4">
                <span class="flex items-center gap-1">
                  📍 {{ project.location || 'São Paulo - SP' }}
                </span>
                <span class="badge badge-neutral">
                  {{ project.bids_count || 0 }} lances
                </span>
              </div>

              <!-- Botão de ação -->
              <button
                @click="handleBidClick(project)"
                class="btn-primary w-full group-hover:shadow-lg transition-shadow"
              >
                🚀 Dar meu lance
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="text-center py-16">
          <div class="card card-elevated p-8 max-w-lg mx-auto">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-3">Nenhum leilão encontrado</h3>
            <p class="text-neutral-600 mb-6">
              Ajuste os filtros ou limpe a pesquisa para visualizar novos resultados disponíveis.
            </p>

            <!-- Clear filters button -->
            <button @click="clearAllFilters" class="btn-secondary mb-4">
              🧹 Limpar filtros
            </button>

            <!-- Current filter info -->
            <div v-if="hasActiveFilters" class="text-left">
              <p class="font-medium text-neutral-700 mb-3">Filtros ativos:</p>
              <div class="flex flex-wrap gap-2 justify-center">
                <span v-if="selectedCategory !== 'Todos'" class="badge badge-primary">{{ selectedCategory }}</span>
                <span v-if="budgetFilter" class="badge badge-primary">{{ getBudgetLabel(budgetFilter) }}</span>
                <span v-if="locationFilter" class="badge badge-primary">{{ getLocationLabel(locationFilter) }}</span>
                <span v-if="urgencyFilter" class="badge badge-primary">{{ getUrgencyLabel(urgencyFilter) }}</span>
                <span v-if="searchText" class="badge badge-primary">"{{ searchText }}"</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-12">
          <router-link to="/projects" class="btn-ghost text-lg group">
            <span class="group-hover:underline">Ver todos os leilões</span>
            <span class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Como Funciona -->
    <section class="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div class="container-responsive">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Como Funciona
          </h2>
          <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
            Sistema de leilão reverso que garante os melhores preços e qualidade
          </p>
        </div>

        <div class="grid grid-responsive-cols-3 gap-8">
          <!-- Passo 1 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-sm font-semibold uppercase">Etapa 1</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">1. Encontre serviços</h3>
            <p class="text-neutral-600 leading-relaxed">
              Use filtros por categoria, localização e prazo. Veja reputação e histórico dos fornecedores.
            </p>
          </div>

          <!-- Passo 2 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-sm font-semibold uppercase">Etapa 2</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">2. Envie sua proposta</h3>
            <p class="text-neutral-600 leading-relaxed">
              Lances reversos: ganha o menor preço ponderado por credibilidade. Placar em tempo real.
            </p>
          </div>

          <!-- Passo 3 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-secondary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <span class="text-sm font-semibold uppercase">Etapa 3</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">3. Execute com segurança</h3>
            <p class="text-neutral-600 leading-relaxed">
              Escrow, milestones e liberação por aceite garantem segurança mútua para ambas as partes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div class="container-responsive text-center">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">
          Pronto para começar seu projeto?
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de empresas que já economizam com nosso sistema de leilão reverso.
        </p>
        <router-link to="/register" class="btn-ghost btn-lg group">
          <span class="group-hover:scale-105 transition-transform inline-block">Criar conta gratuita</span>
          <span class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </router-link>
      </div>
    </section>

    <!-- Bid Modal -->
    <BidModal
      :isOpen="bidModalOpen"
      :project="selectedProject"
      :existingBids="projectBids"
      :currentUser="currentUser"
      @close="closeBidModal"
      @bidSubmitted="onBidSubmitted"
      @biddingExpired="onBiddingExpired"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import CountdownTimer from '../components/CountdownTimer.vue';
import ScoreProgress from '../components/ScoreProgress.vue';
import BidModal from '../components/BidModal.vue';

const router = useRouter();
const projects = ref([]);
const loading = ref(true);
const selectedCategory = ref('Todos');
const projectsSection = ref(null);

// Modal state
const bidModalOpen = ref(false);
const selectedProject = ref(null);
const projectBids = ref([]);
const currentUser = ref(null);

// Advanced filters
const budgetFilter = ref('');
const locationFilter = ref('');
const urgencyFilter = ref('');
const searchText = ref('');

// Real-time updates
const autoRefresh = ref(true);
const refreshInterval = ref(null);
const lastRefresh = ref(new Date());

const categories = ['Todos', 'Obra', 'Pintura', 'Elétrica', 'Hidráulica', 'Impermeabilização', 'HVAC', 'Drywall', 'Solar'];

const stats = ref({
  totalProjects: 0,
  totalProviders: 0
});

const filteredProjects = computed(() => {
  let filtered = projects.value;

  // Filtro por categoria
  if (selectedCategory.value && selectedCategory.value !== 'Todos') {
    filtered = filtered.filter(p => 
      p.category === selectedCategory.value || 
      p.title.toLowerCase().includes(selectedCategory.value.toLowerCase())
    );
  }

  // Filtro por orçamento
  if (budgetFilter.value) {
    const [min, max] = budgetFilter.value.split('-').map(v => v ? parseInt(v) : null);
    filtered = filtered.filter(p => {
      if (min && max) return p.max_budget >= min && p.max_budget <= max;
      if (min) return p.max_budget >= min;
      if (max) return p.max_budget <= max;
      return true;
    });
  }

  // Filtro por localização
  if (locationFilter.value) {
    filtered = filtered.filter(p => 
      p.location && p.location.includes(locationFilter.value)
    );
  }

  // Filtro por urgência (baseado no tempo restante para lances)
  if (urgencyFilter.value) {
    const now = new Date();
    filtered = filtered.filter(p => {
      if (!p.bidding_ends_at) return true;
      
      const endTime = new Date(p.bidding_ends_at);
      const hoursRemaining = (endTime - now) / (1000 * 60 * 60);
      
      switch (urgencyFilter.value) {
        case 'urgent': return hoursRemaining < 24;
        case 'soon': return hoursRemaining >= 24 && hoursRemaining < 72;
        case 'normal': return hoursRemaining >= 72;
        default: return true;
      }
    });
  }

  // Filtro por texto (busca em título, descrição e habilidades)
  if (searchText.value.trim()) {
    const search = searchText.value.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.title?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search) ||
      p.required_skills?.toLowerCase().includes(search)
    );
  }

  return filtered;
});

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'Todos' || 
         budgetFilter.value || 
         locationFilter.value || 
         urgencyFilter.value || 
         searchText.value.trim();
});

function clearAllFilters() {
  selectedCategory.value = 'Todos';
  budgetFilter.value = '';
  locationFilter.value = '';
  urgencyFilter.value = '';
  searchText.value = '';
}

function getBudgetLabel(value) {
  const labels = {
    '0-1000': 'Até R$ 1.000',
    '1000-5000': 'R$ 1.000 - R$ 5.000',
    '5000-10000': 'R$ 5.000 - R$ 10.000',
    '10000-': 'Acima de R$ 10.000'
  };
  return labels[value] || value;
}

function getLocationLabel(value) {
  const labels = {
    'SP': 'São Paulo - SP',
    'RJ': 'Rio de Janeiro - RJ',
    'BH': 'Belo Horizonte - MG',
    'DF': 'Brasília - DF',
    'RS': 'Porto Alegre - RS'
  };
  return labels[value] || value;
}

function getUrgencyLabel(value) {
  const labels = {
    'urgent': 'Urgente (< 24h)',
    'soon': 'Breve (< 3 dias)',
    'normal': 'Normal (> 3 dias)'
  };
  return labels[value] || value;
}

function getLastRefreshTime() {
  const now = new Date();
  const diff = Math.floor((now - lastRefresh.value) / 1000);
  
  if (diff < 60) return `há ${diff}s`;
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
  return `há ${Math.floor(diff / 3600)}h`;
}

function scrollToProjects() {
  projectsSection.value?.scrollIntoView({ behavior: 'smooth' });
}

function requireLogin(project) {
  // Salvar projeto de interesse no localStorage
  localStorage.setItem('interestedProject', JSON.stringify(project));
  router.push('/login?redirect=bid');
}

async function handleBidClick(project) {
  // Verificar se usuário está logado
  if (!currentUser.value) {
    requireLogin(project);
    return;
  }

  // Verificar se usuário pode dar lances (provider)
  if (currentUser.value.user_type !== 'provider' && currentUser.value.user_type !== 'both') {
    alert('Apenas fornecedores podem participar de leilões. Cadastre-se como fornecedor para dar lances.');
    return;
  }

  // Carregar dados do projeto e abrir modal
  selectedProject.value = project;
  await loadProjectBids(project.id);
  bidModalOpen.value = true;
}

async function loadProjectBids(projectId) {
  try {
    const { data } = await api.get(`/api/projects/${projectId}/bids`);
    projectBids.value = data;
  } catch (error) {
    console.error('Erro ao carregar lances:', error);
    projectBids.value = [];
  }
}

function closeBidModal() {
  bidModalOpen.value = false;
  selectedProject.value = null;
  projectBids.value = [];
}

async function onBidSubmitted() {
  // Recarregar projetos para atualizar contadores
  await fetchProjects();
  // Recarregar lances do projeto
  if (selectedProject.value) {
    await loadProjectBids(selectedProject.value.id);
  }
}

function onBiddingExpired() {
  // Projeto expirou, recarregar lista
  fetchProjects();
}

async function fetchUser() {
  try {
    const { data } = await api.get('/api/user');
    currentUser.value = data.user;
  } catch (error) {
    currentUser.value = null;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function getLowestBid(project) {
  // Simular menor lance (80-95% do orçamento)
  const discount = 0.8 + (Math.random() * 0.15);
  return Math.round(project.max_budget * discount);
}

function getProviderRating(project) {
  // Simular rating do melhor fornecedor (3.5-5.0)
  return (3.5 + (Math.random() * 1.5)).toFixed(1);
}

function onTimerExpired(project) {
  console.log('Projeto encerrado:', project.title);
  // Aqui você pode atualizar o status do projeto
}

function onTimerUrgent(project) {
  console.log('Projeto urgente:', project.title);
  // Aqui você pode mostrar notificação
}

function onScoreChange(project, scoreData) {
  console.log('Score atualizado:', project.title, scoreData);
  // Aqui você pode atualizar estatísticas
}

async function fetchProjects() {
  try {
    loading.value = true;
    const { data } = await api.get('/api/projects');
    // Permitir duas formas de retorno: { projects: [...] } ou [ ... ]
    const projetos = Array.isArray(data.projects) ? data.projects : (Array.isArray(data) ? data : []);
    projects.value = projetos.filter(p =>
      p.status === 'open' || p.status === 'bidding'
    ).map(project => ({
      ...project,
      // Adicionar dados simulados para demonstração
      lowest_bid: getLowestBid(project),
      provider_rating: parseFloat(getProviderRating(project)),
      bids_count: Math.floor(Math.random() * 12) + 1,
      location: project.location || 'São Paulo - SP',
      category: project.category || 'Obra',
      image: `https://images.unsplash.com/photo-${1560448204 + (project.id * 1000)}-e02f11c3d0e2?q=80&w=1470&auto=format&fit=crop`
    }));
    
    stats.value = {
      totalProjects: projects.value.length,
      totalProviders: data.total_providers || 150
    };

    // Atualizar timestamp da última atualização
    lastRefresh.value = new Date();
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    projects.value = []; // Fallback para array vazio
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUser();
  fetchProjects();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});

function startAutoRefresh() {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
  
  if (autoRefresh.value) {
    // Atualizar a cada 30 segundos
    refreshInterval.value = setInterval(() => {
      fetchProjects();
    }, 30000);
  }
}

function stopAutoRefresh() {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
    refreshInterval.value = null;
  }
}
</script>




