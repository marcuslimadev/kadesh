import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

const STORAGE_KEY = 'kadesh_theme'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  } catch (error) {
    console.warn('Não foi possível restaurar o tema salvo:', error)
    return 'light'
  }
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(getInitialTheme())

  const isDark = computed(() => currentTheme.value === 'dark')
  const isLight = computed(() => currentTheme.value === 'light')

  const persist = (theme) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Não foi possível salvar o tema selecionado:', error)
    }
  }

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.remove('theme-dark', 'theme-light')
    root.classList.add(`theme-${currentTheme.value}`)
  }

  const setTheme = (theme) => {
    currentTheme.value = theme === 'dark' ? 'dark' : 'light'
    persist(currentTheme.value)
  }

  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  watchEffect(() => {
    applyTheme()
  })

  return {
    currentTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    applyTheme
  }
})
