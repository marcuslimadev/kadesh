<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-amber-600">Kaddesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/disputes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Disputas</router-link>
              <router-link to="/admin/advertisements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Anúncios</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Gerenciar Pagamentos</h2>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              v-model="filters.search"
              @input="fetchPayments"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Pagador, recebedor ou contrato..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" @change="fetchPayments" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="completed">Concluido</option>
              <option value="failed">Falhou</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
          <p class="mt-4 text-gray-600">Carregando pagamentos...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagador</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recebedor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payment in payments" :key="payment.id">
                <td class="px-6 py-4 text-sm text-gray-600">{{ payment.contract_id || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ payment.payer_name || payment.payer_email || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ payment.receiver_name || payment.receiver_email || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatCurrency(payment.amount) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatCurrency(payment.platform_fee) }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(payment.status)">
                    {{ getStatusLabel(payment.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(payment.created_at) }}</td>
              </tr>
            </tbody>
          </table>

          <div v-if="payments.length === 0" class="text-center py-12 text-gray-500">
            Nenhum pagamento encontrado
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
// import { useToast } from 'vue-toastification'

const router = useRouter()
// const toast = useToast()

const loading = ref(true)
const payments = ref([])
const filters = ref({ search: '', status: '' })

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('kadesh_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchPayments = async () => {
  try {
    loading.value = true
    const params = {
      search: filters.value.search,
      status: filters.value.status
    }
    const response = await api.get('/api/admin/payments', { params, headers: getAuthHeaders() })
    if (response.data.success) {
      payments.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = { search: '', status: '' }
  fetchPayments()
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    completed: 'Concluido',
    failed: 'Falhou',
    refunded: 'Reembolsado'
  }
  return labels[status] || status || '-'
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
    // toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  fetchPayments()
})
</script>
