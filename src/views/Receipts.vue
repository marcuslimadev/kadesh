<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading mb-2">📄 Comprovantes de Pagamento</h1>
        <p class="text-body">Gere comprovantes em PDF (modelo RPA) das suas transações</p>
      </div>

      <!-- Tabs -->
      <div class="bg-[#161821] rounded-lg shadow-lg mb-6 border border-[rgba(212,175,55,0.24)]">
        <nav class="flex">
          <button
            @click="activeTab = 'contracts'"
            :class="[
              'py-4 px-6 font-medium text-sm transition border-b-2',
              activeTab === 'contracts'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                : 'border-transparent text-body hover:text-heading hover:bg-[#1A1A1A]'
            ]"
          >
            Contratos Finalizados
          </button>
          <button
            @click="activeTab = 'transactions'"
            :class="[
              'py-4 px-6 font-medium text-sm transition border-b-2',
              activeTab === 'transactions'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                : 'border-transparent text-body hover:text-heading hover:bg-[#1A1A1A]'
            ]"
          >
            Transações de Carteira
          </button>
        </nav>
      </div>

      <!-- Contracts Tab -->
      <div v-if="activeTab === 'contracts'" class="space-y-4">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p class="mt-4 text-body">Carregando...</p>
        </div>

        <div v-else-if="contracts.length === 0" class="bg-[#161821] rounded-lg shadow-lg p-12 text-center border border-[rgba(212,175,55,0.24)]">
          <svg class="w-16 h-16 text-[#D4AF37] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-body">Nenhum contrato finalizado ainda</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="contract in contracts"
            :key="contract.id"
            class="bg-[#161821] rounded-lg shadow-lg p-6 hover:border-[#D4AF37] transition border border-[rgba(212,175,55,0.24)]"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-heading">{{ contract.project_title }}</h3>
                <p class="text-sm text-muted mt-1">Contrato #{{ contract.id }}</p>
                <p class="text-sm text-body">
                  {{ isClient ? 'Prestador' : 'Contratante' }}: {{ contract.other_party_name }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-[#22c55e]">
                  R$ {{ formatCurrency(contract.total_amount) }}
                </p>
                <p class="text-sm text-muted mt-1">
                  Finalizado em {{ formatDate(contract.completed_at) }}
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                @click="generateReceipt(contract, 'contract')"
                :disabled="generatingId === contract.id"
                class="px-4 py-2 bg-[#D4AF37] text-[#0F1117] font-semibold rounded-md hover:bg-[#E5C04A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="generatingId === contract.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ generatingId === contract.id ? 'Gerando...' : 'Gerar Comprovante PDF' }}
              </button>
              <button
                @click="viewContract(contract.id)"
                class="px-4 py-2 bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37] rounded-md hover:bg-[rgba(212,175,55,0.15)]"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-if="activeTab === 'transactions'" class="space-y-4">
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
          <p class="mt-4 text-body">Carregando...</p>
        </div>

        <div v-else-if="transactions.length === 0" class="bg-[#161821] rounded-lg shadow-lg p-12 text-center border border-[rgba(212,175,55,0.24)]">
          <svg class="w-16 h-16 text-[#D4AF37] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p class="text-body">Nenhuma transação registrada</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="transaction in transactions"
            :key="transaction.id"
            class="bg-[#161821] rounded-lg shadow-lg p-6 hover:border-[#D4AF37] transition border border-[rgba(212,175,55,0.24)]"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-heading">
                  {{ getTransactionTitle(transaction.type) }}
                </h3>
                <p class="text-sm text-muted mt-1">Transação #{{ transaction.id }}</p>
                <p class="text-sm text-body mt-2">{{ transaction.description }}</p>
              </div>
              <div class="text-right">
                <p :class="[
                  'text-2xl font-bold',
                  transaction.type === 'credit' || transaction.type === 'deposit' ? 'text-[#22c55e]' : 'text-[#ef4444]'
                ]">
                  {{ transaction.type === 'credit' || transaction.type === 'deposit' ? '+' : '-' }}
                  R$ {{ formatCurrency(transaction.amount) }}
                </p>
                <p class="text-sm text-muted mt-1">
                  {{ formatDate(transaction.created_at) }}
                </p>
              </div>
            </div>

            <button
              @click="generateReceipt(transaction, 'transaction')"
              :disabled="generatingId === transaction.id"
              class="px-4 py-2 bg-[#D4AF37] text-[#0F1117] font-semibold rounded-md hover:bg-[#E5C04A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="generatingId === transaction.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ generatingId === transaction.id ? 'Gerando...' : 'Gerar Comprovante PDF' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-8 bg-[rgba(212,175,55,0.1)] border border-[#D4AF37] rounded-lg p-6">
        <div class="flex gap-4">
          <svg class="w-6 h-6 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 class="font-semibold text-heading mb-2">📋 Modelo RPA (Recibo de Pagamento Autônomo)</h4>
            <p class="text-sm text-body mb-2">
              Os comprovantes gerados seguem o modelo RPA, ideal para prestadores de serviço autônomos.
            </p>
            <ul class="text-sm text-body space-y-1 list-disc list-inside">
              <li>Inclui dados completos: Contratante, Prestador, valor, data e descrição do serviço</li>
              <li>Útil para declaração de IR e contabilidade</li>
              <li>Para emissão de NF-e, entre em contato com o Contratante/Prestador via chat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import { useToast } from 'vue-toastification'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
// const toast = useToast()

const activeTab = ref('contracts')
const loading = ref(false)
const contracts = ref([])
const transactions = ref([])
const generatingId = ref(null)

const isClient = computed(() => authStore.user?.type === 'client')

const loadContracts = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/contracts', {
      params: { status: 'completed' }
    })
    contracts.value = response.data.contracts || response.data || []
  } catch (error) {
    console.error('Erro ao carregar contratos:', error)
    // toast.error('Erro ao carregar contratos')
  } finally {
    loading.value = false
  }
}

