<template>
  <div class="p-6 hover:bg-gray-50 transition">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <h4 class="text-base font-semibold text-gray-900">{{ milestone.title }}</h4>
          <span :class="statusClass">{{ statusLabel }}</span>
        </div>
        <p v-if="milestone.description" class="text-sm text-gray-600 mt-1">{{ milestone.description }}</p>
        
        <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <span class="font-medium text-gray-900">R$ {{ milestone.amount.toFixed(2) }}</span>
          <span v-if="milestone.due_date">Prazo: {{ formatDate(milestone.due_date) }}</span>
          <span v-if="milestone.released_at" class="text-green-600">
            ✓ Liberado em {{ formatDate(milestone.released_at) }}
          </span>
        </div>

        <p v-if="milestone.rejection_reason" class="text-sm text-red-600 mt-2 bg-red-50 px-3 py-2 rounded">
          <strong>Motivo da rejeição:</strong> {{ milestone.rejection_reason }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 ml-4">
        <!-- Provider: Submit -->
        <button
          v-if="isProvider && milestone.status === 'in_progress'"
          @click="submitMilestone"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Enviar para Aprovação
        </button>

        <!-- Client: Approve -->
        <button
          v-if="isClient && milestone.status === 'submitted'"
          @click="approveMilestone"
          :disabled="loading"
          class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
        >
          Aprovar
        </button>

        <!-- Client: Reject -->
        <button
          v-if="isClient && milestone.status === 'submitted'"
          @click="showRejectDialog = true"
          :disabled="loading"
          class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
        >
          Rejeitar
        </button>

        <!-- Client: Release Payment -->
        <button
          v-if="isClient && milestone.status === 'approved'"
          @click="releaseMilestone"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
        >
          💰 Liberar Pagamento
        </button>

        <!-- Delete (pending only) -->
        <button
          v-if="isClient && milestone.status === 'pending'"
          @click="deleteMilestone"
          :disabled="loading"
          class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Excluir"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- Reject Dialog -->
    <div v-if="showRejectDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Rejeitar Milestone</h3>
        <p class="text-sm text-gray-600 mb-4">Explique o motivo da rejeição:</p>
        <textarea
          v-model="rejectionReason"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          placeholder="Descreva o que precisa ser corrigido..."
        ></textarea>
        <div class="flex gap-3 mt-4">
          <button
            @click="rejectMilestone"
            :disabled="!rejectionReason.trim() || loading"
            class="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            Confirmar Rejeição
          </button>
          <button
            @click="showRejectDialog = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import { useToast } from 'vue-toastification'
import api from '@/services/api'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  isClient: {
    type: Boolean,
    default: false
  },
  isProvider: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['updated'])

// const toast = useToast()
const loading = ref(false)
const showRejectDialog = ref(false)
const rejectionReason = ref('')

const statusClass = computed(() => {
  const classes = {
    pending: 'px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded',
    in_progress: 'px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded',
    submitted: 'px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded',
    approved: 'px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded',
    rejected: 'px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded',
    released: 'px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded'
  }
  return classes[props.milestone.status] || classes.pending
})

const statusLabel = computed(() => {
  const labels = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    submitted: 'Aguardando Aprovação',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    released: 'Pagamento Liberado'
  }
  return labels[props.milestone.status] || props.milestone.status
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

const submitMilestone = async () => {
  loading.value = true
  try {
    await api.put(`/api/milestones/${props.milestone.id}/submit`)
    // toast.success('Milestone enviado para aprovação!')
    emit('updated')
  } catch (error) {
    console.error('Error submitting milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao enviar milestone')
  } finally {
    loading.value = false
  }
}

const approveMilestone = async () => {
  loading.value = true
  try {
    await api.put(`/api/milestones/${props.milestone.id}/approve`)
    // toast.success('Milestone aprovado!')
    emit('updated')
  } catch (error) {
    console.error('Error approving milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao aprovar milestone')
  } finally {
    loading.value = false
  }
}

const rejectMilestone = async () => {
  loading.value = true
  try {
    await api.put(`/api/milestones/${props.milestone.id}/reject`, {
      rejection_reason: rejectionReason.value
    })
    // toast.success('Milestone rejeitado')
    showRejectDialog.value = false
    rejectionReason.value = ''
    emit('updated')
  } catch (error) {
    console.error('Error rejecting milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao rejeitar milestone')
  } finally {
    loading.value = false
  }
}

const releaseMilestone = async () => {
  if (!confirm(`Confirma liberação de R$ ${props.milestone.amount.toFixed(2)} para o prestador?`)) {
    return
  }

  loading.value = true
  try {
    await api.put(`/api/milestones/${props.milestone.id}/release`)
    // toast.success('Pagamento liberado com sucesso!')
    emit('updated')
  } catch (error) {
    console.error('Error releasing milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao liberar pagamento')
  } finally {
    loading.value = false
  }
}

const deleteMilestone = async () => {
  if (!confirm('Tem certeza que deseja excluir este milestone?')) {
    return
  }

  loading.value = true
  try {
    await api.delete(`/api/milestones/${props.milestone.id}`)
    // toast.success('Milestone excluído')
    emit('updated')
  } catch (error) {
    console.error('Error deleting milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao excluir milestone')
  } finally {
    loading.value = false
  }
}
</script>
