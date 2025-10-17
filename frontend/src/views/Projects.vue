<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Header - Mobile First -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            🎯 Projetos Disponíveis
          </h1>
          <p class="text-sm sm:text-base text-gray-600 font-medium">Encontre oportunidades ou publique seu projeto</p>
        </div>
        <router-link to="/projects/create" 
                     class="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Novo Projeto</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
        </div>
      </div>

      <!-- Projects Grid - Mobile First -->
      <div v-else-if="projects.length > 0" class="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        <router-link :to="`/projects/${p.id}`" 
                     v-for="p in projects" 
                     :key="p.id" 
                     class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-indigo-300 transform hover:-translate-y-2">
          <div class="p-4 sm:p-6">
            <!-- Project Header -->
            <div class="flex justify-between items-start mb-4 gap-2">
              <div class="flex-1 min-w-0">
                <h3 class="text-base sm:text-lg font-extrabold text-gray-900 mb-2 line-clamp-2">{{ p.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-4">{{ p.description }}</p>
              </div>
              <div class="flex-shrink-0">
                <span :class="getStatusBadgeClass(p.status)" class="px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                  {{ getStatusText(p.status) }}
                </span>
              </div>
            </div>

            <!-- Project Skills -->
            <div v-if="p.required_skills && p.required_skills.length" class="mb-4">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="skill in p.required_skills.slice(0, 3)" 
                      :key="skill" 
                      class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs px-2.5 py-1 rounded-lg font-semibold">
                  {{ skill }}
                </span>
                <span v-if="p.required_skills.length > 3" 
                      class="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-lg font-semibold">
                  +{{ p.required_skills.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Project Meta -->
            <div class="border-t-2 border-indigo-100 pt-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm text-gray-600 font-semibold">💰 Budget Máximo</span>
                <span class="text-sm sm:text-base font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">R$ {{ formatMoney(p.max_budget) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm text-gray-600 font-semibold">📊 Lances</span>
                <span class="text-sm sm:text-base font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ p.bids_count || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm text-gray-600 font-semibold">⏰ Termina em</span>
                <span class="text-xs sm:text-sm font-bold text-gray-900">{{ formatDate(p.bidding_ends_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4">
            <div class="flex items-center justify-between">
              <span class="text-xs sm:text-sm text-indigo-700 font-bold">Ver detalhes e participar</span>
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 sm:py-20 px-4">
        <div class="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">📭 Nenhum projeto encontrado</h3>
        <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">Seja o primeiro a publicar um projeto na plataforma!</p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Criar Primeiro Projeto</span>
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
    'bidding': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md',
    'in_progress': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md',
    'completed': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md',
    'cancelled': 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md'
  };
  return classes[status] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md';
}

function getStatusText(status) {
  const texts = {
    'bidding': 'Aberto',
    'in_progress': 'Em Andamento',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
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
