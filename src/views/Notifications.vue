<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-heading">Notificações</h1>
            <p class="mt-2 text-body">Acompanhe todas as atualizações importantes</p>
          </div>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 transition-colors"
          >
            Marcar todas como lida
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-surface rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-body mb-2">Tipo</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="project">Projetos</option>
              <option value="bid">Propostas</option>
              <option value="payment">Pagamentos</option>
              <option value="message">Mensagens</option>
              <option value="system">Sistema</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-body mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas</option>
              <option value="unread">Não Lidas</option>
              <option value="read">Lidas</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-body mb-2">Ordenar Por</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date_desc">Mais Recentes</option>
              <option value="date_asc">Mais Antigas</option>
            </select>
          </div>
        </div>
        
        <div v-if="hasActiveFilters" class="mt-4">
          <button
            @click="clearFilters"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-body">Carregando notificações...</p>
      </div>

      <div v-else-if="error" class="bg-surface rounded-lg shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Erro ao carregar notificações</h3>
        <p class="mt-2 text-sm text-body">{{ error }}</p>
        <button
          @click="loadNotifications"
          class="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="bg-surface rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Nenhuma notificação encontrada</h3>
        <p class="mt-2 text-sm text-body">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você está em dia! Não há notificações no momento.' }}
        </p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'bg-surface rounded-lg shadow hover:shadow-md transition-all cursor-pointer',
            notification.is_read ? 'opacity-75' : 'border-l-4 border-primary-500'
          ]"
        >
          <div class="p-6">
            <div class="flex items-start">
              <!-- Icon -->
              <div :class="getNotificationIconClass(notification.type)" class="flex-shrink-0 p-3 rounded-full">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getNotificationIcon(notification.type)" />
                </svg>
              </div>
              
              <!-- Content -->
              <div class="ml-4 flex-1">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-heading">{{ notification.title }}</p>
                    <p class="mt-1 text-sm text-body">{{ notification.message }}</p>
                  </div>
                  <span v-if="!notification.is_read" class="ml-2 w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></span>
                </div>
                
                <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(notification.created_at) }}
                  </span>
                  <span :class="getTypeColor(notification.type)" class="px-2 py-1 rounded-full">
                    {{ getTypeLabel(notification.type) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="ml-4 flex items-center gap-2">
                <button
                  v-if="!notification.is_read"
                  @click.stop="markAsRead(notification.id)"
                  class="p-2 text-gray-400 hover:text-body"
                  title="Marcar como lida"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  @click.stop="deleteNotification(notification.id)"
                  class="p-2 text-gray-400 hover:text-red-600"
                  title="Excluir"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/ui/Pagination.vue'
import notificationService from '@/services/notificationService'
// import { useToast } from 'vue-toastification'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
// const toast = useToast()

const notifications = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 15

const filters = ref({
  type: '',
  status: '',
  sortBy: 'date_desc'
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

const hasActiveFilters = computed(() => {
  return filters.value.type !== '' || filters.value.status !== ''
})

const filteredNotifications = computed(() => {
  let result = [...notifications.value]
  
  // Apply filters
  if (filters.value.type) {
    result = result.filter(n => n.type === filters.value.type)
  }
  
  if (filters.value.status === 'unread') {
    result = result.filter(n => !n.is_read)
  } else if (filters.value.status === 'read') {
    result = result.filter(n => n.is_read)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'date_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'date_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      default:
        return 0
    }
  })
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = [...notifications.value]
  
  if (filters.value.type) {
    result = result.filter(n => n.type === filters.value.type)
  }
  
  if (filters.value.status === 'unread') {
    result = result.filter(n => !n.is_read)
  } else if (filters.value.status === 'read') {
    result = result.filter(n => n.is_read)
  }
  
  return Math.ceil(result.length / itemsPerPage)
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const getTypeLabel = (type) => {
  const types = {
    project: 'Projeto',
    bid: 'Proposta',
    payment: 'Pagamento',
    message: 'Mensagem',
    system: 'Sistema'
  }
  return types[type] || type
}

const getTypeColor = (type) => {
  const colors = {
    project: 'bg-blue-100 text-blue-800',
    bid: 'bg-green-100 text-green-800',
    payment: 'bg-purple-100 text-purple-800',
    message: 'bg-yellow-100 text-yellow-800',
    system: 'bg-gray-100 text-gray-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const getNotificationIconClass = (type) => {
  const classes = {
    project: 'bg-blue-100 text-blue-600',
    bid: 'bg-green-100 text-green-600',
    payment: 'bg-purple-100 text-purple-600',
    message: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-body'
  }
  return classes[type] || 'bg-gray-100 text-body'
}

const getNotificationIcon = (type) => {
  const icons = {
    project: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bid: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    payment: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    message: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || icons.system
}

const clearFilters = () => {
  filters.value = {
    type: '',
    status: '',
    sortBy: 'date_desc'
  }
  currentPage.value = 1
}

const handleNotificationClick = (notification) => {
  // Mark as read
  if (!notification.is_read) {
    markAsRead(notification.id)
  }
  
  // Navigate to related page if applicable
  if (notification.link) {
    router.push(notification.link)
  }
}

const markAsRead = async (notificationId) => {
  try {
    const result = await notificationService.markAsRead(notificationId)
    
    if (result.success) {
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.is_read = true
      }
    // toast.success('Notificação marcada como lida')
    } else {
    // toast.error(result.error || 'Erro ao marcar notificação como lida')
    }
  } catch (err) {
    console.error('Error marking notification as read:', err)
    // toast.error('Erro ao marcar notificação como lida')
  }
}

const markAllAsRead = async () => {
  try {
    const result = await notificationService.markAllAsRead()
    
    if (result.success) {
      notifications.value.forEach(n => {
        n.is_read = true
      })
    // toast.success('Todas as notificações foram marcadas como lidas')
    } else {
    // toast.error(result.error || 'Erro ao marcar notificações como lidas')
    }
  } catch (err) {
    console.error('Error marking all notifications as read:', err)
    // toast.error('Erro ao marcar notificações como lidas')
  }
}

const deleteNotification = async (notificationId) => {
  if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
    return
  }

  try {
    const result = await notificationService.deleteNotification(notificationId)
    
    if (result.success) {
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    // toast.success('Notificação excluída')
    } else {
    // toast.error(result.error || 'Erro ao excluir notificação')
    }
  } catch (err) {
    console.error('Error deleting notification:', err)
    // toast.error('Erro ao excluir notificação')
  }
}

const loadNotifications = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await notificationService.getNotifications({
      type: filters.value.type,
      is_read: filters.value.status === 'read' ? true : filters.value.status === 'unread' ? false : undefined,
      limit: 100 // Load all for client-side filtering
    })
    
    if (result.success) {
      notifications.value = result.data.data?.notifications || []
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading notifications:', err)
    error.value = 'Erro ao carregar notificações'
  } finally {
    isLoading.value = false
  }
}

// Reset to page 1 when filters change
watch(() => [filters.value.type, filters.value.status], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadNotifications()
})
</script>
