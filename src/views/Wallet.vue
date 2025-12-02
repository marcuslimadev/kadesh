<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading">Carteira</h1>
        <p class="mt-2 text-body">Gerencie seus fundos e transações</p>
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

        <div class="bg-surface rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-body">Em Escrow</h3>
            <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-heading">{{ formatCurrency(balance.escrow) }}</p>
          <p class="mt-2 text-sm text-gray-500">Bloqueado em projetos</p>
        </div>

        <div class="bg-surface rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-body">Pendente</h3>
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold text-heading">{{ formatCurrency(balance.pending) }}</p>
          <p class="mt-2 text-sm text-gray-500">Aguardando confirmação</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-surface rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold text-heading mb-4">Ações Rápidas</h2>
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
            class="flex items-center justify-center px-6 py-3 bg-surface border-2 border-gray-300 text-body rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Sacar Fundos
          </button>
        </div>
        <div
          v-if="hasPendingDeposits"
          class="mt-6 bg-blue-50/80 border border-blue-100 rounded-2xl p-4"
        >
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Pagamentos aguardando confirmação</p>
              <p class="text-sm text-blue-900/80">Assim que o Mercado Pago aprovar, o valor aparecerá automaticamente no saldo.</p>
            </div>
            <button
              type="button"
              class="text-sm font-medium text-blue-700 hover:text-blue-900"
              @click="loadPendingDeposits"
            >
              Atualizar status
            </button>
          </div>
          <div class="mt-4 space-y-3">
            <div
              v-for="intent in pendingDeposits"
              :key="intent.id"
              class="bg-surface border border-blue-100 rounded-xl p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p class="text-base font-semibold text-heading">
                  {{ formatCurrency(intent.amount) }} • {{ formatDate(intent.created_at) }}
                </p>
                <p class="text-sm text-body">
                  Preferência #{{ intent.preference_id?.slice(-6) || intent.id.slice(0, 6) }} · Método: Mercado Pago
                </p>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  @click="openCheckoutLink(intent.checkout_url)"
                >
                  Reabrir checkout
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
                  @click="copyCheckoutLink(intent.checkout_url)"
                >
                  Copiar link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-surface rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold text-heading mb-4">Histórico de Transações</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-body mb-2">Tipo</label>
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
              <option value="payment_received">Pagamento Recebido</option>
              <option value="payment_sent">Pagamento Enviado</option>
              <option value="refund">Reembolso</option>
              <option value="fee">Taxa</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-body mb-2">Status</label>
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
            <label class="block text-sm font-medium text-body mb-2">Ordenar Por</label>
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
        <p class="mt-4 text-body">Carregando transações...</p>
      </div>

      <div v-else-if="error" class="bg-surface rounded-lg shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Erro ao carregar transações</h3>
        <p class="mt-2 text-sm text-body">{{ error }}</p>
        <button
          @click="loadTransactions"
          class="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredTransactions.length === 0" class="bg-surface rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Nenhuma transação encontrada</h3>
        <p class="mt-2 text-sm text-body">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você ainda não possui transações.' }}
        </p>
      </div>

      <div v-else class="bg-surface rounded-lg shadow overflow-hidden">
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
            <tbody class="bg-surface divide-y divide-gray-200">
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-heading">
                  {{ formatDate(transaction.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeColor(transaction.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getTypeLabel(transaction.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-heading">
                  {{ transaction.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold" :class="getAmountColor(transaction)">
                  {{ getAmountPrefix(transaction) }}{{ formatCurrency(Math.abs(transaction.amount)) }}
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

      <!-- Deposit Modal -->
      <div
        v-if="showDepositModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        @click.self="closeDepositModal"
      >
        <div class="bg-surface rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-sm font-medium text-primary-600 uppercase tracking-wide">Adicionar fundos</p>
              <h3 class="text-2xl font-semibold text-heading">Checkout seguro Mercado Pago</h3>
              <p class="text-sm text-gray-500 mt-1">PIX, boleto ou cartão em um único fluxo. O saldo é liberado automaticamente após a aprovação.</p>
            </div>
            <button @click="closeDepositModal" class="text-gray-400 hover:text-body">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleDeposit" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-body">Valor</label>
              <div class="relative mt-1">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                <input
                  v-model.number="depositForm.amount"
                  type="number"
                  min="10"
                  step="0.01"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0,00"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Valor mínimo de R$ 10,00</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-body mb-1">Método de pagamento</label>
              <select
                v-model="depositForm.method"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                disabled
              >
                <option v-for="method in depositMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Integração oficial com autenticação de webhook.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-body mb-1">Descrição (opcional)</label>
              <input
                v-model="depositForm.description"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex.: Depósito para projeto Landing Page"
              />
              <p class="mt-1 text-xs text-gray-500">Esse texto aparece no comprovante interno da Kaddesh.</p>
            </div>

            <p v-if="depositError" class="text-sm text-red-600">{{ depositError }}</p>

            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-body hover:bg-gray-50"
                @click="closeDepositModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isDepositing"
                class="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="isDepositing" class="flex items-center justify-center">
                  <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2" />
                  </svg>
                  Processando...
                </span>
                <span v-else>Ir para o Mercado Pago</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Withdraw Modal -->
      <div
        v-if="showWithdrawModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        @click.self="closeWithdrawModal"
      >
        <div class="bg-surface rounded-2xl shadow-xl p-8 max-w-lg w-full">
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-sm font-medium text-primary-600 uppercase tracking-wide">Solicitar saque</p>
              <h3 class="text-2xl font-semibold text-heading">Transferir fundos</h3>
            </div>
            <button @click="closeWithdrawModal" class="text-gray-400 hover:text-body">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleWithdraw" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-body">Valor</label>
              <div class="relative mt-1">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R$</span>
                <input
                  v-model.number="withdrawForm.amount"
                  type="number"
                  min="50"
                  step="0.01"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0,00"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Disponível para saque: <span class="font-semibold text-heading">{{ formatCurrency(balance.available) }}</span>
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-body mb-1">Método</label>
              <select
                v-model="withdrawForm.method"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option v-for="method in withdrawMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-body mb-1">Instruções ou chave PIX</label>
              <textarea
                v-model="withdrawForm.notes"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Informe a chave PIX ou dados bancários para transferência"
              ></textarea>
            </div>

            <p v-if="withdrawError" class="text-sm text-red-600">{{ withdrawError }}</p>

            <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                class="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-body hover:bg-gray-50"
                @click="closeWithdrawModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isWithdrawing"
                class="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="isWithdrawing" class="flex items-center justify-center">
                  <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2" />
                  </svg>
                  Registrando...
                </span>
                <span v-else>Confirmar Saque</span>
              </button>
            </div>
          </form>
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
// import { useToast } from 'vue-toastification'

// const toast = useToast()

const transactions = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 20
const showDepositModal = ref(false)
const showWithdrawModal = ref(false)
const isDepositing = ref(false)
const isWithdrawing = ref(false)
const depositError = ref('')
const withdrawError = ref('')
const depositForm = ref({
  amount: '',
  method: 'mercadopago',
  description: ''
})
const withdrawForm = ref({
  amount: '',
  method: 'pix',
  notes: ''
})

const depositMethods = [
  { value: 'mercadopago', label: 'Mercado Pago (PIX, cartão, boleto)' }
]

const withdrawMethods = [
  { value: 'pix', label: 'PIX' },
  { value: 'bank_transfer', label: 'Transferência bancária (TED/DOC)' }
]

const defaultBalance = {
  available: 0,
  escrow: 0,
  pending: 0,
  total: 0
}

const balance = ref({ ...defaultBalance })
const pendingDeposits = ref([])

const filters = ref({
  type: '',
  status: '',
  sortBy: 'date_desc'
})

const transactionTypeLabels = {
  deposit: 'Depósito',
  withdrawal: 'Saque',
  escrow_hold: 'Bloqueio (Escrow)',
  escrow_release: 'Liberação (Escrow)',
  payment: 'Pagamento',
  payment_received: 'Pagamento Recebido',
  payment_sent: 'Pagamento Enviado',
  refund: 'Reembolso',
  fee: 'Taxa da Plataforma'
}

const transactionTypeColors = {
  deposit: 'bg-green-100 text-green-800',
  withdrawal: 'bg-red-100 text-red-800',
  escrow_hold: 'bg-yellow-100 text-yellow-800',
  escrow_release: 'bg-blue-100 text-blue-800',
  payment: 'bg-purple-100 text-purple-800',
  payment_received: 'bg-emerald-100 text-emerald-800',
  payment_sent: 'bg-purple-100 text-purple-800',
  refund: 'bg-emerald-100 text-emerald-800',
  fee: 'bg-gray-100 text-gray-800'
}

const hasActiveFilters = computed(() => {
  return filters.value.type !== '' || filters.value.status !== ''
})

const hasPendingDeposits = computed(() => pendingDeposits.value.length > 0)

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
  return transactionTypeLabels[type] || type
}

const getTypeColor = (type) => {
  return transactionTypeColors[type] || 'bg-gray-100 text-gray-800'
}

const getAmountColor = (transaction) => {
  const amount = Number(transaction?.amount || 0)
  if (amount === 0) return 'text-body'
  return amount > 0 ? 'text-green-600' : 'text-red-600'
}

const getAmountPrefix = (transaction) => {
  const amount = Number(transaction?.amount || 0)
  return amount >= 0 ? '+ ' : '- '
}

const normalizeTransactions = (items = []) => {
  return items.map(item => {
    const amount = Number(item.amount || 0)
    return {
      ...item,
      amount,
      description: item.description || getTypeLabel(item.type)
    }
  })
}

const resetDepositForm = () => {
  depositForm.value = {
    amount: '',
    method: 'mercadopago',
    description: ''
  }
  depositError.value = ''
}

const resetWithdrawForm = () => {
  withdrawForm.value = {
    amount: '',
    method: 'pix',
    notes: ''
  }
  withdrawError.value = ''
}

const closeDepositModal = () => {
  showDepositModal.value = false
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
}

const clearFilters = () => {
  filters.value = {
    type: '',
    status: '',
    sortBy: 'date_desc'
  }
  currentPage.value = 1
}

const handleDeposit = async () => {
  depositError.value = ''
  const amountValue = Math.abs(Number(depositForm.value.amount))

  if (!amountValue || amountValue < 10) {
    depositError.value = 'Informe um valor mínimo de R$ 10,00'
    return
  }

  if (depositForm.value.method !== 'mercadopago') {
    depositError.value = 'Atualmente apenas o Mercado Pago está disponível'
    return
  }

  isDepositing.value = true
  try {
    const result = await walletService.deposit(
      amountValue,
      depositForm.value.method,
      depositForm.value.description
    )

    if (result.success) {
      const checkoutUrl = result.data?.data?.checkout_url
    // toast.success('Checkout seguro criado! Finalize o pagamento no Mercado Pago.')
      closeDepositModal()
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank', 'noopener')
      }
      await loadPendingDeposits()
    } else {
      depositError.value = result.error || 'Erro ao criar checkout'
    }
  } catch (err) {
    console.error('Error creating deposit:', err)
    depositError.value = 'Erro ao criar checkout'
  } finally {
    isDepositing.value = false
  }
}

const handleWithdraw = async () => {
  withdrawError.value = ''
  const amountValue = Math.abs(Number(withdrawForm.value.amount))

  if (!amountValue || amountValue < 50) {
    withdrawError.value = 'Informe um valor mínimo de R$ 50,00'
    return
  }

  if (amountValue > Number(balance.value.available || 0)) {
    withdrawError.value = 'Valor superior ao saldo disponível'
    return
  }

  isWithdrawing.value = true
  try {
    const result = await walletService.withdraw(
      amountValue,
      withdrawForm.value.method,
      withdrawForm.value.notes
    )

    if (result.success) {
    // toast.success('Solicitação de saque registrada!')
      closeWithdrawModal()
      await loadTransactions()
    } else {
      withdrawError.value = result.error || 'Erro ao solicitar saque'
    }
  } catch (err) {
    console.error('Error creating withdraw:', err)
    withdrawError.value = 'Erro ao solicitar saque'
  } finally {
    isWithdrawing.value = false
  }
}

const loadPendingDeposits = async () => {
  try {
    const result = await walletService.getPaymentIntents({
      type: 'wallet_deposit',
      status: 'pending',
      limit: 5
    })

    if (result.success) {
      pendingDeposits.value = result.data?.data?.intents || []
    }
  } catch (error) {
    console.error('Error loading pending deposits:', error)
  }
}

const openCheckoutLink = (url) => {
  if (!url) {
    // toast.error('Link de checkout indisponível')
    return
  }
  window.open(url, '_blank', 'noopener')
}

const copyCheckoutLink = async (url) => {
  if (!url) {
    // toast.error('Link não encontrado')
    return
  }

  try {
    await navigator.clipboard.writeText(url)
    // toast.success('Link copiado!')
  } catch (error) {
    console.error('Clipboard error:', error)
    // toast.error('Não foi possível copiar o link')
  }
}

const loadTransactions = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Load balance
    const balanceResult = await walletService.getBalance()
    if (balanceResult.success) {
      balance.value = {
        ...defaultBalance,
        ...(balanceResult.data?.data || {})
      }
    }

    // Load transactions
    const result = await walletService.getTransactions({
      type: filters.value.type,
      status: filters.value.status,
      limit: 200,
      sort: 'desc'
    })

    if (result.success) {
      const items = result.data?.data?.transactions || []
      transactions.value = normalizeTransactions(items)
    } else {
      error.value = result.error
      transactions.value = []
    }

    await loadPendingDeposits()
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

watch(showDepositModal, (visible) => {
  if (!visible) {
    resetDepositForm()
  }
})

watch(showWithdrawModal, (visible) => {
  if (!visible) {
    resetWithdrawForm()
  }
})

onMounted(() => {
  loadTransactions()
})
</script>
