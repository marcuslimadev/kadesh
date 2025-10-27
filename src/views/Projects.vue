<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header Hero -->
      <div class="text-center mb-10">
        <div class="inline-block mb-4">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-950 rounded shadow-lg flex items-center justify-center">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-950 mb-4 leading-tight">
          🚀 Projetos Disponíveis
        </h1>
        <p class="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-6">
          Descubra oportunidades fantásticas ou publique seu próximo grande projeto!
        </p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center gap-2 bg-gray-950 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Criar Novo Projeto</span>
          <span></span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class="relative mb-6">
          <div class="w-24 h-24 rounded-full border-8 border-gray-200 border-t-gray-950 animate-spin"></div>
        </div>
        <p class="text-xl font-bold text-gray-950">
          Carregando projetos...
        </p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link :to="`/projects/${p.id}`" 
                     v-for="p in projects" 
                     :key="p.id" 
                     class="group bg-white rounded-lg shadow-sm hover:shadow transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-gray-950">
          
          <!-- Card Header -->
          <div class="h-2 bg-gray-950"></div>
          
          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex justify-between items-start mb-4">
              <span :class="getStatusBadgeClass(p.status)" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                {{ getStatusText(p.status) }}
              </span>
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-xl"></span>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-bold text-gray-950 mb-3 line-clamp-2">
              {{ p.title }}
            </h3>

            <!-- Description -->
            <p class="text-sm text-gray-600 line-clamp-3 mb-5 leading-relaxed">
              {{ p.description }}
            </p>

            <!-- Skills Pills -->
            <div v-if="p.required_skills && p.required_skills.length" class="mb-5">
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in p.required_skills.slice(0, 3)" 
                      :key="skill" 
                      class="bg-gray-100 text-gray-900 text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-300">
                  {{ skill }}
                </span>
                <span v-if="p.required_skills.length > 3" 
                      class="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-300">
                  +{{ p.required_skills.length - 3 }} mais
                </span>
              </div>
            </div>

            <!-- Info Cards -->
            <div class="space-y-3 mb-5">
              <div class="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700 font-bold flex items-center gap-2">
                    <span class="text-xl"></span> Orçamento
                  </span>
                  <span class="text-xl font-semibold text-gray-950">
                    R$ {{ formatMoney(p.max_budget) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <p class="text-2xl font-semibold text-gray-950">{{ p.bids_count || 0 }}</p>
                  <p class="text-xs text-gray-600 font-semibold"> Propostas</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
                  <p class="text-xs font-bold text-gray-950">{{ formatDate(p.bidding_ends_at) }}</p>
                  <p class="text-xs text-gray-600 font-semibold"> Termina</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer CTA -->
          <div class="bg-gray-950 px-6 py-4 group-hover:bg-gray-900 transition-all">
            <div class="flex items-center justify-between text-white">
              <span class="text-sm font-bold">Ver Detalhes e Participar</span>
              <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="relative inline-block mb-8">
          <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-200">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div class="absolute -top-4 -right-4 text-6xl">🚀</div>
        </div>
        <h3 class="text-3xl sm:text-4xl font-semibold text-gray-950 mb-4">
          Nenhum projeto ainda! 
        </h3>
        <p class="text-lg text-gray-600 font-medium mb-8 max-w-md mx-auto">
          Seja o <span class="text-gray-950 font-bold">pioneiro</span> e publique o primeiro projeto incrível!
        </p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center gap-3 bg-gray-950 hover:bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Criar Primeiro Projeto</span>
          <span class="text-2xl "></span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const projects = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const { data } = await api.get('/api/projects');
    projects.value = data.data || data; // caso paginado
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    projects.value = [];
  } finally {
    loading.value = false;
  }
}


function getStatusBadgeClass(status) {
  const classes = {
    'open': 'bg-gray-950 text-white',
    'bidding': 'bg-gray-950 text-white',
    'in_progress': 'bg-gray-700 text-white',
    'completed': 'bg-gray-500 text-white',
    'cancelled': 'bg-gray-600 text-white',
    'awarded': 'bg-gray-800 text-white'
  };
  return classes[status] || 'bg-gray-400 text-white';
}

function getStatusText(status) {
  const texts = {
    'open': '🟢 Aberto',
    'bidding': '🟢 Aberto',
    'in_progress': '🔵 Em Progresso',
    'completed': '⚫ Concluído',
    'cancelled': '🔴 Cancelado',
    'awarded': '🟡 Aceito'
  };
  return texts[status] || status;
}

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Encerrado';
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays < 7) return `${diffDays} dias`;
  
  return date.toLocaleDateString('pt-BR');
}

onMounted(load);
</script>




