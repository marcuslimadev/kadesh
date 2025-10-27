<template>
  <div>
    <!-- Hero Section - Baseado em Kaddesh Soluções -->
    <section class="bg-gradient-hero text-white relative overflow-hidden min-h-[80vh]">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-success-500 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div class="text-center">
          <!-- Logo/Badge -->
          <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
            <div class="w-8 h-8 bg-gradient-success rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">K</span>
            </div>
            <span class="text-lg font-bold">Kadesh</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Ganhe contratos com 
            <span class="text-success-400 animate-pulse-slow">lances reversos</span>
          </h1>
          <p class="text-xl sm:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto">
            Menor preço + reputação. Sistema de leilão profissional para construção civil e serviços.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button @click="scrollToProjects" 
                    class="bg-gradient-success hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl">
              📋 Ver Leilões Ativos
            </button>
            <router-link to="/register" 
                         class="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg">
              🚀 Participar Agora
            </router-link>
          </div>

          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-extrabold text-success-400">{{ stats.totalProjects }}+</div>
              <div class="text-blue-200 text-sm">Projetos ativos</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-extrabold text-warning-400">{{ stats.totalProviders }}+</div>
              <div class="text-blue-200 text-sm">Fornecedores</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-extrabold text-purple-400">35%</div>
              <div class="text-blue-200 text-sm">Economia média</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-extrabold text-cyan-400">24h</div>
              <div class="text-blue-200 text-sm">Tempo médio</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Leilões Ativos - PÚBLICO (sem login) -->
    <section ref="projectsSection" class="bg-neutral-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-neutral-900 mb-4">
            🎯 Leilões Ativos
          </h2>
          <p class="text-xl text-neutral-600 mb-6">
            Padrão: 70% preço + 30% reputação
          </p>
          
          <!-- Filtros avançados -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-4xl mx-auto">
            <div class="grid md:grid-cols-4 gap-4">
              <!-- Filtro por categoria -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">🏷️ Categoria</label>
                <select v-model="selectedCategory" 
                        class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Filtro por orçamento -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">💰 Orçamento</label>
                <select v-model="budgetFilter" 
                        class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">
                  <option value="">Todos os valores</option>
                  <option value="0-1000">Até R$ 1.000</option>
                  <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
                  <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                  <option value="10000-">Acima de R$ 10.000</option>
                </select>
              </div>

              <!-- Filtro por localização -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">📍 Localização</label>
                <select v-model="locationFilter" 
                        class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">
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
                <label class="block text-sm font-bold text-gray-700 mb-2">⏰ Urgência</label>
                <select v-model="urgencyFilter" 
                        class="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">
                  <option value="">Todos os prazos</option>
                  <option value="urgent">Urgente (< 24h)</option>
                  <option value="soon">Breve (< 3 dias)</option>
                  <option value="normal">Normal (> 3 dias)</option>
                </select>
              </div>
            </div>

            <!-- Busca por texto -->
            <div class="mt-4">
              <div class="relative">
                <input v-model="searchText" 
                       type="text" 
                       placeholder="🔍 Buscar por título, descrição ou habilidades..."
                       class="w-full border-2 border-gray-200 rounded-lg px-4 py-3 pl-10 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all">
                <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            <!-- Contador de resultados e status de auto-refresh -->
            <div class="mt-4 flex flex-col sm:flex-row items-center justify-between">
              <p class="text-sm text-gray-600">
                📊 Mostrando <strong>{{ filteredProjects.length }}</strong> de <strong>{{ projects.length }}</strong> leilões ativos
              </p>
              
              <div class="flex items-center gap-4 mt-2 sm:mt-0">
                <!-- Auto refresh toggle -->
                <label class="flex items-center gap-2 text-sm">
                  <input 
                    v-model="autoRefresh" 
                    @change="autoRefresh ? startAutoRefresh() : stopAutoRefresh()"
                    type="checkbox" 
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-gray-600">🔄 Atualização automática</span>
                </label>
                
                <!-- Manual refresh button -->
                <button 
                  @click="fetchProjects()" 
                  :disabled="loading"
                  class="text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 px-3 py-1 rounded-lg transition-all disabled:opacity-50"
                >
                  <span v-if="loading">⏳</span>
                  <span v-else>🔄</span>
                  Atualizar
                </button>
                
                <!-- Last refresh time -->
                <span class="text-xs text-gray-500">
                  Atualizado {{ getLastRefreshTime() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-neutral-600">Carregando leilões...</p>
        </div>

        <!-- Grid de Projetos -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="project in filteredProjects" :key="project.id" 
               class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
            
            <!-- Imagem do projeto -->
            <div class="h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 relative overflow-hidden">
              <img v-if="project.image" 
                   :src="project.image" 
                   :alt="project.title"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <span class="text-4xl text-primary-600">🏗️</span>
              </div>
              
              <!-- Badge Lance Reverso -->
              <div class="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                LANCE REVERSO {{ project.provider_rating || '4.0' }}
              </div>
            </div>
            
            <!-- Conteúdo -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
                {{ project.title }}
              </h3>
              <p class="text-neutral-600 mb-4 line-clamp-3">
                {{ project.description }}
              </p>
              
              <!-- Métricas principais -->
              <div class="flex justify-between items-center mb-4">
                <div>
                  <span class="text-sm text-neutral-500 block">Menor lance</span>
                  <div class="text-2xl font-bold text-success-600">
                    R$ {{ formatCurrency(project.lowest_bid) }}
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm text-neutral-500 block">Tempo restante</span>
                  <CountdownTimer 
                    :end-date="project.bidding_ends_at"
                    size="medium"
                    @expired="() => onTimerExpired(project)"
                    @urgent="() => onTimerUrgent(project)"
                  />
                </div>
              </div>
              
              <!-- Placar dinâmico -->
              <div class="mb-4">
                <ScoreProgress
                  :bid-amount="project.lowest_bid"
                  :max-budget="project.max_budget"
                  :provider-rating="project.provider_rating"
                  :price-weight="70"
                  :reputation-weight="30"
                  @score-change="(scoreData) => onScoreChange(project, scoreData)"
                />
              </div>
              
              <!-- Informações extras -->
              <div class="flex items-center justify-between text-sm text-neutral-500 mb-4">
                <span>📍 {{ project.location || 'São Paulo - SP' }}</span>
                <span>👥 {{ project.bids_count || 0 }} lances</span>
              </div>
              
              <!-- Botão de ação -->
              <button @click="handleBidClick(project)" 
                      class="w-full bg-gradient-primary hover:opacity-90 text-white py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                💰 Dar meu lance
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="text-center py-12">
          <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-2xl font-bold text-neutral-700 mb-2">Nenhum leilão encontrado</h3>
            <p class="text-neutral-500 mb-6">
              Não encontramos leilões que correspondam aos seus filtros.
            </p>
            
            <!-- Clear filters button -->
            <button @click="clearAllFilters" 
                    class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
              🔄 Limpar Filtros
            </button>
            
            <!-- Current filter info -->
            <div v-if="hasActiveFilters" class="mt-4 text-sm text-gray-600">
              <p class="font-medium mb-2">Filtros ativos:</p>
              <div class="flex flex-wrap gap-2 justify-center">
                <span v-if="selectedCategory !== 'Todos'" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  📂 {{ selectedCategory }}
                </span>
                <span v-if="budgetFilter" class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  💰 {{ getBudgetLabel(budgetFilter) }}
                </span>
                <span v-if="locationFilter" class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  📍 {{ getLocationLabel(locationFilter) }}
                </span>
                <span v-if="urgencyFilter" class="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  ⏰ {{ getUrgencyLabel(urgencyFilter) }}
                </span>
                <span v-if="searchText" class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                  🔍 "{{ searchText }}"
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-16">
          <router-link to="/projects" 
                       class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg">
            Ver todos os leilões
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Como Funciona -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-extrabold text-neutral-900 mb-4">
            ⚡ Como Funciona
          </h2>
          <p class="text-xl text-neutral-600">
            Sistema de leilão reverso que garante os melhores preços e qualidade
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Passo 1 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-white">📋</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">1. Encontre Serviços</h3>
            <p class="text-neutral-600">
              Use filtros por categoria, localização e prazo. Veja reputação e histórico dos fornecedores.
            </p>
          </div>

          <!-- Passo 2 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-white">💰</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">2. Dê Seu Lance</h3>
            <p class="text-neutral-600">
              Lances reversos: ganha o menor preço ponderado por credibilidade. Placar em tempo real.
            </p>
          </div>

          <!-- Passo 3 -->
          <div class="text-center group">
            <div class="w-20 h-20 bg-gradient-warning rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <span class="text-3xl text-white">🔒</span>
            </div>
            <h3 class="text-2xl font-bold text-neutral-900 mb-4">3. Execute com Segurança</h3>
            <p class="text-neutral-600">
              Escrow, milestones e liberação por aceite garantem segurança mútua para ambas as partes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 bg-gradient-primary text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl lg:text-4xl font-extrabold mb-6">
          🎯 Pronto para começar seu projeto?
        </h2>
        <p class="text-xl text-blue-200 mb-8">
          Junte-se a milhares de empresas que já economizam com nosso sistema de leilão reverso.
        </p>
        <router-link to="/register" 
                     class="inline-block bg-gradient-success hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl">
          🚀 Criar Conta Gratuita
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
    
    // Filtrar apenas projetos abertos/em leilão
    projects.value = data.projects.filter(p => 
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
