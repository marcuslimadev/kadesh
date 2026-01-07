<template>
  <header class="sticky top-0 z-50 bg-nav text-offwhite border-b border-gold/20 shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="h-16 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <router-link to="/" class="flex items-center gap-2">
            <img :src="logoImg" alt="Kaddesh" class="h-10 w-10 rounded-lg border border-gold/40 object-cover" />
            <div class="leading-tight hidden lg:block">
              <p class="text-sm text-gold font-semibold">KADDESH</p>
              <p class="text-xs text-offwhite-muted">Service Bridge</p>
            </div>
          </router-link>

          <nav class="hidden lg:flex items-center gap-1">
            <router-link
              v-for="link in mainNavLinks"
              :key="link.to"
              :to="link.to"
              :class="desktopLinkClasses(link.to)"
            >
              <svg class="h-4 w-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="iconPaths[link.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="text-sm">{{ link.label }}</span>
            </router-link>
            
            <div v-if="secondaryNavLinks.length > 0" class="relative" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
              <button class="nav-link nav-link-idle hidden md:inline-flex">
                <svg class="h-4 w-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-sm">Mais</span>
              </button>
              <transition name="dropdown">
                <div v-if="dropdownOpen" class="absolute top-full right-0 mt-1 w-48 bg-nav border border-gold/20 rounded-lg shadow-2xl overflow-hidden z-50">
                  <router-link
                    v-for="link in secondaryNavLinks"
                    :key="link.to"
                    :to="link.to"
                    class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-nav-link-idle-hover-bg transition-colors"
                    :class="isRouteActive(link.to) ? 'text-gold bg-nav-link-active-bg' : 'text-nav-link-idle-text'"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path :d="iconPaths[link.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ link.label }}
                  </router-link>
                </div>
              </transition>
            </div>
          </nav>
        </div>

        <div class="flex items-center gap-1.5">
          <ViewModeSwitch v-if="isAuthenticated" class="hidden lg:block" />

          <button
            class="p-2 rounded-full nav-ghost text-sm"
            @click="toggleTheme"
            :title="themeLabel"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="themeIcon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <router-link
            v-if="isAuthenticated && isAdmin"
            :to="adminLink.to"
            class="hidden lg:inline-flex nav-badge text-xs px-2 py-1"
          >
            Admin
          </router-link>

          <router-link
            v-if="isAuthenticated"
            :to="profileLink.to"
            class="hidden lg:inline-flex nav-ghost text-sm px-2 py-1"
          >
            Perfil
          </router-link>

          <button
            v-if="isAuthenticated"
            @click="handleLogout"
            class="hidden lg:inline-flex nav-ghost text-red-300 hover:text-red-200 text-sm px-2 py-1"
          >
            Sair
          </button>

          <div v-else class="hidden lg:flex items-center gap-1.5">
            <router-link to="/login" class="nav-ghost text-sm px-2 py-1">Entrar</router-link>
            <router-link to="/register" class="nav-badge text-xs px-2 py-1">Criar conta</router-link>
          </div>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2 rounded-md nav-ghost transition-all duration-200"
            aria-label="Abrir menu"
          >
            <svg class="h-6 w-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <transition name="fade">
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click.self="mobileMenuOpen = false">
      <div class="absolute top-0 right-0 w-72 h-full nav-drawer p-4 overflow-y-auto shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <router-link to="/" class="flex items-center gap-2">
            <img :src="logoImg" alt="Kaddesh" class="h-10 w-10 rounded-lg border border-gold/40 object-cover" />
            <div>
              <p class="text-sm font-semibold nav-text">KADDESH</p>
              <p class="text-xs nav-muted">Service Bridge</p>
            </div>
          </router-link>
          <button @click="mobileMenuOpen = false" class="p-2 rounded nav-close-btn">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4" v-if="isAuthenticated">
          <ViewModeSwitch variant="sidebar" />
        </div>

        <div class="mb-4">
          <button
            class="w-full flex items-center justify-between px-3 py-2 rounded-lg nav-theme-btn"
            @click="toggleTheme"
          >
            <span class="flex items-center gap-2">
              <svg class="h-5 w-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path :d="themeIcon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
              <span class="font-semibold nav-text">{{ themeLabel }}</span>
            </span>
            <span class="text-xs font-semibold nav-theme-chip">{{ themeStore.isDark ? '🌙' : '☀️' }}</span>
          </button>
        </div>

        <div class="space-y-2">
          <router-link
            v-for="link in allLinks"
            :key="link.to"
            :to="link.to"
            :class="mobileLinkClasses(link.to)"
            @click="handleNavigate(link.to)"
          >
            <svg class="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="iconPaths[link.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ link.label }}</span>
          </router-link>
        </div>

        <div v-if="isAuthenticated" class="mt-6 border-t pt-4 space-y-2">
          <router-link
            v-if="isAdmin"
            :to="adminLink.to"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold nav-danger"
            @click="handleNavigate(adminLink.to)"
          >
            <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="iconPaths[adminLink.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ adminLink.label }}</span>
          </router-link>
          <router-link
            :to="profileLink.to"
            :class="mobileLinkClasses(profileLink.to)"
            @click="handleNavigate(profileLink.to)"
          >
            <svg class="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="iconPaths[profileLink.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ profileLink.label }}</span>
          </router-link>
          <router-link
            :to="settingsLink.to"
            :class="mobileLinkClasses(settingsLink.to)"
            @click="handleNavigate(settingsLink.to)"
          >
            <svg class="h-5 w-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="iconPaths[settingsLink.icon] || iconPaths.target" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ settingsLink.label }}</span>
          </router-link>
          <button @click="handleLogout" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg nav-danger">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17l5-5-5-5M20 12H9m4 9H5a2 2 0 01-2-2V5a2 2 0 012-2h8" />
            </svg>
            Sair
          </button>
        </div>

        <div v-else class="mt-6 border-t pt-4 space-y-2">
          <router-link to="/login" class="nav-link">
            <span class="font-semibold">Entrar</span>
          </router-link>
          <router-link to="/register" class="nav-link nav-link-active">
            <span class="font-semibold">Criar conta</span>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import logoImg from '@/assets/logo.png'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ViewModeSwitch from '@/components/ViewModeSwitch.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const mobileMenuOpen = ref(false)
