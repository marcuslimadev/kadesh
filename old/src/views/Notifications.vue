<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Notificações</h1>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              :class="activeFilter === filter.id
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'"
            >
              {{ filter.label }}
              <span
                v-if="filter.id === 'unread' && unreadCount > 0"
                class="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full"
              >
                {{ unreadCount }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Notifications List -->
      <LoadingScreen v-if="loading" />
      
      <div v-else-if="filteredNotifications.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-xl font-semibold mb-2">Nenhuma notificação</h3>
        <p>Você está em dia!</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer"
          :class="{ 'bg-blue-50 border-l-4 border-blue-500': !notification.read_at }"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0 text-4xl">
              {{ getNotificationIcon(notification.type) }}
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ notification.title }}
                </h3>
                <span class="text-xs text-gray-500">
                  {{ formatDate(notification.created_at) }}
                </span>
              </div>
              
              <p class="text-gray-700 mb-3">{{ notification.message }}</p>
              
              <div class="flex items-center gap-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="getTypeClass(notification.type)"
                >
                  {{ getTypeLabel(notification.type) }}
                </span>
                
                <button
                  v-if="!notification.read_at"
                  @click.stop="markAsRead(notification.id)"
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar como lida
                </button>
                
                <button
                  @click.stop="handleDelete(notification.id)"
                  class="text-sm text-red-600 hover:text-red-700 font-medium ml-auto"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const {
  notifications,
  loading,
  unreadCount,
  fetchNotifications,
  markAsRead,
  deleteNotification
} = useNotifications()

const activeFilter = ref('all')

const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'unread', label: 'Não lidas' },
  { id: 'bid', label: 'Lances' },
  { id: 'project', label: 'Projetos' },
  { id: 'payment', label: 'Pagamentos' },
  { id: 'system', label: 'Sistema' }
]

const filteredNotifications = computed(() => {
  let filtered = notifications.value
  
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read_at)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === activeFilter.value)
  }
  
  return filtered
})

const handleNotificationClick = async (notification) => {
  if (!notification.read_at) {
    await markAsRead(notification.id)
  }

  if (notification.link) {
    router.push(notification.link)
  }
}

const handleDelete = async (id) => {
  if (confirm('Deseja realmente deletar esta notificação?')) {
    await deleteNotification(id)
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    'bid': '💰',
    'project': '📋',
    'payment': '💳',
    'delivery': '📦',
    'review': '⭐',
    'message': '💬',
    'system': '⚙️',
    'default': '🔔'
  }
  return icons[type] || icons.default
}

const getTypeClass = (type) => {
  const classes = {
    'bid': 'bg-yellow-100 text-yellow-800',
    'project': 'bg-blue-100 text-blue-800',
    'payment': 'bg-green-100 text-green-800',
    'delivery': 'bg-purple-100 text-purple-800',
    'review': 'bg-pink-100 text-pink-800',
    'message': 'bg-indigo-100 text-indigo-800',
    'system': 'bg-gray-100 text-gray-800'
  }
  return classes[type] || classes.system
}

const getTypeLabel = (type) => {
  const labels = {
    'bid': 'Lance',
    'project': 'Projeto',
    'payment': 'Pagamento',
    'delivery': 'Entrega',
    'review': 'Avaliação',
    'message': 'Mensagem',
    'system': 'Sistema'
  }
  return labels[type] || 'Notificação'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora mesmo'
  if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`
  if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`
  if (days < 7) return `${days} dia${days > 1 ? 's' : ''} atrás`
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchNotifications()
})
</script>
