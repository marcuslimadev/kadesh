import { defineStore } from 'pinia'
import { ref } from 'vue'

// SIDEBAR SEMPRE VISÍVEL - NÃO USA MAIS LOCALSTORAGE
const getInitialVisibility = () => {
  return true // SEMPRE TRUE
}

export const useSidebarStore = defineStore('sidebar', () => {
  const isVisible = ref(true) // SEMPRE TRUE

  const show = () => {
    isVisible.value = true // SEMPRE TRUE
  }

  const hide = () => {
    // NÃO FAZ NADA - SIDEBAR NUNCA ESCONDE
    isVisible.value = true
  }

  const toggle = () => {
    // NÃO FAZ NADA - SIDEBAR NUNCA ESCONDE
    isVisible.value = true
  }

  return {
    isVisible,
    show,
    hide,
    toggle
  }
})

