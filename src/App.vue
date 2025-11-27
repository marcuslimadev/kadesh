<template>
  <div id="app" class="min-h-screen bg-gray-50">
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
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

const isInitializing = ref(true)
const INITIALIZATION_FALLBACK_MS = 2000

// Compute whether to show navigation
const showNavigation = computed(() => {
  const hideNavRoutes = ['login', 'register', 'forgot-password']
  return !hideNavRoutes.includes(route.name)
})

const mainClasses = computed(() => {
  if (!showNavigation.value) return ''
  return 'pt-16 md:pt-0 md:pl-64'
})

const finishInitialization = () => {
  if (!isInitializing.value) return
  isInitializing.value = false
}

// Initialize app
onMounted(() => {
  const fallbackTimer = setTimeout(finishInitialization, INITIALIZATION_FALLBACK_MS)

  if (!authStore.token) {
    clearTimeout(fallbackTimer)
    finishInitialization()
    return
  }

  authStore
    .verifyToken()
    .catch((error) => {
      console.error('App initialization error:', error)
    })
    .finally(() => {
      clearTimeout(fallbackTimer)
      finishInitialization()
    })
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
