<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <LoadingScreen v-if="loading" />
    
    <div v-else-if="project" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Project Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ project.title }}</h1>
            <p class="text-gray-600">{{ project.description }}</p>
          </div>
          <span
            class="px-4 py-2 rounded-full text-sm font-bold"
            :class="getStatusClass(project.status)"
          >
            {{ getStatusLabel(project.status) }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Valor Final</div>
            <div class="text-2xl font-bold text-primary-900">
              R$ {{ formatMoney(project.final_price || project.max_budget) }}
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Provider</div>
            <div class="text-lg font-semibold text-gray-900">
              <router-link
                :to="`/provider/${project.provider_id}`"
                class="text-accent-600 hover:text-accent-700"
              >
                {{ project.provider_name }}
              </router-link>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Criado em</div>
            <div class="text-lg font-semibold text-gray-900">
              {{ formatDate(project.created_at) }}
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Entregas</div>
            <div class="text-2xl font-bold text-green-600">
              {{ deliveries.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Deliveries Tab -->
          <div v-if="activeTab === 'deliveries'">
            <!-- Create Delivery Form (Provider only) -->
            <div v-if="isProvider && project.status === 'in_progress'" class="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">📦 Nova Entrega</h3>
              <form @submit.prevent="handleCreateDelivery" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Entrega
                  </label>
                  <textarea
                    v-model="deliveryForm.description"
                    rows="3"
                    required
                    class="input"
                    placeholder="Descreva o que foi entregue..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionais (Opcional)
                  </label>
                  <textarea
                    v-model="deliveryForm.notes"
                    rows="2"
                    class="input"
                    placeholder="Observações, instruções, etc..."
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Anexos
                  </label>
                  <input
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    class="input"
                    accept="image/*,.pdf,.doc,.docx,.zip"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Máximo 10 arquivos. Formatos aceitos: imagens, PDF, DOC, ZIP
                  </p>
                </div>

                <button
                  type="submit"
                  :disabled="deliveriesLoading"
                  class="btn btn-primary"
                >
                  {{ deliveriesLoading ? 'Enviando...' : '📤 Enviar Entrega' }}
                </button>
              </form>
            </div>

            <!-- Deliveries List -->
            <div v-if="deliveries.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-6xl mb-4">📭</div>
              <p>Nenhuma entrega ainda</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="delivery in deliveries"
                :key="delivery.id"
                class="bg-gray-50 rounded-lg p-6 border-l-4"
                :class="getDeliveryBorderClass(delivery.status)"
              >
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold text-gray-900">
                        Entrega #{{ delivery.id }}
                      </h3>
                      <span
                        class="px-3 py-1 rounded-full text-xs font-bold"
                        :class="getDeliveryStatusClass(delivery.status)"
                      >
                        {{ getDeliveryStatusLabel(delivery.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600">
                      Enviado em {{ formatDateTime(delivery.created_at) }}
                    </p>
                  </div>
                </div>

                <p class="text-gray-800 mb-3">{{ delivery.description }}</p>
                
                <div v-if="delivery.notes" class="bg-white rounded p-3 mb-3">
                  <p class="text-sm text-gray-600">
                    <strong>Notas:</strong> {{ delivery.notes }}
                  </p>
                </div>

                <!-- Files -->
                <div v-if="delivery.files && delivery.files.length > 0" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">📎 Anexos:</p>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="(file, index) in delivery.files"
                      :key="index"
                      :href="file.url"
                      target="_blank"
                      class="px-3 py-2 bg-white rounded border border-gray-300 hover:border-accent-500 text-sm"
                    >
                      📄 {{ file.name }}
                    </a>
                  </div>
                </div>

                <!-- Feedback -->
                <div v-if="delivery.feedback" class="bg-yellow-50 border-l-4 border-yellow-500 p-3 mb-3">
                  <p class="text-sm">
                    <strong>Feedback do cliente:</strong> {{ delivery.feedback }}
                  </p>
                </div>

                <!-- Actions (Client only) -->
                <div v-if="!isProvider && delivery.status === 'pending'" class="flex gap-3 mt-4">
                  <button
                    @click="handleApproveDelivery(delivery.id)"
                    class="btn btn-primary"
                  >
                    ✅ Aprovar Entrega
                  </button>
                  <button
                    @click="handleRequestRevision(delivery.id)"
                    class="btn bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    🔄 Solicitar Revisão
                  </button>
                  <button
                    @click="handleRejectDelivery(delivery.id)"
                    class="btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    ❌ Rejeitar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Tab -->
          <div v-else-if="activeTab === 'timeline'">
            <div class="space-y-4">
              <div
                v-for="event in timeline"
                :key="event.id"
                class="flex gap-4"
              >
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-primary-900 rounded-full flex items-center justify-center text-white">
                    {{ getEventIcon(event.type) }}
                  </div>
                </div>
                <div class="flex-1 bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="font-semibold text-gray-900">{{ event.title }}</h4>
                    <span class="text-xs text-gray-500">
                      {{ formatDateTime(event.created_at) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ event.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Details Tab -->
          <div v-else-if="activeTab === 'details'">
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Categoria</h4>
                <p class="text-gray-700">{{ project.category }}</p>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Orçamento Original</h4>
                <p class="text-gray-700">
                  R$ {{ formatMoney(project.min_budget) }} - R$ {{ formatMoney(project.max_budget) }}
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Duração do Leilão</h4>
                <p class="text-gray-700">{{ project.auction_duration_days }} dias</p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Total de Lances Recebidos</h4>
                <p class="text-gray-700">{{ project.total_bids || 0 }} lances</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
      <p class="text-gray-500">Projeto não encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useDeliveries } from '@/composables/useDeliveries'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const { user } = useAuth()
const {
  deliveries,
  loading: deliveriesLoading,
  fetchDeliveries,
  createDelivery,
  approveDelivery,
  requestRevision,
  rejectDelivery
} = useDeliveries()

const project = ref(null)
const timeline = ref([])
const loading = ref(true)
const activeTab = ref('deliveries')

const deliveryForm = ref({
  description: '',
  notes: '',
  files: []
})

const tabs = [
  { id: 'deliveries', label: 'Entregas' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'details', label: 'Detalhes' }
]

const isProvider = computed(() => {
  return user.value?.id === project.value?.provider_id
})

const fetchProjectData = async () => {
  loading.value = true
  try {
    const projectId = route.params.id
    
    // Fetch project
    const projectRes = await axios.get(`/api/projects/${projectId}`, {
      withCredentials: true
    })
    project.value = projectRes.data.project || projectRes.data

    // Fetch deliveries
    await fetchDeliveries(projectId)

    // Fetch timeline
    try {
      const timelineRes = await axios.get(`/api/projects/${projectId}/timeline`, {
        withCredentials: true
      })
      timeline.value = timelineRes.data.timeline || timelineRes.data || []
    } catch (err) {
      console.log('Timeline não disponível')
    }
  } catch (err) {
    console.error('Erro ao carregar projeto:', err)
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event) => {
  deliveryForm.value.files = Array.from(event.target.files)
}

const handleCreateDelivery = async () => {
  try {
    await createDelivery(route.params.id, deliveryForm.value)
    
    // Reset form
    deliveryForm.value = { description: '', notes: '', files: [] }
    
    alert('✅ Entrega enviada com sucesso!')
    await fetchDeliveries(route.params.id)
  } catch (err) {
    alert('❌ Erro ao enviar entrega: ' + (err.message || 'Erro desconhecido'))
  }
}

const handleApproveDelivery = async (deliveryId) => {
  if (confirm('Aprovar esta entrega?')) {
    try {
      await approveDelivery(deliveryId, 'Entrega aprovada!')
      alert('✅ Entrega aprovada!')
      await fetchDeliveries(route.params.id)
    } catch (err) {
      alert('❌ Erro ao aprovar')
    }
  }
}

const handleRequestRevision = async (deliveryId) => {
  const notes = prompt('Descreva o que precisa ser revisado:')
  if (notes) {
    try {
      await requestRevision(deliveryId, notes)
      alert('🔄 Revisão solicitada!')
      await fetchDeliveries(route.params.id)
    } catch (err) {
      alert('❌ Erro ao solicitar revisão')
    }
  }
}

const handleRejectDelivery = async (deliveryId) => {
  const reason = prompt('Motivo da rejeição:')
  if (reason) {
    try {
      await rejectDelivery(deliveryId, reason)
      alert('❌ Entrega rejeitada')
      await fetchDeliveries(route.params.id)
    } catch (err) {
      alert('❌ Erro ao rejeitar')
    }
  }
}

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    'active': 'Ativo',
    'in_progress': 'Em Andamento',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const getDeliveryBorderClass = (status) => {
  const classes = {
    'pending': 'border-yellow-500',
    'approved': 'border-green-500',
    'rejected': 'border-red-500',
    'revision_requested': 'border-orange-500'
  }
  return classes[status] || 'border-gray-300'
}

const getDeliveryStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'revision_requested': 'bg-orange-100 text-orange-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getDeliveryStatusLabel = (status) => {
  const labels = {
    'pending': 'Pendente',
    'approved': 'Aprovada',
    'rejected': 'Rejeitada',
    'revision_requested': 'Revisão Solicitada'
  }
  return labels[status] || status
}

const getEventIcon = (type) => {
  const icons = {
    'created': '📋',
    'bid_placed': '💰',
    'bid_won': '🏆',
    'started': '▶️',
    'delivery': '📦',
    'payment': '💳',
    'completed': '✅'
  }
  return icons[type] || '•'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

onMounted(() => {
  fetchProjectData()
})
</script>
