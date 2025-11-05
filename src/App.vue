<template>
  <div :style="{'font-family': 'var(--font-family-sans)'}">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <nav class="container mx-auto px-4 flex justify-between items-center h-16">
        <router-link to="/" class="font-bold text-xl" :style="{'color': 'var(--color-primary-600)'}">KADESH</router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6">
          <router-link to="/projects" class="text-gray-600 hover:text-black">Leilões</router-link>
          <div v-if="!isLoggedIn" class="flex items-center gap-2">
            <router-link to="/login" class="btn-secondary">Entrar</router-link>
            <router-link to="/register" class="btn-primary">Participar</router-link>
          </div>
          <div v-else class="relative">
            <button @click="toggleUserMenu" class="flex items-center gap-2">
              <span class="font-semibold">{{ userName }}</span>
            </button>
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sair</button>
            </div>
          </div>
        </div>

        <!-- Mobile Nav Button -->
        <button @click="toggleMobileMenu" class="md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </nav>
    </header>

    <!-- Mobile Menu Overlay -->
    <div v-if="showMobileMenu" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeMobileMenu"></div>
    <div :class="['fixed top-0 right-0 h-full bg-white w-64 shadow-lg z-50 transform transition-transform', showMobileMenu ? 'translate-x-0' : 'translate-x-full']">
      <div class="p-4">
        <router-link to="/projects" class="block py-2 text-gray-700" @click="closeMobileMenu">Leilões</router-link>
        <div v-if="!isLoggedIn" class="mt-4">
          <router-link to="/login" class="block w-full text-center py-2 btn-secondary" @click="closeMobileMenu">Entrar</router-link>
          <router-link to="/register" class="block w-full text-center mt-2 py-2 btn-primary" @click="closeMobileMenu">Participar</router-link>
        </div>
        <div v-else class="mt-4 border-t pt-4">
          <router-link to="/dashboard" class="block py-2 text-gray-700" @click="closeMobileMenu">Dashboard</router-link>
          <button @click="handleLogout" class="block w-full text-left mt-2 py-2 text-red-600" @click="closeMobileMenu">Sair</button>
        </div>
      </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from './services/api'

const store = ref({ user: null })
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const router = useRouter()

const isLoggedIn = computed(() => !!store.value.user)
const userName = computed(() => store.value.user?.name || '')

async function checkAuth() {
  try {
    const { data } = await api.get('/api/user')
    store.value.user = data.user
  } catch {
    store.value.user = null
  }
}

onMounted(checkAuth)

function toggleUserMenu() { showUserMenu.value = !showUserMenu.value }
function toggleMobileMenu() { showMobileMenu.value = !showMobileMenu.value }
function closeMobileMenu() { showMobileMenu.value = false }

async function handleLogout() {
  await api.post('/api/logout')
  store.value.user = null
  router.push('/')
}
</script>
