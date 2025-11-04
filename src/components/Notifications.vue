<template>
  <div class="relative">
    <button @click="toggle" class="relative z-10 block p-2">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 17h5l-1.4-1.4a2 2 0 01-.6-1.4V11a6 6 0 00-4-5.6V5a2 2 0 10-4 0v.4A6 6 0 006 11v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-if="unreadCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
        {{ unreadCount }}
      </span>
    </button>
    <div v-if="isOpen" class="absolute right-0 z-20 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-xl">
      <div v-for="n in notifications" :key="n.id" class="p-3 text-sm text-gray-600 border-b hover:bg-gray-100">
        <router-link :to="n.link || '#'">{{ n.message }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'

const isOpen = ref(false)
const notifications = ref([])

async function fetchNotifications() {
  try {
    const response = await api.get('/api/notifications')
    notifications.value = response.data
  } catch (error) {
    // Silently fail
  }
}

onMounted(fetchNotifications)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.is_read).length
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Mark notifications as read (or do this on click)
  }
}
</script>
