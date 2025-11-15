<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Carteira</h1>
        <p class="mt-2 text-gray-600">Gerencie seus fundos e transações</p>
      </div>

      <!-- Balance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium opacity-90">Saldo Disponível</h3>
            <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-4xl font-bold">{{ formatCurrency(balance.available) }}</p>
          <p class="mt-2 text-sm opacity-75">Pronto para saque</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-700">Em Escrow</h3>
            <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(balance.escrow) }}</p>
          <p class="mt-2 text-sm text-gray-500">Bloqueado em projetos</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-700">Pendente</h3>
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(balance.pending) }}</p>
          <p class="mt-2 text-sm text-gray-500">Aguardando confirmação</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            @click="showDepositModal = true"
            class="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Fundos
          </button>
          <button
            @click="showWithdrawModal = true"
            :disabled="balance.available <= 0"
            class="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Sacar Fundos
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Histórico de Transações</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="deposit">Depósito</option>
              <option value="withdrawal">Saque</option>
              <option value="escrow_hold">Bloqueio (Escrow)</option>
              <option value="escrow_release">Liberação (Escrow)</option>
              <option value="payment">Pagamento</option>
              <option value="refund">Reembolso</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar Por</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date_desc">Mais Recentes</option>
              <option value="date_asc">Mais Antigas</option>
              <option value="amount_desc">Maior Valor</option>
              <option value="amount_asc">Menor Valor</option>
            </select>
          </div>
        </div>
        
        <div v-if="hasActiveFilters" class="mt-4">
          <button
            @click="clearFilters"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Transactions List -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Carregando transações...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-lg shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Erro ao carregar transações</h3>
        <p class="mt-2 text-sm text-gray-600">{{ error }}</p>
        <button
          @click="loadTransactions"
          class="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma transação encontrada</h3>
        <p class="mt-2 text-sm text-gray-600">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você ainda não possui transações.' }}
        </p>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeColor(transaction.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getTypeLabel(transaction.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ transaction.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="getAmountColor(transaction.type)">
                  {{ getAmountPrefix(transaction.type) }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="transaction.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>

      <!-- Modals Placeholder -->
      <div v-if="showDepositModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showDepositModal = false">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-xl font-semibold mb-4">Adicionar Fundos</h3>
          <p class="text-gray-600 mb-6">Funcionalidade de depósito será implementada na Fase 2</p>
          <button
            @click="showDepositModal = false"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Fechar
          </button>
        </div>
      </div>

      <div v-if="showWithdrawModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showWithdrawModal = false">
        <div class="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 class="text-xl font-semibold mb-4">Sacar Fundos</h3>
          <p class="text-gray-600 mb-6">Funcionalidade de saque será implementada na Fase 2</p>
          <button
            @click="showWithdrawModal = false"
            class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Pagination from '@/components/ui/Pagination.vue'
import walletService from '@/services/walletService'
import { useToast } from 'vue-toastification'

const toast = useToast()

const transactions = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 20
const showDepositModal = ref(false)
const showWithdrawModal = ref(false)

const balance = ref({
  available: 0,
  escrow: 0,
  pending: 0
})

const filters = ref({
  type: '',
  status: '',
  sortBy: 'date_desc'
})

const hasActiveFilters = computed(() => {
  return filters.value.type !== '' || filters.value.status !== ''
})

const filteredTransactions = computed(() => {
  let result = [...transactions.value]
  
  // Apply filters
  if (filters.value.type) {
    result = result.filter(t => t.type === filters.value.type)
  }
  
  if (filters.value.status) {
    result = result.filter(t => t.status === filters.value.status)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'date_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'date_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'amount_desc':
        return Math.abs(b.amount) - Math.abs(a.amount)
      case 'amount_asc':
        return Math.abs(a.amount) - Math.abs(b.amount)
      default:
        return 0
    }
  })
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = [...transactions.value]
  
  if (filters.value.type) {
    result = result.filter(t => t.type === filters.value.type)
  }
  
  if (filters.value.status) {
    result = result.filter(t => t.status === filters.value.status)
  }
  
  return Math.ceil(result.length / itemsPerPage)
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getTypeLabel = (type) => {
  const types = {
    deposit: 'Depósito',
    withdrawal: 'Saque',
    escrow_hold: 'Bloqueio',
    escrow_release: 'Liberação',
    payment: 'Pagamento',
    refund: 'Reembolso'
  }
  return types[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    deposit: 'bg-green-100 text-green-800',
    withdrawal: 'bg-red-100 text-red-800',
    escrow_hold: 'bg-yellow-100 text-yellow-800',
    escrow_release: 'bg-blue-100 text-blue-800',
    payment: 'bg-purple-100 text-purple-800',
    refund: 'bg-gray-100 text-gray-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getAmountColor = (type) => {
  if (type === 'deposit' || type === 'escrow_release' || type === 'refund') {
    return 'text-green-600'
  }
  return 'text-red-600'
}

const getAmountPrefix = (type) => {
  if (type === 'deposit' || type === 'escrow_release' || type === 'refund') {
    return '+ '
  }
  return '- '
}

const clearFilters = () => {
  filters.value = {
    type: '',
    status: '',
    sortBy: 'date_desc'
  }
  currentPage.value = 1
}

const loadTransactions = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Load balance
    const balanceResult = await walletService.getBalance()
    if (balanceResult.success) {
      balance.value = balanceResult.data.data || {
        available: 0,
        escrow: 0,
        pending: 0
      }
    }

    // Load transactions
    const result = await walletService.getTransactions({
      type: filters.value.type,
      status: filters.value.status,
      limit: 100 // Load all for client-side filtering
    })
    
    if (result.success) {
      transactions.value = result.data.data?.transactions || []
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading wallet data:', err)
    error.value = 'Erro ao carregar dados da carteira'
  } finally {
    isLoading.value = false
  }
}

// Reset to page 1 when filters change
watch(() => [filters.value.type, filters.value.status], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadTransactions()
})
</script>
