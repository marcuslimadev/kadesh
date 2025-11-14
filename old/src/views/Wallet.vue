<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <LoadingScreen v-if="loading && !balance" message="Carregando carteira..." icon="💰" />
    
    <main v-else class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-6">💰 Minha Carteira</h1>

      <!-- Layout 2 Colunas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- COLUNA ESQUERDA: Saldo + Forms (1/3) -->
        <div class="space-y-6">
          
          <!-- Card de Saldo -->
          <div class="card bg-gradient-to-br from-primary-900 to-primary-700 text-white">
            <div class="text-center">
              <div class="text-sm font-semibold mb-2 opacity-80">Saldo Total</div>
              <div class="text-5xl font-bold text-accent-500 mb-4">
                R$ {{ (typeof balance === 'number' ? balance : 0).toFixed(2) }}
              </div>
              
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div>
                  <div class="text-xs opacity-70 mb-1">Disponível</div>
                  <div class="text-xl font-bold">R$ {{ (typeof availableBalance === 'number' ? availableBalance : 0).toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-xs opacity-70 mb-1">Em Escrow</div>
                  <div class="text-xl font-bold">R$ {{ (typeof escrowBalance === 'number' ? escrowBalance : 0).toFixed(2) }}</div>
                </div>
              </div>
              
              <div class="mt-3 pt-3 border-t border-white/20">
                <div class="text-xs opacity-70 mb-1">Total Recebido</div>
                <div class="text-2xl font-bold text-green-300">R$ {{ totalReceived.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <!-- Formulário de Depósito -->
          <div class="card">
            <h3 class="text-lg font-bold text-primary-900 mb-4">💵 Depositar</h3>
            
            <div v-if="depositError" class="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {{ depositError }}
            </div>
            
            <div v-if="depositSuccess" class="mb-3 p-2 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
              {{ depositSuccess }}
            </div>

            <form @submit.prevent="handleDeposit" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-primary-900 mb-2">
                  Valor (R$)
                </label>
                <input
                  v-model="depositForm.amount"
                  type="number"
                  step="0.01"
                  min="10"
                  required
                  class="input w-full"
                  placeholder="Mínimo R$ 10,00"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-primary-900 mb-2">
                  Método de Pagamento
                </label>
                <select v-model="depositForm.paymentMethod" class="input w-full">
                  <option value="pix">PIX (Instantâneo)</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="boleto">Boleto Bancário</option>
                </select>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="btn btn-primary w-full"
              >
                {{ loading ? 'Processando...' : '✅ Depositar' }}
              </button>
            </form>
          </div>

          <!-- Formulário de Saque -->
          <div class="card">
            <h3 class="text-lg font-bold text-primary-900 mb-4">🏦 Solicitar Saque</h3>
            
            <div v-if="withdrawError" class="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {{ withdrawError }}
            </div>

            <form @submit.prevent="handleWithdraw" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-primary-900 mb-2">
                  Valor (R$)
                </label>
                <input
                  v-model="withdrawForm.amount"
                  type="number"
                  step="0.01"
                  min="10"
                  :max="availableBalance"
                  required
                  class="input w-full"
                  placeholder="Disponível para saque"
                />
                <p class="text-xs text-gray-600 mt-1">
                  Disponível: R$ {{ (typeof availableBalance === 'number' ? availableBalance : 0).toFixed(2) }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-primary-900 mb-2">
                  Método de Recebimento
                </label>
                <select v-model="withdrawForm.method" class="input w-full">
                  <option value="pix">PIX</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                </select>
              </div>

              <button
                type="submit"
                :disabled="loading || availableBalance === 0"
                class="btn btn-secondary w-full"
              >
                {{ loading ? 'Processando...' : '💸 Solicitar Saque' }}
              </button>
            </form>
          </div>

          <!-- Info -->
          <div class="card bg-blue-50 border-l-4 border-blue-500">
            <h4 class="font-bold text-blue-900 mb-2">ℹ️ Informações</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Depósitos via PIX: instantâneo</li>
              <li>• Saques processados em até 2 dias úteis</li>
              <li>• Saldo em escrow bloqueado até conclusão</li>
            </ul>
          </div>
        </div>

        <!-- COLUNA DIREITA: Extrato (2/3) -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-primary-900">📊 Extrato de Transações</h2>
              <div class="flex gap-2">
                <button
                  v-for="filter in filters"
                  :key="filter.value"
                  @click="activeFilter = filter.value"
                  class="text-sm px-3 py-1 rounded-full transition-all"
                  :class="activeFilter === filter.value 
                    ? 'bg-primary-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ filter.label }}
                </button>
              </div>
            </div>

            <div v-if="filteredStatement.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-5xl mb-3">📭</div>
              <p>Nenhuma transação encontrada</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b-2 border-gray-200">
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Data</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">Descrição</th>
                    <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Valor</th>
                    <th class="text-right py-3 px-4 text-sm font-semibold text-gray-700">Saldo Após</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="transaction in filteredStatement"
                    :key="transaction.id"
                    class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-3 px-4 text-sm text-gray-600">
                      {{ formatDate(transaction.created_at) }}
                    </td>
                    <td class="py-3 px-4">
                      <span class="flex items-center gap-2">
                        <span class="text-xl">{{ getTransactionIcon(transaction.type) }}</span>
                        <span class="text-sm font-medium" :class="getTransactionColor(transaction.type)">
                          {{ getTransactionLabel(transaction.type) }}
                        </span>
                      </span>
                    </td>
                    <td class="py-3 px-4 text-sm text-gray-700">
                      {{ transaction.description || '-' }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span
                        class="font-bold"
                        :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ transaction.amount > 0 ? '+' : '' }}R$ {{ Math.abs(transaction.amount).toFixed(2) }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                      R$ {{ transaction.balance_after.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWallet } from '@/composables/useWallet'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const {
  balance,
  availableBalance,
  escrowBalance,
  totalReceived,
  statement,
  loading,
  fetchBalance,
  deposit,
  withdraw,
  fetchStatement
} = useWallet()

const depositForm = ref({ amount: '', paymentMethod: 'pix' })
const withdrawForm = ref({ amount: '', method: 'pix' })
const activeFilter = ref('all')
const depositError = ref(null)
const depositSuccess = ref(null)
const withdrawError = ref(null)

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'deposit', label: 'Depósitos' },
  { value: 'escrow_hold', label: 'Escrow' },
  { value: 'payout', label: 'Recebidos' },
  { value: 'refund', label: 'Reembolsos' }
]

const filteredStatement = computed(() => {
  if (activeFilter.value === 'all') return statement.value
  return statement.value.filter(t => t.type === activeFilter.value)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionIcon = (type) => {
  const icons = {
    deposit: '💵',
    escrow_hold: '🔒',
    payout: '💰',
    refund: '↩️',
    withdrawal: '🏦'
  }
  return icons[type] || '💳'
}

const getTransactionLabel = (type) => {
  const labels = {
    deposit: 'Depósito',
    escrow_hold: 'Escrow Hold',
    payout: 'Recebido',
    refund: 'Reembolso',
    withdrawal: 'Saque'
  }
  return labels[type] || type
}

const getTransactionColor = (type) => {
  const colors = {
    deposit: 'text-green-700',
    escrow_hold: 'text-orange-700',
    payout: 'text-blue-700',
    refund: 'text-red-700',
    withdrawal: 'text-purple-700'
  }
  return colors[type] || 'text-gray-700'
}

const handleDeposit = async () => {
  depositError.value = null
  depositSuccess.value = null

  const amount = parseFloat(depositForm.value.amount)
  if (amount < 10) {
    depositError.value = 'Valor mínimo para depósito é R$ 10,00'
    return
  }

  const success = await deposit(amount, depositForm.value.paymentMethod)
  
  if (success) {
    depositSuccess.value = `✅ Depósito de R$ ${amount.toFixed(2)} realizado com sucesso!`
    depositForm.value = { amount: '', paymentMethod: 'pix' }
    
    setTimeout(() => {
      depositSuccess.value = null
    }, 5000)
  } else {
    depositError.value = 'Erro ao processar depósito. Tente novamente.'
  }
}

const handleWithdraw = async () => {
  withdrawError.value = null

  const amount = parseFloat(withdrawForm.value.amount)
  if (amount > availableBalance.value) {
    withdrawError.value = 'Saldo insuficiente'
    return
  }

  if (amount < 10) {
    withdrawError.value = 'Valor mínimo para saque é R$ 10,00'
    return
  }

  const success = await withdraw(amount, withdrawForm.value.method)
  
  if (success) {
    alert(`✅ Saque de R$ ${amount.toFixed(2)} solicitado com sucesso! Será processado em até 2 dias úteis.`)
    withdrawForm.value = { amount: '', method: 'pix' }
  } else {
    withdrawError.value = 'Erro ao solicitar saque. Tente novamente.'
  }
}

onMounted(async () => {
  await fetchBalance()
  await fetchStatement()
})
</script>
