<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>
    
    <!-- Modal content -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <span class="text-4xl">🚀</span>
              </div>
              <div>
                <h3 class="text-3xl font-black text-white">Enviar Lance</h3>
                <p class="text-purple-100 font-semibold">{{ project?.title || 'Carregando...' }}</p>
              </div>
            </div>
            <button @click="close" class="text-white hover:text-purple-200 transition-colors">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <!-- Project Info Summary -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border-2 border-blue-100">
            <div class="grid md:grid-cols-3 gap-4">
              <!-- Budget Info -->
              <div class="text-center">
                <div class="text-3xl mb-2">💰</div>
                <p class="text-sm font-bold text-gray-600 uppercase">Orçamento Max</p>
                <p class="text-2xl font-black text-blue-600">R$ {{ formatCurrency(project?.max_budget || 0) }}</p>
              </div>

              <!-- Current Best Bid -->
              <div class="text-center">
                <div class="text-3xl mb-2">🎯</div>
                <p class="text-sm font-bold text-gray-600 uppercase">Melhor Lance</p>
                <p class="text-2xl font-black text-success-600">
                  {{ bestBid ? `R$ ${formatCurrency(bestBid)}` : 'Nenhum' }}
                </p>
              </div>

              <!-- Time Remaining -->
              <div class="text-center">
                <div class="text-3xl mb-2">⏰</div>
                <p class="text-sm font-bold text-gray-600 uppercase">Tempo Restante</p>
                <CountdownTimer 
                  v-if="project?.bidding_ends_at"
                  :endTime="project.bidding_ends_at"
                  size="sm"
                  @expired="onBiddingExpired"
                  @urgent="onBiddingUrgent"
                />
              </div>
            </div>
          </div>

          <!-- Bid Form -->
          <form @submit.prevent="submitBid" class="space-y-6">
            <!-- Amount and Days -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">
                  💰 Valor da Proposta (R$)
                </label>
                <input 
                  v-model.number="bidForm.amount" 
                  type="number" 
                  step="0.01" 
                  :max="project?.max_budget"
                  required
                  class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold text-xl"
                  placeholder="Ex: 2500.00" 
                />
                <p class="text-sm text-gray-500 mt-2">
                  Máximo: R$ {{ formatCurrency(project?.max_budget || 0) }}
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">
                  ⏱️ Prazo de Entrega (dias)
                </label>
                <input 
                  v-model.number="bidForm.delivery_time_days" 
                  type="number" 
                  min="1" 
                  required
                  class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold text-xl"
                  placeholder="Ex: 7" 
                />
              </div>
            </div>

            <!-- Real-time Score Preview -->
            <div v-if="bidForm.amount && bidForm.amount > 0" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">📊</span>
                Preview do Seu Placar
              </h4>
              <ScoreProgress
                :currentBid="bidForm.amount"
                :maxBudget="project?.max_budget || 0"
                :providerRating="currentUserRating"
                :showBreakdown="true"
                size="lg"
                @scoreChange="onScorePreview"
              />
              <p class="text-sm text-gray-600 mt-2">
                💡 <strong>Dica:</strong> O placar combina 70% desconto no preço + 30% sua reputação
              </p>
            </div>

            <!-- Proposal Text -->
            <div>
              <label class="block text-sm font-black text-gray-700 uppercase tracking-wider mb-3">
                📝 Detalhes da Proposta
              </label>
              <textarea 
                v-model="bidForm.proposal" 
                rows="6" 
                required
                class="w-full px-5 py-4 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold resize-none text-base"
                placeholder="Descreva sua proposta, experiência relevante e por que você é o profissional ideal para este projeto..."
              ></textarea>
              <p class="text-sm text-gray-500 mt-2">
                {{ bidForm.proposal.length }}/500 caracteres
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-4 border-red-400 rounded-2xl p-6">
              <div class="flex items-center gap-3">
                <span class="text-4xl">⚠️</span>
                <div>
                  <p class="text-lg font-black text-red-800">Erro ao Enviar Lance</p>
                  <p class="text-red-700 font-semibold">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                type="button" 
                @click="close"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-2xl transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="isSubmitting || !bidForm.amount || !bidForm.proposal"
                class="flex-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-xl"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  🚀 Enviar Minha Proposta
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import CountdownTimer from './CountdownTimer.vue';
import ScoreProgress from './ScoreProgress.vue';
import api from '../services/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  },
  existingBids: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'bidSubmitted', 'biddingExpired']);

// Form state
const bidForm = reactive({
  amount: null,
  delivery_time_days: 7,
  proposal: ''
});

const isSubmitting = ref(false);
const error = ref('');

// Computed values
const bestBid = computed(() => {
  if (!props.existingBids.length) return null;
  return Math.min(...props.existingBids.map(bid => bid.amount));
});

const currentUserRating = computed(() => {
  return props.currentUser?.rating || 4.0; // Default rating
});

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

function close() {
  // Reset form
  bidForm.amount = null;
  bidForm.delivery_time_days = 7;
  bidForm.proposal = '';
  error.value = '';
  
  emit('close');
}

async function submitBid() {
  if (!props.project?.id) return;
  
  isSubmitting.value = true;
  error.value = '';
  
  try {
    await api.post('/api/bids', {
      project_id: props.project.id,
      amount: bidForm.amount,
      delivery_time_days: bidForm.delivery_time_days,
      proposal: bidForm.proposal
    });
    
    // Reset form
    bidForm.amount = null;
    bidForm.delivery_time_days = 7;
    bidForm.proposal = '';
    
    emit('bidSubmitted');
    close();
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao enviar lance. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
}

function onScorePreview(scoreData) {
  console.log('Preview do placar:', scoreData);
}

function onBiddingExpired() {
  emit('biddingExpired');
  close();
}

function onBiddingUrgent() {
  // Could show a warning toast here
  console.log('Atenção: Tempo de lances está acabando!');
}

// Watch for project changes to suggest reasonable bid
watch(() => props.project?.max_budget, (newBudget) => {
  if (newBudget && !bidForm.amount) {
    // Suggest 85% of max budget as starting point
    bidForm.amount = Math.round(newBudget * 0.85);
  }
});
</script>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>