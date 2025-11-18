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
          <router-link to="/tutorial" class="text-gray-700 hover:text-blue-600 transition">
            Tutorial
          </router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/dashboard" class="text-gray-700 hover:text-blue-600 transition">
              Dashboard
            </router-link>
            <router-link to="/my-projects" class="text-gray-700 hover:text-blue-600 transition">
              Meus Projetos
            </router-link>
            <router-link to="/my-bids" class="text-gray-700 hover:text-blue-600 transition">
              Minhas Propostas
            </router-link>
            <router-link to="/wallet" class="text-gray-700 hover:text-blue-600 transition">
              Carteira
            </router-link>
            <router-link to="/contracts" class="text-gray-700 hover:text-blue-600 transition">
              Contratos
            </router-link>
            <router-link to="/notifications" class="relative text-gray-700 hover:text-blue-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </router-link>

            <!-- User Menu -->
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ userInitials }}
                </div>
                <span class="text-sm font-medium text-gray-700">{{ userName }}</span>
                <svg :class="['w-4 h-4 transition', userMenuOpen ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500">{{ user?.email }}</p>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  @click="userMenuOpen = false"
                >
                  Meu Perfil
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  @click="userMenuOpen = false"
                >
                  Configurações
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Sair
                </button>
              </div>
            </div>
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
        <router-link
          to="/tutorial"
          class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          @click="mobileMenuOpen = false"
        >
          Tutorial
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
          <router-link
            to="/my-bids"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Minhas Propostas
          </router-link>
          <router-link
            to="/wallet"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Carteira
          </router-link>
          <router-link
            to="/contracts"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Contratos
          </router-link>
          <router-link
            to="/notifications"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Notificações
          </router-link>
          <!-- User info in mobile menu -->
          <div class="px-3 py-2 border-b border-gray-200">
            <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>
          <router-link
            to="/profile"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Meu Perfil
          </router-link>
          <router-link
            to="/settings"
            class="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            @click="mobileMenuOpen = false"
          >
            Configurações
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
const userMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuário')
const userInitials = computed(() => authStore.userInitials)

const handleLogout = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  userMenuOpen.value = false
  router.push('/')
}
</script>
