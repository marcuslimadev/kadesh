<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Kaddesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/disputes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100" :class="{ 'bg-gray-100': $route.path === '/admin/disputes' }">Disputas</router-link>
              <router-link to="/admin/advertisements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Anúncios</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600 mr-4">{{ adminUser?.name }}</span>
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Disputas</h2>
          <p class="mt-2 text-gray-600">Acompanhe e resolva disputas de contratos</p>
        </div>
        <div class="flex items-center space-x-3">
          <select v-model="filters.status" @change="fetchDisputes" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Todas</option>
            <option value="open">Abertas</option>
            <option value="closed">Encerradas</option>
          </select>
          <button @click="fetchDisputes" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Atualizar</button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projeto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contratante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fornecedor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atualização</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="d in disputes" :key="d.contract_id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-900">{{ d.project_title }}</div>
                  <div class="text-xs text-gray-500">Contrato #{{ d.contract_id }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ d.client_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ d.provider_name }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">R$ {{ formatCurrency(d.amount) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDateTime(d.last_activity) }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="d.is_closed ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'">
                    {{ d.is_closed ? 'Encerrada' : 'Aberta' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <button @click="viewDetails(d.contract_id)" class="text-blue-600 hover:text-blue-800">Ver/Resolver</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="disputes.length === 0" class="text-center py-12 text-gray-500">Nenhuma disputa encontrada.</div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Detalhes da Disputa</h3>
            <p class="text-sm text-gray-600">Contrato #{{ disputeDetail?.contract?.id }} — {{ disputeDetail?.contract?.project_title }}</p>
          </div>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div v-if="detailLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xs text-gray-500 mb-1">Contratante</div>
              <div class="font-medium text-gray-900">{{ disputeDetail?.contract?.client_name }} <span class="text-xs text-gray-500">({{ disputeDetail?.contract?.client_email }})</span></div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-xs text-gray-500 mb-1">Fornecedor</div>
              <div class="font-medium text-gray-900">{{ disputeDetail?.contract?.provider_name }} <span class="text-xs text-gray-500">({{ disputeDetail?.contract?.provider_email }})</span></div>
            </div>
          </div>

          <div class="mb-4">
            <div class="text-sm font-semibold text-gray-800 mb-2">Mensagens de Disputa</div>
            <div class="space-y-2 max-h-60 overflow-auto">
              <div v-for="m in disputeDetail?.disputeMessages || []" :key="m.id" class="p-3 bg-gray-50 rounded border border-gray-100">
                <div class="text-xs text-gray-500">{{ formatDateTime(m.created_at) }}</div>
                <div class="text-sm text-gray-800 whitespace-pre-wrap">{{ m.content }}</div>
              </div>
            </div>
          </div>

          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
            <textarea v-model="resolutionNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-2">
            <button @click="resolve('dismiss')" :disabled="resolving" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50">Arquivar</button>
            <button @click="resolve('refund')" :disabled="resolving" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">Reembolsar</button>
            <button @click="resolve('release')" :disabled="resolving" class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">Liberar Pagamento</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const disputes = ref([])
const filters = ref({ status: '' })
const adminUser = ref(null)

const showModal = ref(false)
const detailLoading = ref(false)
const disputeDetail = ref(null)
const resolutionNotes = ref('')
const resolving = ref(false)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)
}

const formatDateTime = (date) => {
  const d = new Date(date)
  return d.toLocaleString('pt-BR')
}

const fetchDisputes = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('adminToken')
    const params = {}
    if (filters.value.status) params.status = filters.value.status
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/disputes`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })
    if (data.success) {
      disputes.value = data.data
    }
  } catch (error) {
    console.error('Error fetching disputes:', error)
    if (error.response?.status === 401) router.push('/admin/login')
    toast.error('Erro ao carregar disputas')
  } finally {
    loading.value = false
  }
}

const viewDetails = async (contractId) => {
  try {
    showModal.value = true
    detailLoading.value = true
    resolutionNotes.value = ''
    const token = localStorage.getItem('adminToken')
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/disputes/${contractId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (data.success) {
      disputeDetail.value = data.data
    }
  } catch (error) {
    console.error('Error fetching dispute detail:', error)
    toast.error('Erro ao carregar detalhes')
  } finally {
    detailLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  disputeDetail.value = null
}

const resolve = async (action) => {
  if (!disputeDetail.value?.contract?.id) return
  try {
    resolving.value = true
    const token = localStorage.getItem('adminToken')
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/disputes/${disputeDetail.value.contract.id}/resolve`,
      { action, notes: resolutionNotes.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    toast.success('Disputa resolvida com sucesso')
    closeModal()
    fetchDisputes()
  } catch (error) {
    console.error('Error resolving dispute:', error)
    toast.error(error.response?.data?.error || 'Erro ao resolver disputa')
  } finally {
    resolving.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  const storedAdmin = localStorage.getItem('adminUser')
  if (storedAdmin) adminUser.value = JSON.parse(storedAdmin)
  fetchDisputes()
})
</script>
