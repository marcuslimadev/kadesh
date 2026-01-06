import api from './api'

const notifyProjectsUpdated = (source) => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('kadesh:projects-updated', { detail: { source } }))
}

export const bidService = {
  /**
   * Create a new bid
   */
  async createBid(bidData) {
    try {
      const response = await api.post('/api/bids', bidData)
      notifyProjectsUpdated('bid')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating bid:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar proposta'
      }
    }
  },

  /**
   * Get my bids (as provider)
   */
  async getMyBids(params = {}) {
    try {
      const response = await api.get('/api/bids/my-bids', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching my bids:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar suas propostas'
      }
    }
  },

  /**
   * Accept a bid
   */
  async acceptBid(projectId, bidId) {
    try {
      const response = await api.post(`/api/projects/${projectId}/accept-bid`, {
        bid_id: bidId
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error accepting bid:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao aceitar proposta'
      }
    }
  },

  /**
   * Reject a bid
   */
  async rejectBid(bidId) {
    try {
      const response = await api.put(`/api/bids/${bidId}/reject`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error rejecting bid:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao rejeitar proposta'
      }
    }
  },

  /**
   * Withdraw a bid
   */
  async withdrawBid(bidId) {
    try {
      const response = await api.put(`/api/bids/${bidId}/withdraw`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error withdrawing bid:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao retirar proposta'
      }
    }
  }
}

export default bidService
