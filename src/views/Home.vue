<template>
  <div class="bg-light">
    <!-- Hero Section -->
    <section class="hero-clear">
      <div class="container py-5 py-lg-6">
        <div class="text-center">
          <!-- Logo/Badge -->
          <div class="d-inline-flex align-items-center gap-3 px-4 py-2 mb-4 border border-light-subtle bg-transparent">
            <span class="fs-5 fw-semibold text-uppercase">KADESH</span>
          </div>

          <h1 class="hero-title">
            Ganhe contratos com lances reversos
          </h1>
          <p class="hero-subtitle">
            Menor preço + reputação. Sistema de leilão profissional para construção civil e serviços.
          </p>
          
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
            <button @click="scrollToProjects" class="btn btn-primary btn-lg hero-btn">
              Ver leilões ativos
            </button>
            <router-link to="/register" class="btn btn-outline-primary btn-lg hero-btn">
              Participar agora
            </router-link>
          </div>

          <!-- Estatísticas rápidas -->
          <div class="row g-3 justify-content-center" style="max-width: 48rem; margin: 0 auto;">
            <div class="col-6 col-lg-3">
              <div class="stat-card text-center">
                <div class="h3 fw-bold text-dark mb-0"><span class="stat-icon">+</span>{{ stats.totalProjects }}+</div>
                <div class="text-dark small fw-medium">Projetos ativos</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card text-center">
                <div class="h3 fw-bold text-dark mb-0"><span class="stat-icon">+</span>{{ stats.totalProviders }}+</div>
                <div class="text-dark small fw-medium">Fornecedores</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card text-center">
                <div class="h3 fw-bold text-dark mb-0">35%</div>
                <div class="text-dark small fw-medium">Economia média</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card text-center">
                <div class="h3 fw-bold text-dark mb-0">24h</div>
                <div class="text-dark small fw-medium">Tempo médio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Leilões Ativos - PÚBLICO (sem login) -->
    <section ref="projectsSection" class="projects-section">
      <div class="container">
        <!-- Barra de categorias -->
        <div class="mb-2">
          <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
            <span v-for="cat in categories" :key="cat" class="badge rounded-pill text-bg-light px-3 py-2">{{ cat }}</span>
          </div>
        </div>
        <div class="text-center mb-4">
          <h2 class="h1 fw-semibold mb-2">
             Leilões Ativos
          </h2>
          <p class="fs-5 text-dark mb-3">
            Padrão: 70% preço + 30% reputação
          </p>
          
          <!-- Filtros avançados -->
          <div class="bg-white border p-4 mb-4 mx-auto" style="max-width: 56rem;">
            <div class="row g-3">
              <!-- Filtro por categoria -->
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Categoria</label>
                <select v-model="selectedCategory" class="form-select">
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Filtro por orçamento -->
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Orçamento</label>
                <select v-model="budgetFilter" class="form-select">
                  <option value="">Todos os valores</option>
                  <option value="0-1000">Até R$ 1.000</option>
                  <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
                  <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                  <option value="10000-">Acima de R$ 10.000</option>
                </select>
              </div>

              <!-- Filtro por localização -->
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Localização</label>
                <select v-model="locationFilter" class="form-select">
                  <option value="">Todas as cidades</option>
                  <option value="SP">São Paulo - SP</option>
                  <option value="RJ">Rio de Janeiro - RJ</option>
                  <option value="BH">Belo Horizonte - MG</option>
                  <option value="DF">Brasília - DF</option>
                  <option value="RS">Porto Alegre - RS</option>
                </select>
              </div>

              <!-- Filtro por urgência -->
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Urgência</label>
                <select v-model="urgencyFilter" class="form-select">
                  <option value="">Todos os prazos</option>
                  <option value="urgent">Urgente (< 24h)</option>
                  <option value="soon">Breve (< 3 dias)</option>
                  <option value="normal">Normal (> 3 dias)</option>
                </select>
              </div>
            </div>

            <!-- Busca por texto -->
            <div class="mt-3">
              <input v-model="searchText" type="text" placeholder="Buscar por título, descrição ou habilidades" class="form-control">
            </div>

            <!-- Contador de resultados e status de auto-refresh -->
            <div class="mt-3 d-flex flex-column flex-sm-row align-items-center justify-content-between">
              <p class="small text-dark mb-2 mb-sm-0">
                 Mostrando <strong>{{ filteredProjects.length }}</strong> de <strong>{{ projects.length }}</strong> leilões ativos
              </p>
              
              <div class="d-flex align-items-center gap-3">
                <!-- Ordenação -->
                <div class="d-flex align-items-center gap-2">
                  <label class="small text-muted">Ordenar por</label>
                  <select class="form-select form-select-sm" style="min-width: 180px;">
                    <option>Placar (maior)</option>
                    <option>Menor preço</option>
                    <option>Maior reputação</option>
                    <option>Menor tempo restante</option>
                  </select>
                </div>
                <!-- Auto refresh toggle -->
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="autoRefresh" @change="autoRefresh ? startAutoRefresh() : stopAutoRefresh()" id="autoRefreshChk">
                  <label class="form-check-label" for="autoRefreshChk">
                    Atualização automática
                  </label>
                </div>
                
                <!-- Manual refresh button -->
                <button @click="fetchProjects()" :disabled="loading" class="btn btn-dark btn-sm">
                  <span v-if="loading">Atualizando…</span>
                  <span v-else>Atualizar</span>
                </button>
                
                <!-- Last refresh time -->
                <span class="text-muted small">
                  Atualizado {{ getLastRefreshTime() }} atrás
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-dark" role="status"></div>
          <p class="mt-3 text-muted">Carregando leilões...</p>
        </div>

        <!-- Grid de Projetos -->
        <div v-else class="row g-3 g-lg-4">
          <div v-for="project in filteredProjects" :key="project.id" class="col-md-6 col-lg-4">
            <div class="card h-100 border card-hover">
              <!-- Imagem do projeto -->
              <div class="position-relative" style="height: 12rem; background: #f8f9fa; overflow: hidden;">
                <img v-if="project.image" :src="project.image" :alt="project.title" class="w-100 h-100" style="object-fit: cover;" />
                <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center text-uppercase small fw-semibold text-dark" style="background: #e9ecef;">
                  Sem imagem
                </div>
                <!-- Badge categoria -->
                <div class="position-absolute top-0 end-0 m-2">
                  <span class="badge bg-dark">{{ project.category || 'Obra' }}</span>
                </div>
              </div>

              <!-- Conteúdo -->
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="badge text-bg-primary">LANCE REVERSO</span>
                  <span class="badge text-bg-light"><i class="bi bi-star-fill text-warning me-1"></i>{{ project.provider_rating?.toFixed ? project.provider_rating.toFixed(1) : project.provider_rating || '4.5' }}</span>
                </div>
                <h3 class="h5 fw-semibold mb-2 line-clamp-2">{{ project.title }}</h3>
                <p class="small text-dark mb-3 line-clamp-2">
                  {{ project.description }}
                </p>
                
                <!-- Métricas principais -->
                <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light border">
                  <div>
                    <span class="small text-muted text-uppercase fw-semibold d-block mb-1">Menor lance</span>
                    <div class="h6 mb-0">
                      R$ {{ formatCurrency(project.lowest_bid) }}
                    </div>
                  </div>
                  <div class="text-end">
                    <span class="small text-muted text-uppercase fw-semibold d-block mb-1">Tempo restante</span>
                    <CountdownTimer :end-date="project.bidding_ends_at" size="medium" @expired="() => onTimerExpired(project)" @urgent="() => onTimerUrgent(project)" />
                  </div>
                </div>
                
                <!-- Placar dinâmico -->
                <div class="mb-3">
                  <div class="small text-muted mb-1">Placar (70% preço + 30% reputação)</div>
                  <ScoreProgress :bid-amount="project.lowest_bid" :max-budget="project.max_budget" :provider-rating="project.provider_rating" :price-weight="70" :reputation-weight="30" @score-change="(scoreData) => onScoreChange(project, scoreData)" />
                </div>
                
                <!-- Informações extras -->
                <div class="d-flex justify-content-between align-items-center small text-dark mb-3 fw-semibold">
                  <span>{{ project.location || 'São Paulo - SP' }}</span>
                  <span class="badge text-bg-light text-uppercase">{{ project.bids_count || 0 }} lances</span>
                </div>
                
                <!-- Botão de ação -->
                <button @click="handleBidClick(project)" class="btn btn-primary w-100 text-uppercase fw-semibold">
                  Dar meu lance
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="text-center py-4">
          <div class="bg-white border p-4 mx-auto" style="max-width: 28rem;">
            <h3 class="h3 fw-semibold mb-2">Nenhum leilão encontrado</h3>
            <p class="text-muted mb-3">
              Ajuste os filtros ou limpe a pesquisa para visualizar novos resultados disponíveis.
            </p>
            
            <!-- Clear filters button -->
            <button @click="clearAllFilters" class="btn btn-dark btn-sm text-uppercase">
              Limpar filtros
            </button>
            
            <!-- Current filter info -->
            <div v-if="hasActiveFilters" class="mt-3 small text-dark">
              <p class="fw-medium mb-2">Filtros ativos:</p>
              <div class="d-flex flex-wrap gap-2 justify-content-center">
                <span v-if="selectedCategory !== 'Todos'" class="badge text-bg-light text-uppercase">{{ selectedCategory }}</span>
                <span v-if="budgetFilter" class="badge text-bg-light text-uppercase">{{ getBudgetLabel(budgetFilter) }}</span>
                <span v-if="locationFilter" class="badge text-bg-light text-uppercase">{{ getLocationLabel(locationFilter) }}</span>
                <span v-if="urgencyFilter" class="badge text-bg-light text-uppercase">{{ getUrgencyLabel(urgencyFilter) }}</span>
                <span v-if="searchText" class="badge text-bg-light text-uppercase">"{{ searchText }}"</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-4">
          <router-link to="/projects" class="btn btn-link fw-semibold">
            Ver todos os leilões ›
          </router-link>
        </div>
      </div>
    </section>

    <!-- Como Funciona -->
    <section class="como-funciona-section">
      <div class="container">
        <div class="text-center mb-4">
          <h2 class="h1 fw-semibold mb-2">
             Como Funciona
          </h2>
          <p class="fs-5 text-dark">
            Sistema de leilão reverso que garante os melhores preços e qualidade
          </p>
        </div>

        <div class="row g-4">
          <!-- Passo 1 -->
          <div class="col-md-4 text-center">
            <div class="d-flex align-items-center justify-content-center bg-dark text-white mx-auto mb-3" style="width: 5rem; height: 5rem;">
              <span class="text-uppercase small fw-semibold">Etapa 1</span>
            </div>
            <h3 class="h4 fw-semibold mb-2">1. Encontre serviços</h3>
            <p class="text-dark mb-0">
              Use filtros por categoria, localização e prazo. Veja reputação e histórico dos fornecedores.
            </p>
          </div>

          <!-- Passo 2 -->
          <div class="col-md-4 text-center">
            <div class="d-flex align-items-center justify-content-center bg-dark text-white mx-auto mb-3" style="width: 5rem; height: 5rem;">
              <span class="text-uppercase small fw-semibold">Etapa 2</span>
            </div>
            <h3 class="h4 fw-semibold mb-2">2. Envie sua proposta</h3>
            <p class="text-dark mb-0">
              Lances reversos: ganha o menor preço ponderado por credibilidade. Placar em tempo real.
            </p>
          </div>

          <!-- Passo 3 -->
          <div class="col-md-4 text-center">
            <div class="d-flex align-items-center justify-content-center bg-secondary text-white mx-auto mb-3" style="width: 5rem; height: 5rem;">
              <span class="text-uppercase small fw-semibold">Etapa 3</span>
            </div>
            <h3 class="h4 fw-semibold mb-2">3. Execute com segurança</h3>
            <p class="text-dark mb-0">
              Escrow, milestones e liberação por aceite garantem segurança mútua para ambas as partes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section">
      <div class="container text-center">
        <h2 class="h1 fw-semibold mb-3">
           Pronto para começar seu projeto?
        </h2>
        <p class="fs-5 text-dark mb-4">
          Junte-se a milhares de empresas que já economizam com nosso sistema de leilão reverso.
        </p>
        <router-link to="/register" class="btn btn-light btn-lg text-dark">
          Criar conta gratuita
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

