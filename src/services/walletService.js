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
  async withdraw(amount, method = 'bank_transfer') {
    try {
      const response = await api.post('/api/wallet/withdraw', {
        amount,
        method
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
  async deposit(amount) {
    try {
      const response = await api.post('/api/wallet/deposit', {
        amount
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating deposit:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar depósito'
      }
    }
  }
}

export default walletService