const loadTransactions = async () => {
  loading.value = true
  try {
    const response = await api.get('/api/wallet/transactions')
    transactions.value = response.data.transactions || response.data || []
  } catch (error) {
    console.error('Erro ao carregar transações:', error)
    // toast.error('Erro ao carregar transações')
  } finally {
    loading.value = false
  }
}

const generateReceipt = async (item, type) => {
  generatingId.value = item.id
  
  try {
    const endpoint = type === 'contract' 
      ? `/api/receipts/contract/${item.id}`
      : `/api/receipts/transaction/${item.id}`
    
    const response = await api.get(endpoint, {
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const filename = type === 'contract'
      ? `comprovante-contrato-${item.id}.pdf`
      : `comprovante-transacao-${item.id}.pdf`
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    // toast.success('Comprovante gerado com sucesso!')
  } catch (error) {
    console.error('Erro ao gerar comprovante:', error)
    // toast.error('Erro ao gerar comprovante. Tente novamente.')
  } finally {
    generatingId.value = null
  }
}

const viewContract = (contractId) => {
  router.push(`/contracts/${contractId}`)
}

const getTransactionTitle = (type) => {
  const types = {
    deposit: 'Depósito',
    withdrawal: 'Saque',
    credit: 'Crédito',
    debit: 'Débito',
    escrow_lock: 'Escrow Bloqueado',
    escrow_release: 'Escrow Liberado',
    escrow_refund: 'Escrow Reembolsado'
  }
  return types[type] || type
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

onMounted(() => {
  if (activeTab.value === 'contracts') {
    loadContracts()
  } else {
    loadTransactions()
  }
})

// Watch tab changes
const handleTabChange = () => {
  if (activeTab.value === 'contracts') {
    loadContracts()
  } else {
    loadTransactions()
  }
}

// Monitor activeTab changes
const unwatchTab = () => {
  if (activeTab.value === 'contracts' && contracts.value.length === 0) {
    loadContracts()
  } else if (activeTab.value === 'transactions' && transactions.value.length === 0) {
    loadTransactions()
  }
}

// Simple watcher
const previousTab = ref(activeTab.value)
const checkTabChange = () => {
  if (previousTab.value !== activeTab.value) {
    previousTab.value = activeTab.value
    handleTabChange()
  }
}

// Run check periodically
setInterval(checkTabChange, 100)
</script>




