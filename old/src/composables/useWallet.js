import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export function useWallet() {
  const balance = ref(0)
  const availableBalance = ref(0)
  const escrowBalance = ref(0)
  const totalReceived = ref(0)
  const statement = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchBalance = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/wallet/balance`, {
        withCredentials: true
      })
      
      balance.value = parseFloat(response.data.balance || 0)
      availableBalance.value = parseFloat(response.data.available_balance || 0)
      escrowBalance.value = parseFloat(response.data.escrow_balance || 0)
      totalReceived.value = parseFloat(response.data.total_received || 0)
      
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar saldo'
      console.error('Erro ao buscar saldo:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const deposit = async (amount, paymentMethod = 'pix') => {
    loading.value = true
    error.value = null
    try {
      await axios.post(`${API_BASE}/wallet/deposit`, {
        amount: parseFloat(amount),
        payment_method: paymentMethod
      }, {
        withCredentials: true
      })
      
      await fetchBalance()
      await fetchStatement()
      
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao realizar depósito'
      console.error('Erro ao depositar:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const withdraw = async (amount, withdrawMethod) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(`${API_BASE}/wallet/withdraw`, {
        amount: parseFloat(amount),
        withdraw_method: withdrawMethod
      }, {
        withCredentials: true
      })
      
      await fetchBalance()
      await fetchStatement()
      
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao solicitar saque'
      console.error('Erro ao sacar:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchStatement = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/wallet/statement`, {
        withCredentials: true
      })
      
      statement.value = response.data.transactions || []
      
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar extrato'
      console.error('Erro ao buscar extrato:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // States
    balance,
    availableBalance,
    escrowBalance,
    totalReceived,
    statement,
    loading,
    error,
    
    // Methods
    fetchBalance,
    deposit,
    withdraw,
    fetchStatement
  }
}
