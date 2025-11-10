import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export function usePayments() {
  const loading = ref(false)
  const error = ref(null)
  const paymentUrl = ref(null)
  const paymentStatus = ref(null)

  const createPayment = async (amount, description, type = 'deposit') => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.post(`${API_BASE}/payments/create`, {
        amount,
        description,
        type
      }, {
        withCredentials: true
      })
      
      paymentUrl.value = response.data.init_point || response.data.payment_url
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao criar pagamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const checkPaymentStatus = async (paymentId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${API_BASE}/payments/${paymentId}/status`, {
        withCredentials: true
      })
      
      paymentStatus.value = response.data.status
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao verificar pagamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  const processWebhook = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/payments/webhook`, data, {
        withCredentials: true
      })
      return response.data
    } catch (err) {
      console.error('Erro ao processar webhook:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    paymentUrl,
    paymentStatus,
    createPayment,
    checkPaymentStatus,
    processWebhook
  }
}
