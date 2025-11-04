<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-lg">
      <nav class="container-responsive">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link
            to="/"
            class="flex items-center gap-3 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white text-lg">K</span>
            </div>
            <span class="hidden sm:block">KADESH</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <router-link
              to="/projects"
              class="nav-link"
              :class="{ 'active': $route.path === '/projects' }"
            >
              Leilões
            </router-link>

            <!-- User Menu - Logged In -->
            <div v-if="isLoggedIn" class="relative nav-item">
              <button
                @click="toggleUserMenu"
                class="flex items-center gap-2 nav-link"
              >
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold text-sm">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="hidden lg:block">{{ userName }}</span>
                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="dropdown">
                <router-link to="/dashboard" class="dropdown-item">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
                  </svg>
                  Dashboard
                </router-link>

                <router-link v-if="userType === 'provider'" to="/profile" class="dropdown-item">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Meu Perfil
                </router-link>

                <button @click="handleLogout" class="dropdown-item w-full text-left text-danger-600 hover:text-danger-700">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sair
                </button>
              </div>
            </div>

            <!-- Login/Register - Not Logged In -->
            <div v-else class="flex items-center gap-3">
              <router-link to="/login" class="btn-ghost">
                Entrar
              </router-link>
              <router-link to="/register" class="btn-primary">
                Participar
              </router-link>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden border-t border-neutral-200 py-4 animate-slide-down">
          <div class="flex flex-col gap-4">
            <router-link
              to="/projects"
              class="nav-link justify-center"
              :class="{ 'active': $route.path === '/projects' }"
              @click="closeMobileMenu"
            >
              Leilões
            </router-link>

            <!-- Mobile User Menu -->
            <div v-if="isLoggedIn" class="border-t border-neutral-200 pt-4">
              <div class="flex items-center gap-3 mb-4 px-4 py-2 bg-neutral-50 rounded-lg">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold">{{ userInitials }}</span>
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">{{ userName }}</div>
                  <div class="text-sm text-neutral-600">{{ userTypeLabel }}</div>
                </div>
              </div>

              <router-link to="/dashboard" class="nav-link justify-center" @click="closeMobileMenu">
                Dashboard
              </router-link>

              <router-link v-if="userType === 'provider'" to="/profile" class="nav-link justify-center" @click="closeMobileMenu">
                Meu Perfil
              </router-link>

              <button @click="handleLogout" class="nav-link justify-center text-danger-600 hover:text-danger-700 w-full">
                Sair
              </button>
            </div>

            <!-- Mobile Auth -->
            <div v-else class="flex flex-col gap-3 border-t border-neutral-200 pt-4">
              <router-link to="/login" class="btn-ghost justify-center" @click="closeMobileMenu">
                Entrar
              </router-link>
              <router-link to="/register" class="btn-primary justify-center" @click="closeMobileMenu">
                Participar
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-neutral-900 text-neutral-300 mt-16">
      <div class="container-responsive py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="lg:col-span-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">K</span>
              </div>
              <span class="font-bold text-xl text-white">KADESH</span>
            </div>
            <p class="text-neutral-400 mb-4">
              Plataforma de leilão reverso para serviços de construção civil e manutenção.
            </p>
            <div class="flex gap-4">
              <a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Links Rápidos -->
          <div>
            <h3 class="font-semibold text-white mb-4">Plataforma</h3>
            <ul class="space-y-2">
              <li><router-link to="/projects" class="text-neutral-400 hover:text-white transition-colors duration-200">Leilões Ativos</router-link></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Como Funciona</a></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Preços</a></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Suporte</a></li>
            </ul>
          </div>

          <!-- Conta -->
          <div>
            <h3 class="font-semibold text-white mb-4">Conta</h3>
            <ul class="space-y-2">
              <li><router-link v-if="!isLoggedIn" to="/login" class="text-neutral-400 hover:text-white transition-colors duration-200">Entrar</router-link></li>
              <li><router-link v-if="!isLoggedIn" to="/register" class="text-neutral-400 hover:text-white transition-colors duration-200">Cadastrar</router-link></li>
              <li><router-link v-if="isLoggedIn" to="/dashboard" class="text-neutral-400 hover:text-white transition-colors duration-200">Dashboard</router-link></li>
              <li><router-link v-if="userType === 'provider'" to="/profile" class="text-neutral-400 hover:text-white transition-colors duration-200">Meu Perfil</router-link></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="font-semibold text-white mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Termos de Uso</a></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Privacidade</a></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Cookies</a></li>
              <li><a href="#" class="text-neutral-400 hover:text-white transition-colors duration-200">Contato</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-neutral-800 mt-8 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-neutral-400 text-sm">
              © {{ currentYear }} Kadesh Serviços. Todos os direitos reservados.
            </p>
            <p class="text-neutral-400 text-sm">
              Feito com <span class="text-red-500">♥</span> para conectar profissionais e contratantes
            </p>
          </div>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      v-if="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-40 btn-icon-primary shadow-hard animate-fade-in"
      aria-label="Voltar ao topo"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from './services/api'

// Global reactive state
const store = reactive({
  user: null,
})

// Local component state
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showBackToTop = ref(false)
const router = useRouter()

// Computed properties from store
const isLoggedIn = computed(() => !!store.user)
const userName = computed(() => store.user?.name || 'Usuário')
const userType = computed(() => store.user?.user_type || '')
const userInitials = computed(() => {
  const name = userName.value
  return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : ''
})
const userTypeLabel = computed(() => {
  const types = {
    contractor: 'Contratante',
    provider: 'Fornecedor',
    admin: 'Admin',
    both: 'Ambos'
  }
  return types[userType.value] || 'Usuário'
})
const currentYear = computed(() => new Date().getFullYear())

// Methods
async function checkAuth() {
  try {
    const { data } = await api.get('/api/user')
    store.user = data.user
  } catch (error) {
    store.user = null
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

async function handleLogout() {
  try {
    await api.post('/api/logout')
  } finally {
    store.user = null
    showUserMenu.value = false
    showMobileMenu.value = false
    router.push('/')
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

function handleClickOutside(event) {
  if (!event.target.closest('.nav-item')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkAuth()
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

