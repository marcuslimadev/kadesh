<template>
  <div class="min-h-screen bg-neutral-50 py-8">
    <div class="container-responsive">
      <!-- Loading State -->
      <div v-if="loading" class="max-w-4xl mx-auto">
        <div class="card card-elevated p-12 text-center">
          <div class="loading-spinner w-16 h-16 mx-auto mb-6"></div>
          <p class="text-xl font-bold text-neutral-900">
            Carregando projeto incrível...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!project" class="max-w-4xl mx-auto">
        <div class="card card-elevated p-12 text-center">
          <div class="text-6xl mb-6">❌</div>
          <h2 class="text-3xl font-bold text-neutral-900 mb-4">
            Ops! Projeto não encontrado
          </h2>
          <p class="text-lg text-neutral-600 mb-8">Este projeto pode ter sido removido ou não existe mais.</p>
          <router-link to="/projects" class="btn-primary btn-lg group">
            <svg class="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Voltar para Projetos
          </router-link>
        </div>
      </div>

      <!-- Project Content -->
      <div v-else class="max-w-4xl mx-auto space-y-8">
        <!-- Back Button -->
        <router-link to="/projects" class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg transition-colors group">
          <svg class="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Voltar aos Projetos
        </router-link>

        <!-- Main Card -->
        <div class="card card-elevated overflow-hidden">
          <!-- Gradient Top Bar -->
          <div class="h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

          <div class="card-body">
            <!-- Status Badges Row -->
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <span :class="statusClasses[project.status]" class="px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                {{ statusLabels[project.status] }}
              </span>
              <span v-if="isMyProject" class="badge badge-warning">
                👔 Meu Projeto
              </span>
            </div>

            <!-- Title -->
            <h1 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-6 leading-tight">
              {{ project.title }}
            </h1>

            <!-- Description -->
            <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-6 mb-8">
              <p class="text-neutral-700 text-lg leading-relaxed whitespace-pre-line">
                {{ project.description }}
              </p>
            </div>

            <!-- Info Cards Grid -->
            <div class="grid grid-responsive-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <!-- Budget Card -->
              <div class="card card-hover group p-6 text-center">
                <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">💰</div>
                <p class="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">Orçamento</p>
                <p class="text-2xl font-bold text-success-600">R$ {{ formatMoney(project.max_budget) }}</p>
              </div>

              <!-- Deadline Card -->
              <div class="card card-hover group p-6 text-center">
                <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">📅</div>
                <p class="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">Prazo Final</p>
                <p class="text-lg font-semibold text-neutral-900">{{ formatDate(project.project_deadline) }}</p>
              </div>

              <!-- Bidding Ends Card -->
              <div class="card card-hover group p-6 text-center">
                <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">⏰</div>
                <p class="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">Propostas até</p>
                <p class="text-lg font-semibold text-neutral-900">{{ formatDate(project.bidding_ends_at) }}</p>
              </div>

              <!-- Bids Count Card -->
              <div class="card card-hover group p-6 text-center bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                <p class="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-2">Propostas</p>
                <p class="text-3xl font-bold text-warning-600">{{ bids.length }}</p>
              </div>
            </div>

            <!-- Skills Tags -->
            <div v-if="project.required_skills && project.required_skills.length" class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-lg font-semibold text-neutral-700">🛠️ Habilidades Necessárias:</span>
              </div>
              <div class="flex flex-wrap gap-3">
                <span v-for="(skill, i) in project.required_skills" :key="i"
                      class="badge badge-primary">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bids/Proposals Section -->
        <div class="card card-elevated overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                  <span class="text-4xl">📋</span>
                </div>
                <div>
                  <h2 class="text-3xl font-bold text-white">Propostas Recebidas</h2>
                  <p class="text-white/90 font-semibold">{{ bids.length }} {{ bids.length === 1 ? 'proposta enviada' : 'propostas enviadas' }}</p>
                </div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                <p class="text-5xl font-bold text-white">{{ bids.length }}</p>
              </div>
            </div>
          </div>

          <div class="card-body">
            <!-- No Bids State -->
            <div v-if="bids.length === 0" class="text-center py-16 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg">
              <div class="text-6xl mb-6">📝</div>
              <h3 class="text-2xl font-bold text-neutral-900 mb-4">Nenhuma proposta ainda!</h3>
              <p class="text-lg text-neutral-600">Seja o primeiro profissional a enviar sua proposta para este projeto.</p>
            </div>

            <!-- Bids List -->
            <div v-else class="space-y-6">
              <div v-for="bid in bids" :key="bid.id"
                   class="card card-hover group overflow-hidden">
                <!-- Gradient Top Bar -->
                <div class="h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

                <div class="p-6">
                  <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div class="flex-1">
                      <!-- Provider Info -->
                      <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                          <span class="text-white font-bold text-2xl">{{ bid.provider?.name?.charAt(0).toUpperCase() || '?' }}</span>
                        </div>
                        <div>
                          <p class="text-xl font-bold text-neutral-900">{{ bid.provider?.name || 'Fornecedor' }}</p>
                          <p class="text-sm text-neutral-600 flex items-center gap-1">
                            <span>⭐</span>
                            <span>4.8 (120 avaliações)</span>
                          </p>
                        </div>
                      </div>

                      <!-- Bid Amount & Time -->
                      <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-primary-600 rounded-lg p-5 text-white text-center shadow-lg">
                          <p class="text-sm font-bold uppercase tracking-wide opacity-90 mb-1">Valor</p>
                          <p class="text-3xl font-bold">R$ {{ formatMoney(bid.amount) }}</p>
                        </div>
                        <div class="bg-secondary-600 rounded-lg p-5 text-white text-center shadow-lg">
                          <p class="text-sm font-bold uppercase tracking-wide opacity-90 mb-1">⏱️ Prazo</p>
                          <p class="text-3xl font-bold">{{ bid.delivery_time_days }} dias</p>
                        </div>
                      </div>

                      <!-- Proposal Text -->
                      <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-5 mb-4">
                        <p class="text-sm font-bold text-neutral-600 uppercase tracking-wide mb-2">Proposta:</p>
                        <p class="text-base text-neutral-800 leading-relaxed">{{ bid.proposal }}</p>
                      </div>

                      <!-- Bid Date -->
                      <p class="text-sm text-neutral-500">📅 Enviado em {{ formatDate(bid.created_at) }}</p>
                    </div>

                    <!-- Accept Button (owner only) -->
                    <div v-if="canConfirmWinner && project.status === 'bidding'" class="lg:ml-6">
                      <button @click="confirmWinner(bid.id)"
                              class="btn-primary w-full lg:w-auto">
                        Aceitar Proposta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bid Form (providers only) -->
        <div v-if="canBid && project.status === 'bidding'" class="card card-elevated overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-primary-600 to-secondary-600 p-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                <span class="text-4xl">🚀</span>
              </div>
              <div>
                <h3 class="text-3xl font-bold text-white">Enviar Minha Proposta</h3>
                <p class="text-white/90 font-semibold">Destaque-se e ganhe este projeto!</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitBid" class="card-body space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="label">Valor da Proposta (R$)</label>
                <input v-model.number="bidForm.amount" type="number" step="0.01" required
                       class="input input-lg"
                       placeholder="Ex: 2500.00" />
              </div>
              <div>
                <label class="label">⏱️ Prazo de Entrega (dias)</label>
                <input v-model.number="bidForm.delivery_time_days" type="number" min="1" required
                       class="input input-lg"
                       placeholder="Ex: 7" />
              </div>
            </div>

            <div>
              <label class="label">Detalhes da Proposta</label>
              <textarea v-model="bidForm.proposal" rows="6" required
                        class="textarea resize-none"
                        placeholder="Descreva sua proposta, experiência relevante e por que você é o profissional ideal para este projeto..."></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="bidError" class="alert alert-danger">
              <div class="flex items-center gap-3">
                <span class="text-2xl">⚠️</span>
                <p class="font-semibold">{{ bidError }}</p>
              </div>
            </div>

            <!-- Submit Button -->
            <button :disabled="sendingBid" type="submit"
                    class="btn-primary btn-lg w-full group">
              <span v-if="sendingBid" class="flex items-center justify-center gap-3">
                <span class="loading-spinner w-6 h-6"></span>
                Enviando sua proposta...
              </span>
              <span v-else class="flex items-center justify-center gap-3">
                🚀 <span>Enviar Minha Proposta</span>
              </span>
            </button>
          </form>
        </div>

        <!-- Login Prompt (not logged in) -->
        <div v-else-if="!user && project.status === 'bidding'" class="card card-elevated p-12 text-center">
          <div class="text-6xl mb-6">🔑</div>
          <h3 class="text-3xl font-bold text-neutral-900 mb-4">Faça login para enviar propostas!</h3>
          <p class="text-lg text-neutral-600 mb-8">Crie sua conta gratuitamente e comece a conquistar projetos incríveis!</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/login" class="btn-primary btn-lg">
              🔐 Fazer Login
            </router-link>
            <router-link to="/register" class="btn-ghost btn-lg">
              Criar Conta Grátis
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const project = ref(null);
const bids = ref([]);
const loading = ref(false);
const user = ref(null);
const sendingBid = ref(false);
const bidError = ref('');
const bidForm = reactive({ amount: null, delivery_time_days: 7, proposal: '' });

