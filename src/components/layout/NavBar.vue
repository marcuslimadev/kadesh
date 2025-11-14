<template>
  <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-blue-600">Kadesh</span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/projects" class="text-gray-700 hover:text-blue-600 transition">
            Projetos
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="text-gray-700 hover:text-blue-600 transition">
              Dashboard
            </router-link>
            <router-link to="/my-projects" class="text-gray-700 hover:text-blue-600 transition">
              Meus Projetos
            </router-link>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Sair
            </button>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Cadastrar
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link
          to="/projects"
          class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          @click="mobileMenuOpen = false"
        >
          Projetos
        </router-link>
        
        <template v-if="isAuthenticated">
          <router-link
            to="/dashboard"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </router-link>
          <router-link
            to="/my-projects"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Meus Projetos
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
          >
            Sair
          </button>
        </template>
        
        <template v-else>
          <router-link
            to="/login"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            @click="mobileMenuOpen = false"
          >
            Cadastrar
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogout = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/login')
}
</script>
