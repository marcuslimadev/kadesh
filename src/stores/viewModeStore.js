import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useViewModeStore = defineStore('viewMode', () => {
  // Estado: 'contractor' (Contratante) ou 'provider' (Prestador)
  const currentMode = ref(localStorage.getItem('kadesh_view_mode') || 'contractor')
  
  // Getters
  const isContractor = computed(() => currentMode.value === 'contractor')
  const isProvider = computed(() => currentMode.value === 'provider')
  
  const modeLabel = computed(() => {
    return currentMode.value === 'contractor' ? 'Contratante' : 'Prestador'
  })
  
  const modeIcon = computed(() => {
    return currentMode.value === 'contractor' ? '👔' : '⚙️'
  })
  
  const modeColor = computed(() => {
    return currentMode.value === 'contractor' ? 'blue' : 'green'
  })
  
  // Actions
  function setMode(mode) {
    if (mode !== 'contractor' && mode !== 'provider') {
      console.error('Modo inválido. Use "contractor" ou "provider"')
      return
    }
    
    currentMode.value = mode
    localStorage.setItem('kadesh_view_mode', mode)
  }
  
  function toggleMode() {
    const newMode = currentMode.value === 'contractor' ? 'provider' : 'contractor'
    setMode(newMode)
  }
  
  function setContractorMode() {
    setMode('contractor')
  }
  
  function setProviderMode() {
    setMode('provider')
  }
  
  return {
    // State
    currentMode,
    
    // Getters
    isContractor,
    isProvider,
    modeLabel,
    modeIcon,
    modeColor,
    
    // Actions
    setMode,
    toggleMode,
    setContractorMode,
    setProviderMode
  }
})
