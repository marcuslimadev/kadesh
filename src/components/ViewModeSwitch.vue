<template>
  <div :class="['view-mode-switch', isSidebar ? 'view-mode-switch--sidebar' : '']">
    <!-- Desktop -->
    <div
      :class="[
        'hidden md:flex items-center rounded-full transition-all duration-500',
        isSidebar ? 'flex-col gap-2 bg-transparent shadow-none p-0 w-full' : 'bg-white/80 backdrop-blur-sm shadow-lg p-1.5 border border-gray-200/50'
      ]"
    >
      <button
        @click="goToMode('contractor')"
        :class="[
          'flex items-center gap-2 rounded-full font-medium transition-all duration-500 ease-out',
          isSidebar ? 'w-full justify-start px-4 py-2.5 rounded-xl' : 'px-5 py-2.5',
          viewMode.isContractor
            ? isSidebar
              ? 'bg-gold text-dark shadow-gold'
              : 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-900 shadow-lg scale-105'
            : isSidebar
              ? 'text-offwhite bg-dark-80 border border-gold/25 hover:border-gold/40'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
        ]"
      >
        <span class="text-lg transition-transform duration-500" :class="viewMode.isContractor ? 'scale-110' : ''">📘</span>
        <span class="text-sm font-semibold">Contratante</span>
      </button>
      
      <button
        @click="goToMode('provider')"
        :class="[
          'flex items-center gap-2 rounded-full font-medium transition-all duration-500 ease-out',
          isSidebar ? 'w-full justify-start px-4 py-2.5 rounded-xl' : 'px-5 py-2.5',
          viewMode.isProvider
            ? isSidebar
              ? 'bg-gold text-dark shadow-gold'
              : 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-900 shadow-lg scale-105'
            : isSidebar
              ? 'text-offwhite bg-dark-80 border border-gold/25 hover:border-gold/40'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
        ]"
      >
        <span class="text-lg transition-transform duration-500" :class="viewMode.isProvider ? 'scale-110' : ''">🛠️</span>
        <span class="text-sm font-semibold">Prestador</span>
      </button>
    </div>

    <!-- Mobile -->
    <div class="md:hidden flex items-center justify-center">
      <button
        @click="toggleMode()"
        :class="[
          'flex items-center gap-2.5 px-5 py-3 rounded-full font-bold shadow-xl transition-all duration-700 ease-in-out transform hover:scale-105 backdrop-blur-sm',
          viewMode.isContractor
            ? 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-900'
            : 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 text-amber-900'
        ]"
      >
        <span class="text-xl transition-transform duration-500">{{ viewMode.modeIcon }}</span>
        <span class="text-sm">Ver como {{ viewMode.modeLabel }}</span>
        <svg class="w-4 h-4 transition-transform duration-700" :class="viewMode.isProvider ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useViewModeStore } from '@/stores/viewModeStore'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const isSidebar = computed(() => props.variant === 'sidebar')

const viewMode = useViewModeStore()
const showTooltip = ref(false)
const router = useRouter()

onMounted(() => {
  if (typeof window === 'undefined') return
  const tooltipCount = parseInt(localStorage.getItem('kadesh_viewmode_tooltip_count') || '0')
  
  if (tooltipCount < 3) {
    showTooltip.value = true
    localStorage.setItem('kadesh_viewmode_tooltip_count', (tooltipCount + 1).toString())
    
    // Auto-dismiss após 5 segundos
    setTimeout(() => {
      showTooltip.value = false
    }, 5000)
  }
})

const dismissTooltip = () => {
  showTooltip.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('kadesh_viewmode_tooltip_count', '999') // Não mostra mais
  }
}

const goToMode = (mode) => {
  viewMode.setMode(mode)
  const target = { name: 'auction-lobby', query: { mode, ts: Date.now() } }
  const isOnLobby = router.currentRoute.value.name === 'auction-lobby'
  const navFn = isOnLobby ? router.replace : router.push
  navFn(target).catch(() => {})
}

const toggleMode = () => {
  const next = viewMode.isContractor ? 'provider' : 'contractor'
  goToMode(next)
}
</script>

<style scoped>
.view-mode-switch {
  position: relative;
}

.view-mode-switch--sidebar :deep(.md\:hidden) {
  display: none;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-5px) translateX(-50%);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}

button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
