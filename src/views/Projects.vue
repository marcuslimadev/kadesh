<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="container-responsive py-8 lg:py-12">
      <!-- Header Hero -->
      <div class="text-center mb-12 lg:mb-16">
        <div class="inline-block mb-4 badge badge-neutral">
          Painel de projetos
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
          Projetos disponíveis
        </h1>
        <p class="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
          Consulte todas as oportunidades abertas e acompanhe o status de publicação dos seus contratos.
        </p>
        <router-link to="/projects/create" class="btn btn-primary group">
          <span class="mr-2 group-hover:scale-110 transition-transform inline-block">+</span>
          <span>Novo projeto</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="loading-spinner w-12 h-12 mb-4"></div>
        <p class="text-2xl font-bold text-neutral-900">Carregando projetos...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="grid grid-responsive-cols-3 gap-8">
        <div v-for="p in projects" :key="p.id" class="group">
          <router-link :to="`/projects/${p.id}`" class="block h-full">
            <div class="card card-elevated h-full group-hover:shadow-primary transition-shadow duration-300">
              <div class="card-body">
                <!-- Status Badge and Ref -->
                <div class="flex justify-between items-start mb-6">
                  <span :class="getStatusBadgeClass(p.status)">
                    {{ getStatusText(p.status) }}
                  </span>
                  <div class="text-sm text-neutral-500 uppercase font-semibold">
                    Ref. {{ p.reference || p.id }}
                  </div>
                </div>

                <!-- Title -->
                <h3 class="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {{ p.title }}
                </h3>

                <!-- Description -->
                <p class="text-neutral-600 mb-6 line-clamp-3">
                  {{ p.description }}
                </p>

                <!-- Skills Pills -->
                <div v-if="p.required_skills && p.required_skills.length" class="mb-6">
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="skill in p.required_skills.slice(0, 3)"
                      :key="skill"
                      class="badge badge-neutral"
                    >
                      {{ skill }}
                    </span>
                    <span
                      v-if="p.required_skills.length > 3"
                      class="badge badge-neutral"
                    >
                      +{{ p.required_skills.length - 3 }} itens
                    </span>
                  </div>
                </div>

                <!-- Info Cards -->
                <div class="mb-6">
                  <div class="card bg-neutral-50 p-4 mb-4">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-neutral-500 uppercase font-semibold">
                        Orçamento máximo
                      </span>
                      <span class="text-lg font-bold text-secondary-600">
                        {{ displayMoney(p.max_budget) }}
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="card bg-neutral-50 text-center p-4">
                      <p class="text-2xl font-bold text-neutral-900 mb-1">{{ p.bids_count || 0 }}</p>
                      <p class="text-sm text-neutral-500 uppercase font-semibold">Propostas</p>
                    </div>
                    <div class="card bg-neutral-50 text-center p-4">
                      <p class="text-sm text-neutral-900 font-semibold mb-1">{{ formatDate(p.bidding_ends_at) }}</p>
                      <p class="text-sm text-neutral-500 uppercase font-semibold">Prazo final</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer CTA -->
              <div class="card-footer bg-white flex justify-between items-center border-t border-neutral-200">
                <span class="text-sm text-primary-600 uppercase font-semibold">Detalhes do projeto</span>
                <span class="text-primary-600 group-hover:translate-x-1 transition-transform" aria-hidden="true">›</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="card card-elevated p-12 max-w-lg mx-auto">
          <div class="text-6xl mb-6">📋</div>
          <div class="text-sm text-neutral-500 uppercase font-semibold mb-4">Sem registros</div>
          <h3 class="text-3xl font-bold text-neutral-900 mb-4">
            Nenhum projeto cadastrado
          </h3>
          <p class="text-lg text-neutral-600 mb-8">
            Inicie sua carteira de projetos registrando a primeira demanda no sistema.
          </p>
          <router-link to="/projects/create" class="btn btn-primary group">
            <span class="mr-2 group-hover:scale-110 transition-transform inline-block">+</span>
            <span>Novo projeto</span>
          </router-link>
        </div>
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
    'open': 'badge badge-primary',
    'bidding': 'badge badge-primary',
    'in_progress': 'badge badge-secondary',
    'completed': 'badge badge-success',
    'cancelled': 'badge badge-danger',
    'awarded': 'badge badge-primary'
  };
  return classes[status] || 'badge badge-neutral';
}

function isFiniteNumber(value) {
  return typeof value === 'number' && isFinite(value);
}

function displayMoney(value) {
  if (!isFiniteNumber(value)) return '-';
  return `R$ ${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0 }).format(value)}`;
}

function getStatusText(status) {
  const texts = {
    'open': 'Aberto',
    'bidding': 'Aberto',
    'in_progress': 'Em execução',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'awarded': 'Adjudicado'
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

<style scoped>
/* Utilitários para truncamento de texto */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>




