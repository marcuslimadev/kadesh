<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Header Hero -->
      <div class="text-center mb-10">
        <div class="inline-block mb-4 animate-bounce">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
          🚀 Projetos Incríveis
        </h1>
        <p class="text-base sm:text-lg text-gray-700 font-semibold max-w-2xl mx-auto mb-6">
          Descubra oportunidades fantásticas ou publique seu próximo grande projeto!
        </p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl hover:shadow-purple-500/50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Criar Novo Projeto</span>
          <span class="animate-pulse">✨</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class="relative mb-6">
          <div class="w-24 h-24 rounded-full border-8 border-purple-200 border-t-purple-600 animate-spin"></div>
          <div class="absolute inset-0 w-24 h-24 rounded-full border-8 border-transparent border-r-pink-600 animate-spin animation-delay-150"></div>
        </div>
        <p class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
          Carregando projetos incríveis...
        </p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link :to="`/projects/${p.id}`" 
                     v-for="p in projects" 
                     :key="p.id" 
                     class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-4 border-transparent hover:border-purple-300 transform hover:-translate-y-3 hover:rotate-1">
          
          <!-- Card Header with Gradient -->
          <div class="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
          
          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex justify-between items-start mb-4">
              <span :class="getStatusBadgeClass(p.status)" class="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                {{ getStatusText(p.status) }}
              </span>
              <div class="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                <span class="text-xl">🎯</span>
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
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
                      class="bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-bold border-2 border-purple-200">
                  {{ skill }}
                </span>
                <span v-if="p.required_skills.length > 3" 
                      class="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-bold border-2 border-gray-300">
                  +{{ p.required_skills.length - 3 }} mais
                </span>
              </div>
            </div>

            <!-- Info Cards -->
            <div class="space-y-3 mb-5">
              <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-200">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700 font-bold flex items-center gap-2">
                    <span class="text-xl">💰</span> Orçamento
                  </span>
                  <span class="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    R$ {{ formatMoney(p.max_budget) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 border-2 border-blue-200 text-center">
                  <p class="text-2xl font-black text-blue-600">{{ p.bids_count || 0 }}</p>
                  <p class="text-xs text-gray-600 font-bold">📊 Propostas</p>
                </div>
                <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-3 border-2 border-rose-200 text-center">
                  <p class="text-xs font-black text-rose-600">{{ formatDate(p.bidding_ends_at) }}</p>
                  <p class="text-xs text-gray-600 font-bold">⏰ Termina</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer CTA -->
          <div class="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 px-6 py-4 group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-indigo-600 transition-all duration-300">
            <div class="flex items-center justify-between text-white">
              <span class="text-sm font-black">Ver Detalhes e Participar</span>
              <svg class="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="relative inline-block mb-8">
          <div class="w-32 h-32 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <svg class="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div class="absolute -top-4 -right-4 text-6xl animate-bounce">🚀</div>
        </div>
        <h3 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          Nenhum projeto ainda! 🎯
        </h3>
        <p class="text-lg text-gray-600 font-semibold mb-8 max-w-md mx-auto">
          Seja o <span class="text-purple-600 font-black">pioneiro</span> e publique o primeiro projeto incrível!
        </p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:-translate-y-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Criar Primeiro Projeto</span>
          <span class="text-2xl animate-pulse">✨</span>
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
    'open': 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white',
    'bidding': 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white',
    'in_progress': 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white',
    'completed': 'bg-gradient-to-r from-gray-500 to-slate-600 text-white',
    'cancelled': 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 text-white',
    'awarded': 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white'
  };
  return classes[status] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
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