const dropdownOpen = ref(false)

const tokenRef = authStore.token
const isAuthenticated = computed(() => {
  const token = tokenRef && typeof tokenRef === 'object' && 'value' in tokenRef ? tokenRef.value : tokenRef
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('kadesh_token') : null
  const normalizedStored = storedToken && storedToken !== 'undefined' && storedToken !== 'null' ? storedToken : null
  return Boolean(token || normalizedStored)
})
const isAdmin = computed(() => {
  const raw = authStore.isAdmin
  return raw && typeof raw === 'object' && 'value' in raw ? raw.value : raw
})
const activePath = computed(() => router.currentRoute.value.path)
const themeLabel = computed(() => (themeStore.isDark ? 'Tema escuro' : 'Tema claro'))
const themeIcon = computed(() =>
  themeStore.isDark
    ? 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'
    : 'M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-7.364l-1.414 1.414M7.05 16.95l-1.414 1.414m0-12.728l1.414 1.414M16.95 16.95l1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z'
)

const iconPaths = {
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10zm0 3a2 2 0 110 4 2 2 0 010-4z',
  book: 'M4 6.5A2.5 2.5 0 016.5 4h9A2.5 2.5 0 0118 6.5v11a.5.5 0 01-.757.429L12 14.5l-5.243 3.429A.5.5 0 016 17.5v-11z',
  dashboard: 'M4 13h6v8H4v-8zm0-10h6v8H4V3zm10 10h6v8h-6v-8zm0-10h6v8h-6V3z',
  projects: 'M4 6h16M4 12h16M4 18h16',
  bids: 'M12 6v2m0 8v2m0-6a2 2 0 100-4 2 2 0 010 4zm0 8c-4.418 0-8-2.686-8-6 0-1.657 1.343-3 3-3h10c1.657 0 3 1.343 3 3 0 3.314-3.582 6-8 6z',
  contracts: 'M7 7h10M7 11h10M7 15h6m-1-10l-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7h-4z',
  wallet: 'M4 7h16v10H4z M4 11h12',
  receipts: 'M7 5h10v14l-2-1-2 1-2-1-2 1-2-1-2 1V5z M9 9h6m-6 4h6',
  bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  profile: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0',
  settings: 'M10.325 4.317l1.09-.63a1 1 0 011.09 0l1.09.63a1 1 0 00.98 0l1.26-.73a1 1 0 011.5.86v1.26a1 1 0 00.29.7l.9.9a1 1 0 010 1.41l-.9.9a1 1 0 00-.29.71v1.26a1 1 0 01-1.5.86l-1.26-.73a1 1 0 00-.98 0l-1.09.63a1 1 0 01-1.09 0l-1.09-.63a1 1 0 00-.98 0l-1.26.73a1 1 0 01-1.5-.86v-1.26a1 1 0 00-.29-.7l-.9-.9a1 1 0 010-1.41l.9-.9a1 1 0 00.29-.71v-1.26a1 1 0 011.5-.86l1.26.73a1 1 0 00.98 0z',
  admin: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
}

const baseLinks = [
  { to: '/lobby', label: 'Lobby', icon: 'target', auth: true },
  { to: '/tutorial', label: 'Tutorial', icon: 'book' },
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', auth: true }
]

const contractorLinks = [
  { to: '/projects', label: 'Projetos', icon: 'projects' },
  { to: '/my-projects', label: 'Meus Projetos', icon: 'projects' }
]