<style scoped>
.hero-clear {
  background: #fff;
  border-bottom: 1px solid #ececec;
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #232323;
}
.hero-subtitle {
  font-size: 1.18rem;
  color: #757575;
  margin-bottom: 2.8rem;
}
.hero-btn {
  min-width: 180px;
}
.stat-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 28px 0 rgba(33, 37, 41, 0.09);
  padding: 1.4rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 108px;
  transition: box-shadow .19s;
}
.stat-card:hover {
  box-shadow: 0 8px 32px 0 rgba(0,123,255,.15);
}
.stat-icon {
  font-size: 2.35rem;
  color: #0275ff;
  margin-bottom: .5rem;
}
.projects-section, .como-funciona-section, .cta-section {
  background: #fff;
  border-radius: 2.2rem;
  box-shadow: 0 2px 24px 0 rgba(33,37,41,.07);
  padding: 2.7rem 0 2.4rem 0;
  margin-bottom: 2.3rem;
}
.card-hover {
  transition: box-shadow 0.2s, border-color 0.15s;
}
.card-hover:hover {
  box-shadow: 0 0.65rem 2rem rgba(33, 37, 41, 0.13);
  border-color: #0d6efd!important;
}
.section-divider {
  height: 2px;
  background: linear-gradient(90deg, #0d6efd 0%, #6ab0ff 100%);
  opacity: .08;
  margin: 2.6rem auto 2.1rem auto;
  border-radius: 33px;
  width: 92%;
}
</style>




