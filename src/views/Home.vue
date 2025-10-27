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
          
          <!-- Filtros básicos -->
          <div class="flex flex-wrap gap-3 justify-center mb-8">
            <button v-for="category in categories" :key="category"
                    @click="selectedCategory = category"
                    :class="[
                      'px-6 py-3 rounded-xl font-medium transition-all',
                      selectedCategory === category 
                        ? 'bg-primary-600 text-white shadow-lg' 
                        : 'bg-white text-neutral-700 hover:bg-primary-50 shadow-md'
                    ]">
              {{ category }}
            </button>
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
                    R$ {{ formatCurrency(project.lowest_bid || project.max_budget) }}
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm text-neutral-500 block">Tempo restante</span>
                  <div class="text-lg font-bold" :class="getTimeColor(project.bidding_ends_at)">
                    {{ getTimeLeft(project.bidding_ends_at) }}
                  </div>
                </div>
              </div>
              
              <!-- Placar dinâmico -->
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-neutral-600">Placar (70% preço + 30% reputação)</span>
                  <span class="font-bold text-primary-600">{{ calculateScore(project) }}%</span>
                </div>
                <div class="w-full bg-neutral-200 rounded-full h-3">
                  <div class="bg-gradient-success h-3 rounded-full transition-all duration-700" 
                       :style="`width: ${calculateScore(project)}%`"></div>
                </div>
              </div>
              
              <!-- Informações extras -->
              <div class="flex items-center justify-between text-sm text-neutral-500 mb-4">
                <span>📍 {{ project.location || 'São Paulo - SP' }}</span>
                <span>👥 {{ project.bids_count || 0 }} lances</span>
              </div>
              
              <!-- Botão de ação -->
              <button @click="requireLogin(project)" 
                      class="w-full bg-gradient-primary hover:opacity-90 text-white py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
                💰 Dar meu lance
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProjects.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-2xl font-bold text-neutral-700 mb-2">Nenhum leilão encontrado</h3>
          <p class="text-neutral-500">Tente ajustar os filtros ou volte mais tarde.</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const projects = ref([]);
const loading = ref(true);
const selectedCategory = ref('Todos');
const projectsSection = ref(null);

const categories = ['Todos', 'Obra', 'Pintura', 'Elétrica', 'Hidráulica', 'Impermeabilização', 'HVAC', 'Drywall', 'Solar'];

const stats = ref({
  totalProjects: 0,
  totalProviders: 0
});

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Todos') {
    return projects.value;
  }
  return projects.value.filter(project => 
    project.category === selectedCategory.value || 
    project.title.toLowerCase().includes(selectedCategory.value.toLowerCase())
  );
});

function scrollToProjects() {
  projectsSection.value?.scrollIntoView({ behavior: 'smooth' });
}

function requireLogin(project) {
  // Salvar projeto de interesse no localStorage
  localStorage.setItem('interestedProject', JSON.stringify(project));
  router.push('/login?redirect=bid');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function getTimeLeft(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  
  if (diff <= 0) return 'ENCERRADO';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getTimeColor(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  const hours = diff / (1000 * 60 * 60);
  
  if (hours <= 0) return 'text-neutral-500';
  if (hours <= 2) return 'text-danger-600';
  if (hours <= 24) return 'text-warning-600';
  return 'text-success-600';
}

function calculateScore(project) {
  // Simular cálculo do placar
  const baseBudget = project.max_budget;
  const currentBid = project.lowest_bid || baseBudget;
  const priceScore = Math.max(0, ((baseBudget - currentBid) / baseBudget) * 100);
  const reputationScore = 85; // Mock score
  
  return Math.round((priceScore * 0.7) + (reputationScore * 0.3));
}

async function fetchProjects() {
  try {
    loading.value = true;
    const { data } = await api.get('/api/projects');
    
    // Filtrar apenas projetos abertos/em leilão
    projects.value = data.projects.filter(p => 
      p.status === 'open' || p.status === 'bidding'
    );
    
    stats.value = {
      totalProjects: projects.value.length,
      totalProviders: data.total_providers || 150
    };
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    projects.value = []; // Fallback para array vazio
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