const providerLinks = [
  { to: '/my-bids', label: 'Minhas Propostas', icon: 'bids' },
  { to: '/contracts', label: 'Contratos', icon: 'contracts' }
]

const sharedLinks = [
  { to: '/wallet', label: 'Carteira', icon: 'wallet' },
  { to: '/receipts', label: 'Comprovantes', icon: 'receipts' },
  { to: '/notifications', label: 'Notificações', icon: 'bell' }
]

const profileLink = { to: '/profile', label: 'Meu Perfil', icon: 'profile' }
const settingsLink = { to: '/settings', label: 'Configurações', icon: 'settings' }
const adminLink = { to: '/admin/dashboard', label: 'Admin', icon: 'admin' }

const primaryLinks = computed(() => {
  if (!isAuthenticated.value) return baseLinks.filter(l => !l.auth)
  const links = [...baseLinks]
  if (authStore.isClient) links.push(...contractorLinks)
  if (authStore.isProvider) links.push(...providerLinks)
  return links
})

const secondaryLinks = computed(() => {
  if (!isAuthenticated.value) return []
  return sharedLinks
})

const allLinks = computed(() => {
  const list = [...baseLinks]
  if (isAuthenticated.value) {
    if (authStore.isClient) list.push(...contractorLinks)
    if (authStore.isProvider) list.push(...providerLinks)
    list.push(...sharedLinks)
  }
  return list
})

// Mostrar apenas links principais na navbar (max 4 links)
const mainNavLinks = computed(() => {
  if (!isAuthenticated.value) return baseLinks.filter(l => !l.auth).slice(0, 3)
  return primaryLinks.value.slice(0, 4)
})

// Links secundários vão para o dropdown
const secondaryNavLinks = computed(() => {
  if (!isAuthenticated.value) return []
  const main = primaryLinks.value.slice(0, 4)
  const remaining = primaryLinks.value.slice(4)
  return [...remaining, ...secondaryLinks.value]
})

const isRouteActive = (to) => {
  if (to === '/') return activePath.value === '/'
  return activePath.value === to || activePath.value.startsWith(`${to}/`)
}

const desktopLinkClasses = (to) => [
  'nav-link hidden md:inline-flex',
  isRouteActive(to) ? 'nav-link-active' : 'nav-link-idle'
]

const mobileLinkClasses = (to) => [
  'nav-link',
  isRouteActive(to) ? 'nav-link-active' : 'nav-link-idle'
]

const handleNavigate = (to) => {
  mobileMenuOpen.value = false
  router.push(to)
}

const handleLogout = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.bg-nav { background: var(--nav-bg); }
.text-offwhite { color: var(--nav-text); }
.text-offwhite-muted { color: var(--nav-muted); }
.text-gold { color: #d4af37; }
.border-gold\/20 { border-color: rgba(212,175,55,0.2); }
.border-gold\/40 { border-color: rgba(212,175,55,0.4); }

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}
.nav-link-idle {
  color: var(--nav-link-idle-text);
}
.nav-link-idle:hover {
  background: var(--nav-link-idle-hover-bg);
  color: var(--nav-text);
}
.nav-link-active {
  background: var(--nav-link-active-bg);
  color: var(--nav-link-active-text);
  border-color: var(--nav-border);
  box-shadow: var(--shadow-sm);
}

.nav-ghost {
  padding: 0.375rem 0.625rem;
  border-radius: 999px;
  font-weight: 600;
  color: var(--nav-link-idle-text);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.nav-ghost:hover {
  background: var(--nav-link-idle-hover-bg);
  color: var(--nav-text);
}

.nav-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  font-weight: 700;
  color: #0f1117;
  background: var(--accent);
  box-shadow: var(--shadow-gold);
  white-space: nowrap;
}

.nav-drawer {
  background: var(--nav-drawer-bg);
  color: var(--nav-text);
  border-left: 1px solid var(--nav-border);
  box-shadow: var(--shadow-lg);
}
.nav-text { color: var(--nav-text); }
.nav-muted { color: var(--nav-muted); }

.nav-close-btn {
  color: var(--nav-muted);
}
.nav-close-btn:hover {
  background: var(--nav-hover);
  color: var(--nav-text);
}

.nav-theme-btn {
  background: var(--nav-theme-bg);
  border: 1px solid var(--nav-theme-border);
  color: var(--nav-theme-text);
}
.nav-theme-btn:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-gold);
}

.nav-theme-chip {
  background: var(--nav-theme-chip-bg);
  color: var(--nav-theme-chip-text);
}

.nav-danger {
  background: var(--nav-danger-bg);
  color: var(--nav-danger-text);
  border: 1px solid rgba(239, 68, 68, 0.25);
  transition: all 0.2s ease;
}
.nav-danger:hover {
  background: var(--nav-danger-hover);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.15s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
