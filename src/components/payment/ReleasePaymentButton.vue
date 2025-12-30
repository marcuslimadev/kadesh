<template>
  <div v-if="shouldShowButton" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-semibold text-green-900">Projeto Concluído</h3>
        </div>
        <p class="text-sm text-green-700 mb-4">
          O prestador {{ providerName }} concluiu o trabalho. Revise a entrega e libere o pagamento de <strong>R$ {{ formatCurrency(amount) }}</strong>.
        </p>
        <div class="bg-white border border-green-200 rounded p-3 mb-4">
          <p class="text-xs text-gray-600 mb-1">💰 Valor a ser transferido:</p>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-green-600">R$ {{ formatCurrency(netAmount) }}</span>
            <span class="text-sm text-gray-500">({{ platformFeePercent }}% taxa: R$ {{ formatCurrency(platformFee) }})</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="confirmRelease"
        :disabled="isReleasing"
        class="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
      >
        <span v-if="!isReleasing" class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Liberar Pagamento
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </span>
      </button>
      
      <button
        @click="reportIssue"
        class="px-4 py-3 bg-white text-red-600 border-2 border-red-300 font-medium rounded-lg hover:bg-red-50 transition-colors"
      >
        Reportar Problema
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirmar Liberação de Pagamento</h3>
        <p class="text-gray-600 mb-6">
          Você está prestes a liberar <strong class="text-green-600">R$ {{ formatCurrency(netAmount) }}</strong> para {{ providerName }}.
          Esta ação é irreversível.
        </p>
        <div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
          <p class="text-sm text-yellow-800">
            ⚠️ <strong>Atenção:</strong> A taxa da plataforma de {{ platformFeePercent }}% (R$ {{ formatCurrency(platformFee) }}) será deduzida automaticamente.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showConfirmModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="executeRelease"
            :disabled="isReleasing"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Confirmar Liberação
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  isContractor: {
    type: Boolean,
    required: true
  },
  providerName: {
    type: String,
    default: 'o prestador'
  }
})

const emit = defineEmits(['payment-released'])

const router = useRouter()
const isReleasing = ref(false)
const showConfirmModal = ref(false)

const platformFeePercent = ref(10) // Pode vir de env var
const amount = computed(() => props.finalPrice)
const platformFee = computed(() => amount.value * (platformFeePercent.value / 100))
const netAmount = computed(() => amount.value - platformFee.value)

const shouldShowButton = computed(() => {
  return props.isContractor && 
         (props.paymentStatus === 'escrow_hold' || props.paymentStatus === 'pending')
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const confirmRelease = () => {
  showConfirmModal.value = true
}

const executeRelease = async () => {
  try {
    isReleasing.value = true
    
    const response = await api.post(`/projects/${props.projectId}/release-payment`)
    
    if (response.data.success) {
      emit('payment-released', response.data)
      
      // Show success notification
      alert(`✅ Pagamento liberado com sucesso!\n\nValor transferido: R$ ${formatCurrency(netAmount.value)}\nTaxa da plataforma: R$ ${formatCurrency(platformFee.value)}`)
      
      // Redirect or reload
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  } catch (error) {
    console.error('Error releasing payment:', error)
    alert(`❌ Erro ao liberar pagamento: ${error.response?.data?.error || error.message}`)
  } finally {
    isReleasing.value = false
    showConfirmModal.value = false
  }
}

const reportIssue = () => {
  router.push(`/support/dispute?project=${props.projectId}`)
}
</script>
