<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-4 py-sm-5">
      <!-- Header Hero -->
      <div class="text-center mb-4 mb-md-5">
        <div class="d-inline-block mb-2 small text-uppercase text-muted fw-semibold">
          Painel de projetos
        </div>
        <h1 class="display-6 fw-semibold mb-2">
          Projetos disponíveis
        </h1>
        <p class="lead mx-auto mb-3" style="max-width: 42rem;">
          Consulte todas as oportunidades abertas e acompanhe o status de publicação dos seus contratos.
        </p>
        <router-link to="/projects/create" class="btn btn-dark btn-sm text-uppercase">
          <span class="me-2">+</span>
          <span>Novo projeto</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5">
        <div class="mb-3">
          <div class="spinner-border text-dark" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>
        <p class="h5 fw-bold mb-0">Carregando projetos...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="row g-3 g-md-4">
        <div class="col-md-6 col-lg-4" v-for="p in projects" :key="p.id">
          <router-link :to="`/projects/${p.id}`" class="text-decoration-none">
            <div class="card h-100 border card-hover">
              <div class="card-body">
                <!-- Status Badge and Ref -->
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <span :class="getStatusBadgeClass(p.status)">
                    {{ getStatusText(p.status) }}
                  </span>
                  <div class="small text-uppercase text-muted">
                    Ref. {{ p.reference || p.id }}
                  </div>
                </div>

                <!-- Title -->
                <h3 class="h5 card-title mb-2">
                  {{ p.title }}
                </h3>

                <!-- Description -->
                <p class="card-text mb-3 text-muted">
                  {{ p.description }}
                </p>

                <!-- Skills Pills -->
                <div v-if="p.required_skills && p.required_skills.length" class="mb-3">
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="skill in p.required_skills.slice(0, 3)" :key="skill" class="badge bg-light text-dark text-uppercase fw-semibold">
                      {{ skill }}
                    </span>
                    <span v-if="p.required_skills.length > 3" class="badge bg-light text-dark text-uppercase fw-semibold">
                      +{{ p.required_skills.length - 3 }} itens
                    </span>
                  </div>
                </div>

                <!-- Info Cards -->
                <div class="mb-3">
                  <div class="bg-light border rounded p-3 mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                  <span class="small text-uppercase fw-semibold text-muted">
                    Orçamento máximo
                  </span>
                  <span class="h6 mb-0">
                    {{ displayMoney(p.max_budget) }}
                  </span>
                    </div>
                  </div>

                  <div class="row g-2">
                    <div class="col-6">
                      <div class="bg-light border rounded text-center p-2">
                        <p class="h5 mb-1 fw-semibold">{{ p.bids_count || 0 }}</p>
                        <p class="small text-uppercase fw-semibold mb-0">Propostas</p>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="bg-light border rounded text-center p-2">
                        <p class="small text-uppercase fw-semibold mb-1">{{ formatDate(p.bidding_ends_at) }}</p>
                        <p class="small text-uppercase fw-semibold mb-0">Prazo final</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer CTA -->
              <div class="card-footer bg-white d-flex justify-content-between align-items-center border-top">
                <span class="small text-uppercase fw-semibold text-primary">Detalhes do projeto</span>
                <span class="text-primary" aria-hidden="true">›</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <div class="small text-uppercase text-muted mb-2">Sem registros</div>
        <h3 class="h2 fw-semibold mb-2">
          Nenhum projeto cadastrado
        </h3>
        <p class="lead mx-auto mb-3" style="max-width: 28rem;">
          Inicie sua carteira de projetos registrando a primeira demanda no sistema.
        </p>
        <router-link to="/projects/create" class="btn btn-dark btn-sm text-uppercase">
          <span class="me-2">+</span>
          <span>Novo projeto</span>
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
    'open': 'badge bg-dark',
    'bidding': 'badge bg-dark',
    'in_progress': 'badge bg-secondary',
    'completed': 'badge bg-success',
    'cancelled': 'badge bg-danger',
    'awarded': 'badge bg-primary'
  };
  return classes[status] || 'badge bg-secondary';
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




