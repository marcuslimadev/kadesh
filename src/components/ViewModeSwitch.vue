<template>
  <div class="view-mode-switch">
    <!-- Versão Desktop -->
    <div class="hidden md:flex items-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg p-1.5 border border-gray-200/50 transition-all duration-500">
      <button
        @click="viewMode.setContractorMode()"
        :class="[
          'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-500 ease-out',
          viewMode.isContractor
            ? 'bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 text-blue-900 shadow-lg scale-105'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
        ]"
      >
        <span class="text-lg transition-transform duration-500" :class="viewMode.isContractor ? 'scale-110' : ''">👔</span>
        <span class="text-sm font-semibold">Contratante</span>
      </button>
      
      <button
        @click="viewMode.setProviderMode()"
        :class="[
          'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-500 ease-out',
          viewMode.isProvider
            ? 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 text-emerald-900 shadow-lg scale-105'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
        ]"
      >
        <span class="text-lg transition-transform duration-500" :class="viewMode.isProvider ? 'scale-110' : ''">⚙️</span>
        <span class="text-sm font-semibold">Prestador</span>
      </button>
    </div>

    <!-- Versão Mobile -->
    <div class="md:hidden flex items-center justify-center">
      <button
        @click="viewMode.toggleMode()"
        :class="[
          'flex items-center gap-2.5 px-5 py-3 rounded-full font-bold shadow-xl transition-all duration-700 ease-in-out transform hover:scale-105 backdrop-blur-sm',
          viewMode.isContractor
            ? 'bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 text-blue-900'
            : 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 text-emerald-900'
        ]"
      >
        <span class="text-xl transition-transform duration-500">{{ viewMode.modeIcon }}</span>
        <span class="text-sm">Ver como {{ viewMode.modeLabel }}</span>
        <svg class="w-4 h-4 transition-transform duration-700" :class="viewMode.isProvider ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      </button>
    </div>

    <!-- Tooltip explicativo (aparece apenas nas primeiras 3 vezes) -->
    <div
      v-if="showTooltip"
      class="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-900 to-purple-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl z-50 whitespace-nowrap animate-bounce-subtle"
    >
      <div class="flex items-center gap-2">
        <span class="text-lg">✨</span>
        <span>Alterne entre Contratante e Prestador a qualquer momento!</span>
        <button
          @click="dismissTooltip"
          class="ml-2 text-blue-200 hover:text-white font-bold transition-colors duration-300"
        >
          OK
        </button>
      </div>
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-indigo-900"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useViewModeStore } from '@/stores/viewModeStore'

const viewMode = useViewModeStore()
const showTooltip = ref(false)

onMounted(() => {
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
  localStorage.setItem('kadesh_viewmode_tooltip_count', '999') // Não mostra mais
}
</script>

<style scoped>
.view-mode-switch {
  position: relative;
}

/* Animação suave para o tooltip */
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

/* Transições suaves para mudanças de cor */
button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