const statusClasses = {
  'open': 'badge badge-primary',
  'bidding': 'badge badge-secondary',
  'in_progress': 'badge badge-warning',
  'completed': 'badge badge-success',
  'cancelled': 'badge badge-danger'
};

const statusLabels = {
  'open': '🟢 ABERTO',
  'bidding': '🔵 RECEBENDO PROPOSTAS',
  'in_progress': '🟡 EM ANDAMENTO',
  'completed': '🟣 CONCLUÍDO',
  'cancelled': '🔴 CANCELADO'
};

const isMyProject = computed(() => user.value && project.value && project.value.contractor_id === user.value.id);
const canBid = computed(() => user.value && (user.value.user_type === 'provider' || user.value.user_type === 'both') && project.value && project.value.contractor_id !== user.value.id);
const canConfirmWinner = computed(() => isMyProject.value);

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
}

async function fetchUser() {
  try {
    const { data } = await api.get('/api/user');
    user.value = data.user;
  } catch {
    user.value = null;
  }
}

async function loadProject() {
  loading.value = true;
  try {
    const { data } = await api.get(`/api/projects/${id}`);
    project.value = data;
  } catch (e) {
    project.value = null;
  } finally {
    loading.value = false;
  }
}

async function loadBids() {
  try {
    const { data } = await api.get(`/api/projects/${id}/bids`);
    bids.value = data;
  } catch {
    bids.value = [];
  }
}

async function submitBid() {
  sendingBid.value = true;
  bidError.value = '';
  try {
    await api.post('/api/bids', {
      ...bidForm,
      project_id: parseInt(id)
    });
    bidForm.amount = null;
    bidForm.delivery_time_days = 7;
    bidForm.proposal = '';
    await loadBids();
    await loadProject();
  } catch (e) {
    bidError.value = e.response?.data?.message || 'Erro ao enviar lance. Tente novamente.';
  } finally {
    sendingBid.value = false;
  }
}

async function confirmWinner(bidId) {
  if (!confirm('Tem certeza que deseja aceitar este lance? Esta ação não pode ser desfeita.')) return;
  try {
    await api.post(`/api/projects/${id}/confirm-winner`, { bid_id: bidId });
    await loadProject();
    await loadBids();
  } catch (e) {
    alert(e.response?.data?.message || 'Erro ao confirmar vencedor');
  }
}

onMounted(async () => {
  await fetchUser();
  await loadProject();
  await loadBids();
});
</script>
