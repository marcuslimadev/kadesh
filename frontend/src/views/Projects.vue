<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Projetos Disponíveis</h1>
          <p class="text-gray-600">Encontre oportunidades ou publique seu projeto</p>
        </div>
        <router-link to="/projects/create" 
                     class="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Novo Projeto</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <router-link :to="`/projects/${p.id}`" 
                     v-for="p in projects" 
                     :key="p.id" 
                     class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
          <div class="p-6">
            <!-- Project Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{{ p.title }}</h3>
                <p class="text-gray-600 text-sm line-clamp-3 mb-4">{{ p.description }}</p>
              </div>
              <div class="ml-4">
                <span :class="getStatusBadgeClass(p.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                  {{ getStatusText(p.status) }}
                </span>
              </div>
            </div>

            <!-- Project Skills -->
            <div v-if="p.required_skills && p.required_skills.length" class="mb-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="skill in p.required_skills.slice(0, 3)" 
                      :key="skill" 
                      class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                  {{ skill }}
                </span>
                <span v-if="p.required_skills.length > 3" 
                      class="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-md">
                  +{{ p.required_skills.length - 3 }}
                </span>
              </div>
            </div>

            <!-- Project Meta -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Budget Máximo</span>
                <span class="font-semibold text-green-600">R$ {{ formatMoney(p.max_budget) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Lances Recebidos</span>
                <span class="font-semibold text-blue-600">{{ p.bids_count || 0 }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Termina em</span>
                <span class="font-semibold text-gray-900">{{ formatDate(p.bidding_ends_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="bg-gray-50 px-6 py-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Ver detalhes e participar</span>
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum projeto encontrado</h3>
        <p class="text-gray-600 mb-6">Seja o primeiro a publicar um projeto na plataforma!</p>
        <router-link to="/projects/create" 
                     class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
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
    'bidding': 'bg-green-100 text-green-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
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
