<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-8 px-4">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-5xl mx-auto">
      <div class="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-purple-200">
        <div class="relative inline-block mb-6">
          <div class="w-20 h-20 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-20 h-20 border-8 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
          Carregando projeto incrível...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!project" class="max-w-5xl mx-auto">
      <div class="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-3xl shadow-2xl p-12 text-center border-4 border-red-300">
        <div class="relative inline-block mb-6">
          <svg class="w-24 h-24 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 mb-4">
          Ops! Projeto não encontrado
        </h2>
        <p class="text-lg text-gray-700 font-semibold mb-8">Este projeto pode ter sido removido ou não existe mais.</p>
        <router-link to="/projects" class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Voltar para Projetos
        </router-link>
      </div>
    </div>

    <!-- Project Content -->
    <div v-else class="max-w-5xl mx-auto space-y-8">
      <!-- Back Button -->
      <router-link to="/projects" class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-lg transition-colors group">
        <svg class="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path>
        </svg>
        Voltar aos Projetos
      </router-link>

      <!-- Main Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-transparent hover:border-purple-200 transition-all">
        <!-- Gradient Top Bar -->
        <div class="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"></div>
        
        <div class="p-8 sm:p-10">
          <!-- Status Badges Row -->
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span :class="statusClasses[project.status]" class="px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider shadow-lg">
              {{ statusLabels[project.status] }}
            </span>
            <span v-if="isMyProject" class="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full text-sm font-black uppercase shadow-lg">
              👔 Meu Projeto
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-6 leading-tight">
            {{ project.title }}
          </h1>

          <!-- Description -->
          <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 mb-8 border-2 border-gray-200">
            <p class="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
              {{ project.description }}
            </p>
          </div>

          <!-- Info Cards Grid -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <!-- Budget Card -->
            <div class="group bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div class="text-white text-center">
                <div class="text-4xl mb-2 group-hover:scale-125 transition-transform">💰</div>
                <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">Orçamento</p>
                <p class="text-2xl font-black">R$ {{ formatMoney(project.max_budget) }}</p>
              </div>
            </div>

            <!-- Deadline Card -->
            <div class="group bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div class="text-white text-center">
                <div class="text-4xl mb-2 group-hover:scale-125 transition-transform">📅</div>
                <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">Prazo Final</p>
                <p class="text-lg font-black">{{ formatDate(project.project_deadline) }}</p>
              </div>
            </div>

            <!-- Bidding Ends Card -->
            <div class="group bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div class="text-white text-center">
                <div class="text-4xl mb-2 group-hover:scale-125 transition-transform">⏰</div>
                <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">Propostas até</p>
                <p class="text-lg font-black">{{ formatDate(project.bidding_ends_at) }}</p>
              </div>
            </div>

            <!-- Bids Count Card -->
            <div class="group bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div class="text-white text-center">
                <div class="text-4xl mb-2 group-hover:scale-125 transition-transform">🎯</div>
                <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">Propostas</p>
                <p class="text-3xl font-black">{{ bids.length }}</p>
              </div>
            </div>
          </div>

          <!-- Skills Tags -->
          <div v-if="project.required_skills && project.required_skills.length" class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-lg font-black text-gray-700">🛠️ Habilidades Necessárias:</span>
            </div>
            <div class="flex flex-wrap gap-3">
              <span v-for="(skill, i) in project.required_skills" :key="i" 
                    class="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bids/Proposals Section -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-100">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-4xl">🎯</span>
              </div>
              <div>
                <h2 class="text-3xl font-black text-white">Propostas Recebidas</h2>
                <p class="text-purple-100 font-semibold">{{ bids.length }} {{ bids.length === 1 ? 'proposta enviada' : 'propostas enviadas' }}</p>
              </div>
            </div>
            <div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
              <p class="text-5xl font-black text-white">{{ bids.length }}</p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <!-- No Bids State -->
          <div v-if="bids.length === 0" class="text-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-4 border-dashed border-gray-300">
            <div class="relative inline-block mb-6">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 text-5xl animate-bounce">💡</div>
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-2">Nenhuma proposta ainda!</h3>
            <p class="text-lg text-gray-600 font-semibold">Seja o primeiro profissional a enviar sua proposta para este projeto.</p>
          </div>

          <!-- Bids List -->
          <div v-else class="space-y-6">
            <div v-for="bid in bids" :key="bid.id" 
                 class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border-4 border-transparent hover:border-purple-200 transition-all duration-300 overflow-hidden">
              <!-- Gradient Top Bar -->
              <div class="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div class="p-6">
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div class="flex-1">
                    <!-- Provider Info -->
                    <div class="flex items-center gap-4 mb-6">
                      <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <span class="text-white font-black text-2xl">{{ bid.provider?.name?.charAt(0).toUpperCase() || '?' }}</span>
                      </div>
                      <div>
                        <p class="text-xl font-black text-gray-900">{{ bid.provider?.name || 'Fornecedor' }}</p>
                        <p class="text-sm text-gray-600 font-semibold flex items-center gap-1">
                          <span>⭐⭐⭐⭐⭐</span>
                          <span>4.8 (120 avaliações)</span>
                        </p>
                      </div>
                    </div>

                    <!-- Bid Amount & Time -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                      <div class="bg-gradient-to-br from-emerald-400 via-green-400 to-teal-400 rounded-2xl p-5 text-white text-center shadow-lg">
                        <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">💰 Valor</p>
                        <p class="text-3xl font-black">R$ {{ formatMoney(bid.amount) }}</p>
                      </div>
                      <div class="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-2xl p-5 text-white text-center shadow-lg">
                        <p class="text-xs font-bold uppercase tracking-wider opacity-90 mb-1">⏱️ Prazo</p>
                        <p class="text-3xl font-black">{{ bid.delivery_time_days }} dias</p>
                      </div>
                    </div>

                    <!-- Proposal Text -->
                    <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border-2 border-gray-200 mb-4">
                      <p class="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">📝 Proposta:</p>
                      <p class="text-base text-gray-800 leading-relaxed font-medium">{{ bid.proposal }}</p>
                    </div>

                    <!-- Bid Date -->
                    <p class="text-sm text-gray-500 font-semibold">📅 Enviado em {{ formatDate(bid.created_at) }}</p>
                  </div>

                  <!-- Accept Button (owner only) -->
                  <div v-if="canConfirmWinner && project.status === 'bidding'" class="lg:ml-6">
                    <button @click="confirmWinner(bid.id)" 
                            class="w-full lg:w-auto bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-black px-8 py-4 rounded-2xl shadow-2xl hover:shadow-green-500/50 transform hover:scale-110 transition-all text-lg">
                      ✅ Aceitar Proposta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bid Form (providers only) -->
      <div v-if="canBid && project.status === 'bidding'" class="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-100">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <span class="text-4xl">🚀</span>
            </div>
            <div>
              <h3 class="text-3xl font-black text-white">Enviar Minha Proposta</h3>
              <p class="text-purple-100 font-semibold">Destaque-se e ganhe este projeto!</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitBid" class="p-6 sm:p-8 space-y-6">
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">💰 Valor da Proposta (R$)</label>
              <input v-model.number="bidForm.amount" type="number" step="0.01" required
                     class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold text-xl"
                     placeholder="Ex: 2500.00" />
            </div>
            <div>
              <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">⏱️ Prazo de Entrega (dias)</label>
              <input v-model.number="bidForm.delivery_time_days" type="number" min="1" required
                     class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold text-xl"
                     placeholder="Ex: 7" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">📝 Detalhes da Proposta</label>
            <textarea v-model="bidForm.proposal" rows="6" required
                      class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold resize-none text-base"
                      placeholder="Descreva sua proposta, experiência relevante e por que você é o profissional ideal para este projeto..."></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="bidError" class="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-4 border-red-400 rounded-2xl p-6">
            <div class="flex items-center gap-3">
              <svg class="w-8 h-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-800 font-black text-lg">{{ bidError }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button :disabled="sendingBid" type="submit"
                  class="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xl px-8 py-5 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all">
            <span v-if="sendingBid" class="flex items-center justify-center gap-3">
              <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando sua proposta...
            </span>
            <span v-else class="flex items-center justify-center gap-3">
              🚀 <span>Enviar Minha Proposta</span> ✨
            </span>
          </button>
        </form>
      </div>

      <!-- Login Prompt (not logged in) -->
      <div v-else-if="!user && project.status === 'bidding'" class="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl shadow-2xl p-10 text-center border-4 border-amber-300">
        <div class="relative inline-block mb-6">
          <svg class="w-24 h-24 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <div class="absolute -top-4 -right-4 text-5xl animate-bounce">🔑</div>
        </div>
        <h3 class="text-3xl font-black text-gray-900 mb-4">Faça login para enviar propostas!</h3>
        <p class="text-lg text-gray-700 font-semibold mb-8">Crie sua conta gratuitamente e comece a conquistar projetos incríveis! 🎯</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/login" class="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-black px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all text-lg">
            🔐 Fazer Login
          </router-link>
          <router-link to="/register" class="inline-flex items-center justify-center gap-2 bg-white text-purple-600 font-black px-8 py-4 rounded-2xl shadow-2xl hover:shadow-xl transform hover:scale-110 transition-all border-4 border-purple-600 text-lg">
            ✨ Criar Conta Grátis
          </router-link>
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
  'open': 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white',
  'bidding': 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white',
  'in_progress': 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white',
  'completed': 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white',
  'cancelled': 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-600 text-white'
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
