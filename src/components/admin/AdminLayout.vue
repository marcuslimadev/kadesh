<template>
  <div class="admin-layout">
    <!-- Navbar -->
    <nav class="admin-navbar">
      <div class="admin-navbar-container">
        <div class="admin-navbar-left">
          <router-link to="/admin/dashboard" class="admin-logo">
            <svg class="admin-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="admin-logo-text">Kadesh Admin</span>
          </router-link>

          <!-- Desktop Menu -->
          <div class="admin-menu-desktop">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="admin-menu-item"
              :class="{ 'active': isActive(item.path) }"
            >
              <component :is="item.icon" class="admin-menu-icon" />
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </div>

        <div class="admin-navbar-right">
          <!-- User Menu -->
          <div class="admin-user-menu">
            <button @click="toggleUserMenu" class="admin-user-button">
              <div class="admin-user-avatar">
                {{ userInitials }}
              </div>
              <span class="admin-user-name">{{ userName }}</span>
              <svg class="admin-user-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div v-if="showUserMenu" class="admin-user-dropdown">
                <div class="admin-user-info">
                  <p class="admin-user-info-name">{{ userName }}</p>
                  <p class="admin-user-info-email">{{ userEmail }}</p>
                </div>
                <div class="admin-user-actions">
                  <router-link to="/admin/profile" class="admin-dropdown-item">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Perfil
                  </router-link>
                  <router-link to="/admin/settings" class="admin-dropdown-item">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Configurações
                  </router-link>
                  <button @click="handleLogout" class="admin-dropdown-item admin-dropdown-item-danger">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="admin-mobile-menu-button">
            <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="mobile-menu">
        <div v-if="showMobileMenu" class="admin-menu-mobile">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="admin-menu-mobile-item"
            :class="{ 'active': isActive(item.path) }"
            @click="closeMobileMenu"
          >
            <component :is="item.icon" class="admin-menu-icon" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </Transition>
    </nav>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-container">
        <!-- Page Header (if provided via slot) -->
        <header v-if="$slots.header" class="admin-page-header">
          <slot name="header"></slot>
        </header>

        <!-- Default Content -->
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

// User data (from localStorage or props)
const userName = ref('Administrador')
const userEmail = ref('admin@kadesh.local')

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Menu items
const menuItems = ref([
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: 'IconDashboard'
  },
  {
    path: '/admin/users',
    label: 'Usuários',
    icon: 'IconUsers'
  },
  {
    path: '/admin/projects',
    label: 'Projetos',
    icon: 'IconProjects'
  },
  {
    path: '/admin/payments',
    label: 'Pagamentos',
    icon: 'IconPayments'
  },
  {
    path: '/admin/disputes',
    label: 'Disputas',
    icon: 'IconDisputes'
  },
  {
    path: '/admin/advertisements',
    label: 'Anúncios',
    icon: 'IconAdvertisements'
  },
  {
    path: '/admin/settings',
    label: 'Configurações',
    icon: 'IconSettings'
  }
])

// Icon components (simplified SVG components)
const IconDashboard = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
}

const IconUsers = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
}

const IconProjects = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`
}

const IconPayments = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>`
}

const IconDisputes = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`
}

const IconAdvertisements = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>`
}

const IconSettings = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
}

// Methods
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.admin-user-menu')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Load user data from localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')
  if (adminUser.name) userName.value = adminUser.name
  if (adminUser.email) userEmail.value = adminUser.email
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Import Design System */
@import '@/assets/admin-design-system.css';

.admin-layout {
  min-height: 100vh;
  background: var(--admin-bg-page);
}

/* ============================================
   NAVBAR
   ============================================ */
.admin-navbar {
  background: var(--admin-bg-navbar);
  border-bottom: 1px solid var(--admin-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--admin-shadow-sm);
}

.admin-navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-navbar-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.admin-navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Logo */
.admin-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--admin-primary);
  font-weight: 800;
  font-size: 1.25rem;
  transition: var(--admin-transition);
}

.admin-logo:hover {
  transform: scale(1.05);
}

.admin-logo-icon {
  width: 32px;
  height: 32px;
}

.admin-logo-text {
  display: none;
}

@media (min-width: 640px) {
  .admin-logo-text {
    display: block;
  }
}

/* Desktop Menu */
.admin-menu-desktop {
  display: none;
  gap: 0.5rem;
}

@media (min-width: 1024px) {
  .admin-menu-desktop {
    display: flex;
  }
}

.admin-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--admin-radius);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--admin-text-secondary);
  text-decoration: none;
  transition: var(--admin-transition);
}

.admin-menu-item:hover {
  background: var(--admin-gray-100);
  color: var(--admin-text-primary);
}

.admin-menu-item.active {
  background: var(--admin-primary-bg);
  color: var(--admin-primary);
}

.admin-menu-icon {
  width: 20px;
  height: 20px;
}

/* User Menu */
.admin-user-menu {
  position: relative;
}

.admin-user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: var(--admin-radius);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: var(--admin-transition);
}

.admin-user-button:hover {
  background: var(--admin-gray-100);
}

.admin-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--admin-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.admin-user-name {
  display: none;
  font-weight: 600;
  color: var(--admin-text-primary);
  font-size: 0.875rem;
}

@media (min-width: 640px) {
  .admin-user-name {
    display: block;
  }
}

.admin-user-arrow {
  width: 16px;
  height: 16px;
  color: var(--admin-text-secondary);
}

/* User Dropdown */
.admin-user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: var(--admin-radius-md);
  box-shadow: var(--admin-shadow-lg);
  min-width: 240px;
  overflow: hidden;
}

.admin-user-info {
  padding: 1rem;
  border-bottom: 1px solid var(--admin-border);
}

.admin-user-info-name {
  font-weight: 600;
  color: var(--admin-text-primary);
  margin: 0 0 0.25rem;
}

.admin-user-info-email {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  margin: 0;
}

.admin-user-actions {
  padding: 0.5rem;
}

.admin-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--admin-radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--admin-text-primary);
  text-decoration: none;
  transition: var(--admin-transition);
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.admin-dropdown-item:hover {
  background: var(--admin-gray-100);
}

.admin-dropdown-item-danger {
  color: var(--admin-danger);
}

.admin-dropdown-item-danger:hover {
  background: var(--admin-danger-bg);
}

/* Mobile Menu Button */
.admin-mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--admin-radius);
  border: none;
  background: transparent;
  color: var(--admin-text-primary);
  cursor: pointer;
  transition: var(--admin-transition);
}

.admin-mobile-menu-button:hover {
  background: var(--admin-gray-100);
}

@media (min-width: 1024px) {
  .admin-mobile-menu-button {
    display: none;
  }
}

/* Mobile Menu */
.admin-menu-mobile {
  border-top: 1px solid var(--admin-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-menu-mobile-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--admin-radius);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--admin-text-secondary);
  text-decoration: none;
  transition: var(--admin-transition);
}

.admin-menu-mobile-item:hover {
  background: var(--admin-gray-100);
  color: var(--admin-text-primary);
}

.admin-menu-mobile-item.active {
  background: var(--admin-primary-bg);
  color: var(--admin-primary);
}

/* Main Content */
.admin-main {
  padding: 2rem 0;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.admin-page-header {
  margin-bottom: 2rem;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>

