<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <router-link to="/contracts" class="text-sm text-gray-600 hover:text-gray-900">← Voltar</router-link>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">Contrato #{{ contract?.id }}</h1>
        <p class="text-gray-600">{{ contract?.project_title }}</p>
      </div>

      <div v-if="loading" class="bg-white rounded-lg p-12 text-center shadow-sm">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <p class="mt-3 text-gray-600">Carregando contrato...</p>
      </div>

      <div v-else-if="!contract" class="bg-white rounded-lg p-10 text-center shadow-sm">
        <p class="text-gray-600">Contrato não encontrado.</p>
      </div>

      <div v-else class="space-y-6">
        <section class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Contratante</p>
              <p class="font-medium text-gray-900">{{ contract.client_name }} ({{ contract.client_email }})</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Fornecedor</p>
              <p class="font-medium text-gray-900">{{ contract.provider_name }} ({{ contract.provider_email }})</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <p class="font-medium text-gray-900">{{ formatStatus(contract.status) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Criado em</p>
              <p class="font-medium text-gray-900">{{ formatDate(contract.created_at) }}</p>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações</h2>
          <div class="flex flex-wrap gap-3">
            <button
              v-if="canMarkComplete"
              @click="markComplete"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              :disabled="actionLoading"
            >
              {{ actionLoading ? 'Enviando...' : 'Marcar como completo' }}
            </button>
            <button
              v-if="canAcceptCompletion"
              @click="acceptCompletion"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              :disabled="actionLoading"
            >
              {{ actionLoading ? 'Confirmando...' : 'Aceitar entrega' }}
            </button>
            <button
              v-if="canDispute"
              @click="openDispute"
              class="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              Abrir disputa
            </button>
            <button
              v-if="canCancel"
              @click="cancelContract"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Cancelar contrato
            </button>
          </div>
        </section>

        <!-- Chat -->
        <section class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <ChatBox :contract-id="contract.id" />
        </section>

        <!-- Milestones Section -->
        <section v-if="['in_progress', 'completed', 'accepted'].includes(contract.status)">
          <MilestoneList
            :contract-id="contract.id"
            :client-id="contract.client_id"
            :provider-id="contract.provider_id"
          />
        </section>

        <section v-if="contract.status === 'accepted'" class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Avaliar parceiro</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700">Nota:</label>
              <select v-model.number="review.rating" class="px-3 py-2 border rounded-lg">
                <option :value="n" v-for="n in 5" :key="n">{{ n }}</option>
              </select>
            </div>
            <textarea v-model="review.comment" rows="3" placeholder="Comentário (opcional)" class="w-full px-4 py-2 border rounded-lg"></textarea>
            <button @click="submitReview" class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700" :disabled="reviewLoading">
              {{ reviewLoading ? 'Enviando...' : 'Enviar avaliação' }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'
// import { useToast } from 'vue-toastification'
import MilestoneList from '@/components/milestone/MilestoneList.vue'
import ChatBox from '@/components/chat/ChatBox.vue'

const route = useRoute()
const router = useRouter()
// const toast = useToast()
const auth = useAuthStore()

const id = route.params.id
const loading = ref(true)
const actionLoading = ref(false)
const reviewLoading = ref(false)
const contract = ref(null)

const review = ref({ rating: 5, comment: '' })

const canMarkComplete = computed(() => auth.user?.id === contract.value?.provider_id && contract.value?.status === 'in_progress')
const canAcceptCompletion = computed(() => auth.user?.id === contract.value?.client_id && contract.value?.status === 'completed')
const canDispute = computed(() => ['in_progress','completed'].includes(contract.value?.status))
const canCancel = computed(() => contract.value?.status === 'in_progress')

function formatDate(v){ return v ? new Date(v).toLocaleDateString('pt-BR') : '-' }
function formatStatus(s){ const m={in_progress:'Em andamento',completed:'Concluído',cancelled:'Cancelado'};return m[s]||s }

async function fetchContract(){
  loading.value = true
  try {
    const { data } = await api.get(`/api/contracts/${id}`)
    contract.value = data?.data
  } catch(e){
    contract.value = null
  } finally {
    loading.value = false
  }
}

async function markComplete(){
  actionLoading.value = true
  try {
    await api.put(`/api/contracts/${id}/mark-complete`)
    // toast.success('Contrato marcado como completo')
    fetchContract()
  } catch(e){
    // toast.error('Erro ao marcar como completo')
  } finally {
    actionLoading.value = false
  }
}

async function acceptCompletion(){
  actionLoading.value = true
  try {
    await api.put(`/api/contracts/${id}/accept-completion`)
    // toast.success('Entrega aceita, pagamento será liberado')
    fetchContract()
  } catch(e){
    // toast.error('Erro ao aceitar entrega')
  } finally {
    actionLoading.value = false
  }
}

async function openDispute(){
  const reason = prompt('Descreva o motivo da disputa:')
  if (!reason) return
  try {
    await api.put(`/api/contracts/${id}/dispute`, { reason })
    // toast.success('Disputa registrada')
    fetchContract()
  } catch(e){
    // toast.error('Erro ao abrir disputa')
  }
}

async function cancelContract(){
  const reason = prompt('Confirme o motivo do cancelamento:')
  if (!reason) return
  try {
    await api.put(`/api/contracts/${id}/cancel`, { reason })
    // toast.success('Contrato cancelado')
    router.push({ name: 'contracts' })
  } catch(e){
    // toast.error('Erro ao cancelar')
  }
}

async function submitReview(){
  reviewLoading.value = true
  try {
    const reviewedUserId = auth.user?.id === contract.value.client_id ? contract.value.provider_id : contract.value.client_id
    await api.post('/api/reviews', {
      contract_id: contract.value.id,
      reviewed_user_id: reviewedUserId,
      rating: review.value.rating,
      comment: review.value.comment
    })
    // toast.success('Avaliação enviada')
  } catch(e){
    if (e?.response?.status === 409) {
    // toast.info('Você já avaliou este contrato')
    } else {
    // toast.error('Erro ao enviar avaliação')
    }
  } finally {
    reviewLoading.value = false
  }
}

onMounted(fetchContract)
</script>
