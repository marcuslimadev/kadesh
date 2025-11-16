import api from './api'

export const providerService = {
  /**
   * Fetch the authenticated user's profile (including provider details)
   */
  async getProfile() {
    try {
      const response = await api.get('/api/users/profile')
      return {
        success: true,
        data: response.data.user
      }
    } catch (error) {
      console.error('Error fetching provider profile:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar perfil'
      }
    }
  },

  /**
   * Update the authenticated user's profile
   */
  async updateProfile(payload) {
    try {
      const response = await api.put('/api/users/profile', payload)
      return {
        success: true,
        data: response.data.user
      }
    } catch (error) {
      console.error('Error updating provider profile:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar perfil'
      }
    }
  },

  /**
   * Get dashboard stats for the authenticated user
   */
  async getStats() {
    try {
      const response = await api.get('/api/users/dashboard/stats')
      return {
        success: true,
        data: response.data.stats
      }
    } catch (error) {
      console.error('Error fetching provider stats:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar mǸtricas'
      }
    }
  },

  /**
   * Search for providers (used for discovery sections)
   */
  async searchProviders(params = {}) {
    try {
      const response = await api.get('/api/users/providers/search', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error searching providers:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar fornecedores'
      }
    }
  }
}

export default providerService
