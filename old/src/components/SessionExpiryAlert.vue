<template>
  <div v-if="show" class="fixed bottom-4 right-4 z-50">
    <div class="bg-primary-900 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div class="flex items-center gap-3">
        <div class="text-2xl">⏱️</div>
        <div class="flex-1">
          <div class="font-semibold text-sm">Sessão Ativa</div>
          <div class="text-xs opacity-80">
            Expira em {{ daysRemaining }} {{ daysRemaining === 1 ? 'dia' : 'dias' }}
          </div>
        </div>
        <button
          @click="handleExtend"
          class="bg-accent-500 text-primary-900 px-3 py-1 rounded text-xs font-bold hover:bg-accent-600 transition-colors"
        >
          Estender
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getRemainingDays, extendSession } = useAuth()

const show = ref(false)
const daysRemaining = ref(0)
let checkInterval = null

const checkExpiry = () => {
  daysRemaining.value = getRemainingDays()
  
  // Mostrar alerta se faltam 2 dias ou menos
  show.value = daysRemaining.value > 0 && daysRemaining.value <= 2
}

const handleExtend = () => {
  const success = extendSession()
  if (success) {
    daysRemaining.value = getRemainingDays()
    show.value = false
    
    // Mostrar feedback
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50'
    notification.innerHTML = '✅ Sessão estendida por mais 7 dias!'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

onMounted(() => {
  checkExpiry()
  // Verificar a cada hora
  checkInterval = setInterval(checkExpiry, 3600000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>
