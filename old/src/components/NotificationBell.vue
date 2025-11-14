<template>
  <div class="relative">
    <!-- Bell Icon -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-300 hover:text-white focus:outline-none"
    >
      <span class="text-2xl">🔔</span>
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50"
    >
      <!-- Header -->
      <div class="bg-primary-900 text-white px-4 py-3 flex justify-between items-center">
        <h3 class="font-semibold">Notificações</h3>
        <button
          v-if="unreadCount > 0"
          @click="handleMarkAllAsRead"
          class="text-xs text-accent-500 hover:text-accent-400"
        >
          Marcar todas como lidas
        </button>
      </div>

      <!-- Notifications List -->
      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-gray-500">
          Carregando...
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-500">
          <div class="text-4xl mb-2">📭</div>
          <p>Nenhuma notificação</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification)"
            class="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': !notification.read_at }"
          >
            <div class="flex gap-3">
              <div class="text-2xl">{{ getNotificationIcon(notification.type) }}</div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="text-xs text-gray-600 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatDate(notification.created_at) }}
                </p>
              </div>
              <button
                @click.stop="handleDelete(notification.id)"
                class="text-gray-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-4 py-2 text-center">
        <router-link
          to="/notifications"
          class="text-sm text-primary-900 hover:text-accent-600 font-medium"
          @click="isOpen = false"
        >
          Ver todas as notificações
        </router-link>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const {
  notifications,
  loading,
  unreadCount,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  startPolling,
  stopPolling
} = useNotifications()

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value && notifications.value.length === 0) {
    fetchNotifications()
  }
}

const handleNotificationClick = async (notification) => {
  // Marcar como lida
  if (!notification.read_at) {
    await markAsRead(notification.id)
  }

  // Navegar para o link se existir
  if (notification.link) {
    router.push(notification.link)
    isOpen.value = false
  }
}

const handleMarkAllAsRead = async () => {
  await markAllAsRead()
}

const handleDelete = async (id) => {
  await deleteNotification(id)
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}m atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

onMounted(() => {
  fetchNotifications()
  startPolling(30000) // Atualizar a cada 30 segundos
})

onUnmounted(() => {
  stopPolling()
})
</script>
