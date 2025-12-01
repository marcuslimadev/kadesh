import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'kadesh_view_mode'

const getInitialMode = () => {
  if (typeof window === 'undefined') return 'contractor'
  try {
    return localStorage.getItem(STORAGE_KEY) || 'contractor'
  } catch {
    return 'contractor'
  }
}

export const useViewModeStore = defineStore('viewMode', () => {
  // Estado: 'contractor' (Contratante) ou 'provider' (Prestador)
  const currentMode = ref(getInitialMode())
  
  // Getters
  const isContractor = computed(() => currentMode.value === 'contractor')
  const isProvider = computed(() => currentMode.value === 'provider')
  
  const modeLabel = computed(() => {
    return currentMode.value === 'contractor' ? 'Contratante' : 'Prestador'
  })
  
  const modeIcon = computed(() => {
    return currentMode.value === 'contractor' ? 'C' : 'P'
  })
  
  const modeColor = computed(() => {
    return currentMode.value === 'contractor' ? 'blue' : 'green'
  })
  
  // Actions
  const persist = (mode) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
  }

  const setMode = (mode) => {
    if (mode !== 'contractor' && mode !== 'provider') {
      console.error('Modo inválido. Use "contractor" ou "provider"')
      return
    }
    
    currentMode.value = mode
    persist(mode)
  }
  
  const toggleMode = () => {
    const newMode = currentMode.value === 'contractor' ? 'provider' : 'contractor'
    setMode(newMode)
  }
  
  const setContractorMode = () => setMode('contractor')
  const setProviderMode = () => setMode('provider')
  
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
