<template>
  <div class="min-h-screen bg-primary-50">
    <!-- Header -->
    <div class="bg-primary-500 text-white shadow-primary">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/admin/dashboard" class="text-white/80 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </router-link>
            <h1 class="text-3xl font-semibold">💳 Gestão Financeira</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <!-- Resumo Financeiro -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded shadow-primary p-6">
          <div class="text-sm text-secondary-600 font-bold mb-2"> Total Transacionado</div>
          <div class="text-3xl font-semibold text-primary-900">R$ {{ formatMoney(summary.total_amount) }}</div>
        </div>
        <div class="bg-white rounded shadow-primary p-6">
          <div class="text-sm text-secondary-600 font-bold mb-2">💸 Taxa Plataforma (10%)</div>
          <div class="text-3xl font-semibold text-primary-900">R$ {{ formatMoney(summary.platform_fee) }}</div>
        </div>
        <div class="bg-white rounded shadow-primary p-6">
          <div class="text-sm text-secondary-600 font-bold mb-2"> Transações</div>
          <div class="text-3xl font-semibold text-primary-900">{{ payments.length }}</div>
        </div>
        <div class="bg-white rounded shadow-primary p-6">
          <div class="text-sm text-secondary-600 font-bold mb-2"> Completas</div>
          <div class="text-3xl font-semibold text-green-600">{{ summary.completed_count }}</div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded shadow-primary p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-bold text-secondary-700 mb-2">📅 Data Inicial</label>
            <input
              v-model="filters.start_date"
              @change="loadPayments"
              type="date"
              class="w-full px-4 py-2 border-2 border-neutral-200 rounded focus:border-primary-300 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-secondary-700 mb-2">📅 Data Final</label>
            <input
              v-model="filters.end_date"
              @change="loadPayments"
              type="date"
              class="w-full px-4 py-2 border-2 border-neutral-200 rounded focus:border-primary-300 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-secondary-700 mb-2"> Status</label>
            <select
              v-model="filters.status"
              @change="loadPayments"
              class="w-full px-4 py-2 border-2 border-neutral-200 rounded focus:border-primary-300 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="completed">Completo</option>
              <option value="failed">Falhou</option>
              <option value="refunded">Reembolsado</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="exportData"
              class="w-full bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded font-bold transition-colors flex items-center justify-center gap-2"
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="w-16 h-16 border-8 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-secondary-600 font-bold">Carregando transações...</p>
      </div>

      <!-- Lista de Transações -->
      <div v-else class="bg-white rounded shadow-primary overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-primary-500 text-white">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold">ID</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Data</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Projeto</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Usuário</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Valor</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Taxa (10%)</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Status</th>
                <th class="px-6 py-4 text-left text-sm font-bold">Método</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr
                v-for="payment in payments"
                :key="payment.id"
                class="hover:bg-primary-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-mono text-secondary-600">#{{ payment.id }}</td>
                <td class="px-6 py-4 text-sm text-primary-900">{{ formatDateTime(payment.created_at) }}</td>
                <td class="px-6 py-4 text-sm">
                  <router-link :to="`/projects/${payment.project_id}`" class="text-primary-600 hover:text-primary-700 font-semibold">
                    {{ payment.project_title || `Projeto #${payment.project_id}` }}
                  </router-link>
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="font-semibold text-primary-900">{{ payment.user_name }}</div>
                  <div class="text-secondary-500 text-xs">{{ payment.user_email }}</div>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary-900">
                  R$ {{ formatMoney(payment.amount) }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary-900">
                  R$ {{ formatMoney(payment.amount * 0.10) }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span :class="getStatusBadge(payment.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                    {{ getStatusLabel(payment.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-secondary-600">
                  {{ payment.payment_method || 'Mercado Pago' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="payments.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">💳</div>
          <p class="text-xl text-secondary-600 font-bold">Nenhuma transação encontrada</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const payments = ref([])
const loading = ref(true)
const filters = ref({
  start_date: '',
  end_date: '',
  status: ''
})

const summary = computed(() => {
  const total = payments.value.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  const completed = payments.value.filter(p => p.status === 'completed')
  
  return {
    total_amount: total,
    platform_fee: total * 0.10,
    completed_count: completed.length
  }
})

const getStatusBadge = (status) => {
  const badges = {
    'pending': 'bg-neutral-600 text-yellow-700',
    'completed': 'bg-neutral-800 text-neutral-900',
    'failed': 'bg-neutral-600 text-red-700',
    'refunded': 'bg-neutral-700 text-neutral-900'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': '⏳ Pendente',
    'completed': ' Completo',
    'failed': ' Falhou',
    'refunded': '🔄 Reembolsado'
  }
  return labels[status] || status
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)
}

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadPayments = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)
    if (filters.value.status) params.append('status', filters.value.status)

    const response = await axios.get(`/kadesh/api/admin/payments?${params}`)
    payments.value = response.data
  } catch (error) {
    console.error('Erro ao carregar pagamentos:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

const exportData = () => {
  // Criar CSV
  const headers = ['ID', 'Data', 'Projeto', 'Usuário', 'Email', 'Valor', 'Taxa', 'Status', 'Método']
  const rows = payments.value.map(p => [
    p.id,
    formatDateTime(p.created_at),
    p.project_title || `Projeto #${p.project_id}`,
    p.user_name,
    p.user_email,
    formatMoney(p.amount),
    formatMoney(p.amount * 0.10),
    p.status,
    p.payment_method || 'Mercado Pago'
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

onMounted(() => {
  if (!localStorage.getItem('isAdmin')) {
    router.push('/admin/login')
    return
  }
  loadPayments()
})
</script>




