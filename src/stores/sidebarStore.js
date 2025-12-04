import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'kadesh_sidebar_visible'

const getInitialVisibility = () => {
  if (typeof window === 'undefined') return false
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    // Sidebar escondida por padrão (false se não houver valor salvo)
    return stored === null ? false : stored === 'true'
  } catch {
    return false
  }
}

export const useSidebarStore = defineStore('sidebar', () => {
  const isVisible = ref(getInitialVisibility())

  const persist = (value) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, String(value))
    } catch {}
  }

  const show = () => {
    isVisible.value = true
    persist(true)
  }

  const hide = () => {
    isVisible.value = false
    persist(false)
  }

  const toggle = () => {
    isVisible.value = !isVisible.value
    persist(isVisible.value)
  }

  return {
    isVisible,
    show,
    hide,
    toggle
  }
})
