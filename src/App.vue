<template>
  <div id="app" :class="appClasses">
    <!-- Loading overlay -->
    <div 
      v-if="isInitializing" 
      class="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>

    <!-- Main app content -->
    <template v-else>
      <NavBar v-if="showNavigation" />
      
      <!-- Indicador de modo fixo (visível quando sidebar está escondida) -->
      <ModeIndicator v-if="showNavigation" />
      
      <main :class="mainClasses">
        <router-view />
      </main>
      
      <Footer v-if="showNavigation" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useSidebarStore } from '@/stores/sidebarStore'
import { wakeUpServer } from '@/services/api'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import ModeIndicator from '@/components/ui/ModeIndicator.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()

const isInitializing = ref(true)
const INITIALIZATION_FALLBACK_MS = 2000

// Compute whether to show navigation
const showNavigation = computed(() => {
  const hideNavRoutes = ['login', 'register', 'forgot-password', 'reset-password']
  
  // Se está em rota de auth, não mostrar
  if (hideNavRoutes.includes(route.name)) {
    console.log('[App] Rota de auth - não mostrar nav:', route.name)
    return false
  }
  
  // Verifica se está autenticado usando o authStore
  // Usamos !!authStore.token para garantir que a UI apareça mesmo se a sessão
  // estiver sendo validada ou se houver desincronia no isSessionValid
  const currentToken = authStore.token && typeof authStore.token === 'object' && 'value' in authStore.token
    ? authStore.token.value
    : authStore.token
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('kadesh_token') : null
  const authenticated = !!(currentToken || storedToken)
  console.log('[App] showNavigation check:', {
    route: route.name,
    authenticated,
    hasToken: !!currentToken,
    hasUser: !!authStore.user
  })
  
  return authenticated
})

const mainClasses = computed(() => {
  if (!showNavigation.value) return 'app-main'
  const sidebarVisible = sidebarStore.isVisible && typeof sidebarStore.isVisible === 'object' && 'value' in sidebarStore.isVisible
    ? sidebarStore.isVisible.value
    : sidebarStore.isVisible

  return sidebarVisible ? 'app-main pt-16 md:pt-0 md:pl-64' : 'app-main pt-16 md:pt-0'
})

const appClasses = computed(() => [
  'min-h-screen app-shell',
  themeStore.isDark ? 'theme-dark' : 'theme-light'
])

const finishInitialization = () => {
  if (!isInitializing.value) return
  isInitializing.value = false
}

// Initialize app
onMounted(() => {
  const fallbackTimer = setTimeout(finishInitialization, INITIALIZATION_FALLBACK_MS)

  // Wake up the server early (handles Render cold start)
  wakeUpServer().catch(() => {
    // Silently ignore wake up failures
  })

  // Checa token de forma robusta (pode ser ref ou string)
  const currentToken = authStore.token && typeof authStore.token === 'object' && 'value' in authStore.token
    ? authStore.token.value
    : authStore.token

  const hasToken = currentToken || (typeof window !== 'undefined' && localStorage.getItem('kadesh_token'))

  if (!hasToken) {
    clearTimeout(fallbackTimer)
    finishInitialization()
    return
  }

  // Verifica token mas não bloqueia a UI se falhar (servidor pode estar lento)
  authStore
    .verifyToken()
    .catch((error) => {
      console.warn('App initialization: token verify falhou, mas mantendo sessão se token existir', error.message)
    })
    .finally(() => {
      clearTimeout(fallbackTimer)
      finishInitialization()
    })

  themeStore.applyTheme()
})
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--page-bg);
  color: var(--text-primary);
}

.app-shell {
  background: radial-gradient(circle at 10% 10%, rgba(212, 175, 55, 0.08), transparent 35%),
    radial-gradient(circle at 90% 20%, rgba(99, 102, 241, 0.12), transparent 30%),
    var(--page-bg);
  color: var(--text-primary);
}

.app-main {
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, transparent 18%), var(--page-bg);
}

/* Custom toast styles */
.custom-toast {
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.custom-toast-body {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 500;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
