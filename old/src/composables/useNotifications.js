import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export function useNotifications() {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read_at).length
  })

  const fetchNotifications = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`${API_BASE}/notifications`, {
        withCredentials: true
      })
      
      notifications.value = response.data.notifications || response.data
      return notifications.value
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar notificações'
      throw err
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${API_BASE}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      )
      
      // Atualizar localmente
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read_at = new Date().toISOString()
      }
      
      return true
    } catch (err) {
      console.error('Erro ao marcar como lida:', err)
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API_BASE}/notifications/read-all`,
        {},
        { withCredentials: true }
      )
      
      // Atualizar localmente
      const now = new Date().toISOString()
      notifications.value.forEach(n => {
        if (!n.read_at) {
          n.read_at = now
        }
      })
      
      return true
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
      return false
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE}/notifications/${notificationId}`, {
        withCredentials: true
      })
      
      // Remover localmente
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
      
      return true
    } catch (err) {
      console.error('Erro ao deletar notificação:', err)
      return false
    }
  }

  // Polling automático (opcional)
  let pollingInterval = null
  
  const startPolling = (intervalMs = 30000) => {
    if (pollingInterval) return
    
    pollingInterval = setInterval(() => {
      fetchNotifications()
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    startPolling,
    stopPolling
  }
}
