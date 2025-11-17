<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Milestones do Contrato</h3>
          <p v-if="escrowInfo" class="text-sm text-gray-600 mt-1">
            Escrow: R$ {{ escrowInfo.released.toFixed(2) }} / R$ {{ escrowInfo.total.toFixed(2) }}
            <span class="text-gray-400">
              ({{ ((escrowInfo.released / escrowInfo.total) * 100).toFixed(0) }}% liberado)
            </span>
          </p>
        </div>
        <button
          v-if="isClient && !showForm"
          @click="showForm = true"
          class="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition text-sm"
        >
          + Novo Milestone
        </button>
      </div>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="p-6 border-b border-gray-200 bg-gray-50">
      <MilestoneForm
        :contract-id="contractId"
        :on-success="handleMilestoneCreated"
        :on-cancel="() => showForm = false"
      />
    </div>

    <!-- Milestones List -->
    <div v-if="loading" class="p-12 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
      <p class="text-gray-500 mt-2">Carregando milestones...</p>
    </div>

    <div v-else-if="milestones.length === 0" class="p-12 text-center">
      <p class="text-gray-500">Nenhum milestone criado ainda.</p>
      <p v-if="isClient" class="text-sm text-gray-400 mt-1">Crie o primeiro milestone para dividir o pagamento em etapas.</p>
    </div>

    <div v-else class="divide-y divide-gray-200">
      <MilestoneCard
        v-for="milestone in milestones"
        :key="milestone.id"
        :milestone="milestone"
        :is-client="isClient"
        :is-provider="isProvider"
        @updated="loadMilestones"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import MilestoneForm from './MilestoneForm.vue'
import MilestoneCard from './MilestoneCard.vue'

const props = defineProps({
  contractId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  providerId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const toast = useToast()
const loading = ref(true)
const milestones = ref([])
const showForm = ref(false)
const escrowInfo = ref(null)

const isClient = computed(() => authStore.user?.id === props.clientId)
const isProvider = computed(() => authStore.user?.id === props.providerId)

const loadMilestones = async () => {
  loading.value = true
  try {
    const response = await api.get(`/api/milestones/contract/${props.contractId}`)
    milestones.value = response.data.milestones || []
    escrowInfo.value = response.data.escrow_info || null
  } catch (error) {
    console.error('Error loading milestones:', error)
    toast.error('Erro ao carregar milestones')
  } finally {
    loading.value = false
  }
}

const handleMilestoneCreated = () => {
  showForm.value = false
  loadMilestones()
}

onMounted(() => {
  loadMilestones()
})
</script>
