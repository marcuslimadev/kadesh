<template>
  <div class="view-mode-switch">
    <!-- Versão Desktop -->
    <div class="hidden md:flex items-center bg-white rounded-full shadow-lg p-1.5 border-2 border-gray-200">
      <button
        @click="viewMode.setContractorMode()"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300',
          viewMode.isContractor
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        ]"
      >
        <span class="text-lg">👔</span>
        <span class="text-sm font-semibold">Contratante</span>
      </button>
      
      <button
        @click="viewMode.setProviderMode()"
        :class="[
          'flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300',
          viewMode.isProvider
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        ]"
      >
        <span class="text-lg">⚙️</span>
        <span class="text-sm font-semibold">Prestador</span>
      </button>
    </div>

    <!-- Versão Mobile -->
    <div class="md:hidden flex items-center justify-center">
      <button
        @click="viewMode.toggleMode()"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105',
          viewMode.isContractor
            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
            : 'bg-gradient-to-r from-green-500 to-green-600'
        ]"
      >
        <span class="text-lg">{{ viewMode.modeIcon }}</span>
        <span class="text-sm">Ver como {{ viewMode.modeLabel }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      </button>
    </div>

    <!-- Tooltip explicativo (aparece apenas nas primeiras 3 vezes) -->
    <div
      v-if="showTooltip"
      class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl z-50 whitespace-nowrap"
    >
      Alterne entre Contratante e Prestador a qualquer momento! 🔄
      <button
        @click="dismissTooltip"
        class="ml-2 text-blue-300 hover:text-blue-100 font-bold"
      >
        OK
      </button>
      <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
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
</style>
