import api from './api'

export const notificationService = {
  /**
   * Get notifications
   */
  async getNotifications(params = {}) {
    try {
      const response = await api.get('/api/notifications', { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar notificações'
      }
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/api/notifications/${notificationId}/read`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao marcar notificação como lida'
      }
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      const response = await api.post('/api/notifications/read-all')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao marcar todas como lidas'
      }
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao excluir notificação'
      }
    }
  },

  /**
   * Get unread count
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/api/notifications', {
        params: { is_read: false, limit: 1 }
      })
      return {
        success: true,
        data: {
          count: response.data?.unread_count || 0
        }
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao carregar contador'
      }
    }
  }
}

export default notificationService
