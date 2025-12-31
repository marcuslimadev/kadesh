<template>
  <div 
    v-if="isAuthenticated && showIndicator"
    class="fixed top-4 right-4 z-40 flex items-center gap-2"
  >
    <!-- Indicador de modo atual -->
    <div
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300',
        viewMode.isProvider
          ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
          : 'bg-amber-500/90 border-amber-400/50 text-white'
      ]"
    >
      <span class="text-lg">{{ viewMode.isProvider ? '🛠️' : '📘' }}</span>
      <span class="text-sm font-bold">
        {{ viewMode.isProvider ? 'Prestador' : 'Contratante' }}
      </span>
    </div>

    <!-- Botão de alternar (opcional, compacto) -->
    <button
      @click="toggleMode"
      class="p-2 rounded-full bg-surface border border-accent/30 shadow-lg hover:border-accent/60 hover:scale-105 transition-all"
      title="Alternar modo"
    >
      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useViewModeStore } from '@/stores/viewModeStore'
import { useSidebarStore } from '@/stores/sidebarStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const viewMode = useViewModeStore()
const sidebarStore = useSidebarStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Esconde o indicador quando a sidebar está visível (para evitar duplicação)
const showIndicator = computed(() => {
  // Não mostrar em telas admin
  if (route.path.startsWith('/admin')) return false
  // Mostrar sempre que a sidebar estiver escondida
  const sidebarVisible = sidebarStore.isVisible && typeof sidebarStore.isVisible === 'object' && 'value' in sidebarStore.isVisible
    ? sidebarStore.isVisible.value
    : sidebarStore.isVisible

  return !sidebarVisible
})

const toggleMode = () => {
  viewMode.toggleMode()
  
  // Navegar para a página apropriada baseada no novo modo
  if (viewMode.isProvider) {
    router.push('/my-bids')
  } else {
    router.push('/projects')
  }
}
</script>
