<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Disputas</h1>
        <p class="text-gray-600 mt-2">Resolução de conflitos entre contratantes e fornecedores</p>
      </div>

      <LoadingScreen :show="loading" message="Carregando disputas..." icon="⚖️" />

      <!-- Tabs -->
      <div v-if="!loading" class="bg-white rounded-lg shadow mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'pending'"
              :class="activeTab === 'pending' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="px-6 py-4 border-b-2 font-medium text-sm"
            >
              <i class="fas fa-clock mr-2"></i>Pendentes
              <span v-if="pendingCount > 0" class="ml-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">{{ pendingCount }}</span>
            </button>
            <button 
              @click="activeTab = 'resolved'"
              :class="activeTab === 'resolved' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
              class="px-6 py-4 border-b-2 font-medium text-sm"
            >
              <i class="fas fa-check-circle mr-2"></i>Resolvidas
            </button>
          </nav>
        </div>
      </div>

      <!-- Lista de Disputas -->
      <div v-if="!loading" class="space-y-6">
        <div v-for="dispute in filteredDisputes" :key="dispute.id" class="bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-bold text-gray-900">{{ dispute.project_title }}</h3>
                  <span :class="{
                    'bg-orange-100 text-orange-800': dispute.status === 'open',
                    'bg-blue-100 text-blue-800': dispute.status === 'investigating',
                    'bg-green-100 text-green-800': dispute.status === 'resolved'
                  }" class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ getStatusLabel(dispute.status) }}
                  </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Aberta por</p>
                    <p class="font-medium text-gray-900">{{ dispute.opened_by_name }} ({{ dispute.opened_by_type }})</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Data de Abertura</p>
                    <p class="font-medium text-gray-900">{{ formatDate(dispute.created_at) }}</p>
                  </div>
                </div>

                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Motivo:</p>
                  <p class="text-gray-900">{{ dispute.reason }}</p>
                </div>

                <!-- Evidências -->
                <div v-if="dispute.evidence && dispute.evidence.length > 0" class="mb-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Evidências ({{ dispute.evidence.length }}):</p>
                  <div class="space-y-2">
                    <div v-for="(evidence, idx) in dispute.evidence" :key="idx" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div class="flex items-start gap-3">
                        <i class="fas fa-paperclip text-blue-600 mt-1"></i>
                        <div class="flex-1">
                          <p class="text-sm text-gray-900">{{ evidence.description }}</p>
                          <a v-if="evidence.file_url" :href="evidence.file_url" target="_blank" class="text-xs text-blue-600 hover:underline">
                            <i class="fas fa-download mr-1"></i>Baixar arquivo
                          </a>
                        </div>
                        <span class="text-xs text-gray-500">{{ formatDate(evidence.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resolução (se já resolvida) -->
                <div v-if="dispute.status === 'resolved' && dispute.resolution" class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-green-800 mb-2">Resolução:</p>
                  <p class="text-gray-900 mb-2">{{ dispute.resolution }}</p>
                  <p class="text-xs text-gray-600">
                    Resolvida em {{ formatDate(dispute.resolved_at) }} por {{ dispute.resolved_by_name }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Ações (apenas para disputas pendentes) -->
            <div v-if="dispute.status !== 'resolved'" class="flex gap-3 pt-4 border-t border-gray-200">
              <button @click="openResolveModal(dispute)" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                <i class="fas fa-check mr-2"></i>Resolver Disputa
              </button>
              <button @click="requestMoreInfo(dispute)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                <i class="fas fa-question-circle mr-2"></i>Solicitar Mais Informações
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredDisputes.length === 0" class="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <i class="fas fa-balance-scale text-6xl mb-4 opacity-30"></i>
          <p class="text-lg">
            {{ activeTab === 'pending' ? 'Nenhuma disputa pendente!' : 'Nenhuma disputa resolvida ainda.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Resolução -->
    <div v-if="showResolveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Resolver Disputa</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Decisão Final</label>
          <textarea 
            v-model="resolutionText"
            rows="6"
            placeholder="Descreva a decisão administrativa, penalidades aplicadas, reembolsos, etc..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Ação</label>
          <select v-model="resolutionAction" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="refund_contractor">Reembolsar Contratante</option>
            <option value="pay_provider">Pagar Fornecedor</option>
            <option value="split_50_50">Dividir 50/50</option>
            <option value="no_action">Sem Ação Financeira</option>
          </select>
        </div>

        <div class="flex gap-3">
          <button @click="showResolveModal = false" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">
            Cancelar
          </button>
          <button @click="resolveDispute" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
            <i class="fas fa-gavel mr-2"></i>Confirmar Resolução
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const loading = ref(false)
const activeTab = ref('pending')
const disputes = ref([])
const showResolveModal = ref(false)
const selectedDispute = ref(null)
const resolutionText = ref('')
const resolutionAction = ref('no_action')

const fetchDisputes = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/disputes', { withCredentials: true })
    disputes.value = res.data.disputes || res.data || []
  } catch (error) {
    console.error('Erro ao carregar disputas:', error)
  } finally {
    loading.value = false
  }
}

const filteredDisputes = computed(() => {
  return disputes.value.filter(d => {
    if (activeTab.value === 'pending') {
      return d.status !== 'resolved'
    }
    return d.status === 'resolved'
  })
})

const pendingCount = computed(() => {
  return disputes.value.filter(d => d.status !== 'resolved').length
})

const getStatusLabel = (status) => {
  const labels = {
    open: 'Aberta',
    investigating: 'Investigando',
    resolved: 'Resolvida'
  }
  return labels[status] || status
}

const openResolveModal = (dispute) => {
  selectedDispute.value = dispute
  resolutionText.value = ''
  resolutionAction.value = 'no_action'
  showResolveModal.value = true
}

const resolveDispute = async () => {
  if (!resolutionText.value.trim()) {
    alert('Por favor, descreva a decisão final.')
    return
  }

  try {
    await axios.post(`/api/admin/disputes/${selectedDispute.value.id}/resolve`, {
      resolution: resolutionText.value,
      action: resolutionAction.value
    }, { withCredentials: true })
    
    alert('✅ Disputa resolvida com sucesso!')
    showResolveModal.value = false
    fetchDisputes()
  } catch (error) {
    alert('❌ Erro ao resolver disputa: ' + (error.response?.data?.error || error.message))
  }
}

const requestMoreInfo = async (dispute) => {
  const message = prompt('Descreva quais informações adicionais são necessárias:')
  if (message) {
    try {
      await axios.post(`/api/admin/disputes/${dispute.id}/request-info`, { message }, { withCredentials: true })
      alert('✅ Solicitação enviada às partes envolvidas.')
    } catch (error) {
      alert('❌ Erro ao enviar solicitação')
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchDisputes()
})
</script>
