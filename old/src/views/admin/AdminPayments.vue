<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gerenciar Pagamentos</h1>
        <p class="text-gray-600 mt-2">Pagamentos, repasses e taxas do sistema</p>
      </div>

      <LoadingScreen :show="loading" message="Carregando pagamentos..." icon="💰" />

      <!-- Stats de Pagamentos -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Total Processado</p>
              <p class="text-2xl font-bold text-green-600 mt-1">R$ {{ formatMoney(stats.total_processed) }}</p>
            </div>
            <i class="fas fa-check-circle text-4xl text-green-500 opacity-20"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Taxas (10%)</p>
              <p class="text-2xl font-bold text-yellow-600 mt-1">R$ {{ formatMoney(stats.total_fees) }}</p>
            </div>
            <i class="fas fa-percentage text-4xl text-yellow-500 opacity-20"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Repasses Pendentes</p>
              <p class="text-2xl font-bold text-orange-600 mt-1">{{ stats.pending_payouts || 0 }}</p>
            </div>
            <i class="fas fa-clock text-4xl text-orange-500 opacity-20"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Concluídos Hoje</p>
              <p class="text-2xl font-bold text-blue-600 mt-1">{{ stats.today_payouts || 0 }}</p>
            </div>
            <i class="fas fa-calendar-day text-4xl text-blue-500 opacity-20"></i>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'payments'"
              :class="activeTab === 'payments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 border-b-2 font-medium text-sm"
            >
              <i class="fas fa-credit-card mr-2"></i>Pagamentos Recebidos
            </button>
            <button 
              @click="activeTab = 'payouts'"
              :class="activeTab === 'payouts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 border-b-2 font-medium text-sm"
            >
              <i class="fas fa-hand-holding-usd mr-2"></i>Repasses Pendentes
              <span v-if="stats.pending_payouts > 0" class="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">{{ stats.pending_payouts }}</span>
            </button>
            <button 
              @click="activeTab = 'history'"
              :class="activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 border-b-2 font-medium text-sm"
            >
              <i class="fas fa-history mr-2"></i>Histórico Completo
            </button>
          </nav>
        </div>
      </div>

      <!-- Conteúdo dos Tabs -->
      <div v-if="!loading">
        <!-- Tab: Pagamentos Recebidos -->
        <div v-if="activeTab === 'payments'" class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Pagamentos Aprovados (Mercado Pago)</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projeto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contratante</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa (10%)</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ payment.project_title }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ payment.contractor_name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">R$ {{ formatMoney(payment.amount) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600">R$ {{ formatMoney(payment.amount * 0.10) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(payment.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab: Repasses Pendentes -->
        <div v-if="activeTab === 'payouts'" class="space-y-4">
          <div v-for="payout in pendingPayouts" :key="payout.id" class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="text-lg font-bold text-gray-900 mb-2">{{ payout.project_title }}</h4>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Fornecedor</p>
                    <p class="font-medium text-gray-900">{{ payout.provider_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Valor do Repasse (90%)</p>
                    <p class="text-2xl font-bold text-green-600">R$ {{ formatMoney(payout.amount * 0.90) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Método de Pagamento</p>
                    <p class="font-medium text-gray-900">
                      <i class="fas fa-qrcode mr-2 text-blue-500"></i>
                      {{ payout.pix_key || 'Banco: ' + (payout.bank_name || 'N/A') }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Data de Aceite</p>
                    <p class="font-medium text-gray-900">{{ formatDate(payout.accepted_at) }}</p>
                  </div>
                </div>
              </div>
              
              <div class="ml-6 space-y-2">
                <button @click="processPayout(payout)" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  <i class="fas fa-play mr-2"></i>Processar
                </button>
                <button @click="completePayout(payout)" class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                  <i class="fas fa-check mr-2"></i>Concluir
                </button>
              </div>
            </div>
          </div>

          <div v-if="pendingPayouts.length === 0" class="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <i class="fas fa-check-circle text-6xl mb-4 opacity-30"></i>
            <p class="text-lg">Nenhum repasse pendente no momento!</p>
          </div>
        </div>

        <!-- Tab: Histórico -->
        <div v-if="activeTab === 'history'" class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Histórico Completo de Transações</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="transaction in allTransactions" :key="transaction.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-green-100 text-green-800': transaction.type === 'payment',
                        'bg-blue-100 text-blue-800': transaction.type === 'payout'
                      }" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ transaction.type === 'payment' ? 'Pagamento' : 'Repasse' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{ transaction.description }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">R$ {{ formatMoney(transaction.amount) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="{
                        'bg-yellow-100 text-yellow-800': transaction.status === 'pending',
                        'bg-green-100 text-green-800': transaction.status === 'completed'
                      }" class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ transaction.status === 'pending' ? 'Pendente' : 'Concluído' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(transaction.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const loading = ref(false)
const activeTab = ref('payouts')
const stats = ref({})
const payments = ref([])
const pendingPayouts = ref([])
const allTransactions = ref([])

const fetchPaymentData = async () => {
  loading.value = true
  try {
    const [statsRes, paymentsRes, payoutsRes, transactionsRes] = await Promise.all([
      axios.get('/api/admin/payments/stats', { withCredentials: true }),
      axios.get('/api/admin/payments', { withCredentials: true }),
      axios.get('/api/admin/payouts/pending', { withCredentials: true }),
      axios.get('/api/admin/transactions', { withCredentials: true })
    ])
    
    stats.value = statsRes.data
    payments.value = paymentsRes.data.payments || paymentsRes.data || []
    pendingPayouts.value = payoutsRes.data.payouts || payoutsRes.data || []
    allTransactions.value = transactionsRes.data.transactions || transactionsRes.data || []
  } catch (error) {
    console.error('Erro ao carregar dados de pagamento:', error)
  } finally {
    loading.value = false
  }
}

const processPayout = async (payout) => {
  if (confirm(`Marcar repasse de R$ ${formatMoney(payout.amount * 0.90)} para ${payout.provider_name} como "Processando"?`)) {
    try {
      await axios.post(`/api/admin/payouts/${payout.id}/process`, {}, { withCredentials: true })
      alert('Repasse marcado como processando. Realize a transferência via Mercado Pago/PIX e depois clique em "Concluir".')
      fetchPaymentData()
    } catch (error) {
      alert('Erro ao processar repasse')
    }
  }
}

const completePayout = async (payout) => {
  if (confirm(`Confirmar conclusão do repasse de R$ ${formatMoney(payout.amount * 0.90)} para ${payout.provider_name}?`)) {
    try {
      await axios.post(`/api/admin/payouts/${payout.id}/complete`, {}, { withCredentials: true })
      alert('Repasse concluído! Fornecedor será notificado.')
      fetchPaymentData()
    } catch (error) {
      alert('Erro ao concluir repasse')
    }
  }
}

const formatMoney = (value) => {
  return parseFloat(value || 0).toFixed(2).replace('.', ',')
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
  fetchPaymentData()
})
</script>
