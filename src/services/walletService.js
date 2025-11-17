import api from './api'

export const walletService = {
  /**
   * Get wallet balance
   */
  async getBalance() {
    try {
      const response = await api.get('/api/wallet/balance')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar saldo'
      }
    }
  },

  /**
   * Get transaction history
   */
  async getTransactions(params = {}) {
    try {
      const response = await api.get('/api/wallet/transactions', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar transações'
      }
    }
  },

  /**
   * Create withdrawal request
   */
  async withdraw(amount, method = 'bank_transfer', notes = '') {
    try {
      const response = await api.post('/api/wallet/withdraw', {
        amount,
        method,
        notes
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao processar saque'
      }
    }
  },

  /**
   * Create deposit
   */
  async deposit(amount, method = 'mercadopago', description = '') {
    try {
      const response = await api.post('/api/payments/deposit', {
        amount,
        method,
        description
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating deposit:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar checkout'
      }
    }
  },

  async getPaymentIntents(params = {}) {
    try {
      const response = await api.get('/api/payments/intents', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching payment intents:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar pagamentos pendentes'
      }
    }
  }
}

export default walletService
