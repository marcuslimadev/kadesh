import { defineStore } from 'pinia'
import { ref } from 'vue'

// Sidebar foi removida da UI; mantemos o store para compatibilidade
export const useSidebarStore = defineStore('sidebar', () => {
  const isVisible = ref(false)

  const show = () => {
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
  }

  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  return {
    isVisible,
    show,
    hide,
    toggle
  }
})

