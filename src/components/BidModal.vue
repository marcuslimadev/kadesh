<template>
  <div v-if="isOpen" class="modal-overlay" @click="close">
    <!-- Modal Container -->
    <div class="modal-container">
      <!-- Modal Content -->
      <div class="modal-content max-w-4xl">
        <!-- Modal Header -->
        <div class="modal-header bg-neutral-900">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
                <span class="text-4xl">🚀</span>
              </div>
              <div>
                <h3 class="text-3xl font-semibold text-white">Enviar Lance</h3>
                <p class="text-neutral-200 font-semibold">{{ project?.title || 'Carregando...' }}</p>
              </div>
            </div>
            <button @click="close" class="modal-close text-white hover:text-neutral-300">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Project Info Summary Card -->
          <div class="card card-elevated mb-6">
            <div class="card-body">
              <div class="grid grid-responsive-cols-3 gap-6">
                <!-- Budget Info -->
                <div class="text-center">
                  <div class="text-3xl mb-3">💰</div>
                  <p class="text-sm font-bold text-neutral-600 uppercase tracking-wider mb-2">Orçamento Max</p>
                  <p class="text-3xl font-bold text-primary-600">R$ {{ formatCurrency(project?.max_budget || 0) }}</p>
                </div>

                <!-- Current Best Bid -->
                <div class="text-center">
                  <div class="text-3xl mb-3">🏆</div>
                  <p class="text-sm font-bold text-neutral-600 uppercase tracking-wider mb-2">Melhor Lance</p>
                  <p class="text-3xl font-bold text-success-600">
                    {{ bestBid ? `R$ ${formatCurrency(bestBid)}` : 'Nenhum' }}
                  </p>
                </div>

                <!-- Time Remaining -->
                <div class="text-center">
                  <div class="text-3xl mb-3">⏰</div>
                  <p class="text-sm font-bold text-neutral-600 uppercase tracking-wider mb-2">Tempo Restante</p>
                  <CountdownTimer
                    v-if="project?.bidding_ends_at"
                    :endTime="project.bidding_ends_at"
                    size="large"
                    @expired="onBiddingExpired"
                    @urgent="onBiddingUrgent"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Bid Form -->
          <form @submit.prevent="submitBid" class="space-y-6">
            <!-- Amount and Days Grid -->
            <div class="grid grid-responsive-cols-2 gap-6">
              <div>
                <label class="label">
                  💰 Valor da Proposta (R$)
                </label>
                <input
                  v-model.number="bidForm.amount"
                  type="number"
                  step="0.01"
                  :max="project?.max_budget"
                  required
                  class="input input-lg"
                  placeholder="Ex: 2500.00"
                />
                <p class="form-help">
                  Máximo: R$ {{ formatCurrency(project?.max_budget || 0) }}
                </p>
              </div>

              <div>
                <label class="label">
                  ⏱️ Prazo de Entrega (dias)
                </label>
                <input
                  v-model.number="bidForm.delivery_time_days"
                  type="number"
                  min="1"
                  required
                  class="input input-lg"
                  placeholder="Ex: 7"
                />
              </div>
            </div>

            <!-- Real-time Score Preview -->
            <div v-if="bidForm.amount && bidForm.amount > 0" class="card card-elevated border-success-200 bg-success-50">
              <div class="card-body">
                <h4 class="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span class="text-2xl">📊</span>
                  Preview do Seu Placar
                </h4>
                <ScoreProgress
                  :currentBid="bidForm.amount"
                  :maxBudget="project?.max_budget || 0"
                  :providerRating="currentUserRating"
                  :showBreakdown="true"
                  size="large"
                  @scoreChange="onScorePreview"
                />
                <p class="text-sm text-neutral-600 mt-3">
                  <strong>Dica:</strong> O placar combina 70% desconto no preço + 30% sua reputação
                </p>
              </div>
            </div>

            <!-- Proposal Text -->
            <div>
              <label class="label">
                📝 Detalhes da Proposta
              </label>
              <textarea
                v-model="bidForm.proposal"
                rows="6"
                required
                class="textarea textarea-lg"
                placeholder="Descreva sua proposta, experiência relevante e por que você é o profissional ideal para este projeto..."
              ></textarea>
              <p class="form-help">
                {{ bidForm.proposal.length }}/500 caracteres
              </p>
            </div>

            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger">
              <div class="flex items-center gap-3">
                <span class="text-3xl">⚠️</span>
                <div>
                  <p class="text-lg font-semibold text-danger-800">Erro ao Enviar Lance</p>
                  <p class="text-danger-700">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
              <button
                type="button"
                @click="close"
                class="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !bidForm.amount || !bidForm.proposal"
                class="btn-primary flex-1"
              >
                <span v-if="isSubmitting" class="loading-spinner mr-2"></span>
                <span v-if="isSubmitting">Enviando...</span>
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
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>



