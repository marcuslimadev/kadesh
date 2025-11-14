<template>
  <nav class="bg-primary-900 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link to="/" class="flex items-center">
            <span class="text-2xl font-bold text-accent-500">⚡ KADESH</span>
          </router-link>
          
          <div class="hidden sm:ml-8 sm:flex sm:space-x-4" v-if="user">
            <router-link
              to="/dashboard"
              class="text-gray-300 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </router-link>
            <router-link
              to="/auctions"
              class="text-gray-300 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Leilões
            </router-link>
            <router-link
              v-if="user.user_type === 'provider'"
              to="/my-bids"
              class="text-gray-300 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Meus Lances
            </router-link>
            <router-link
              v-if="user.user_type === 'contractor'"
              to="/my-projects"
              class="text-gray-300 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Meus Projetos
            </router-link>
            <router-link
              to="/wallet"
              class="text-gray-300 hover:bg-primary-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Carteira
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div v-if="user" class="flex items-center space-x-4">
            <!-- Create Project Button (Contractor only) -->
            <router-link
              v-if="user.user_type === 'contractor'"
              to="/create-project"
              class="btn bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold text-sm"
            >
              ➕ Criar Projeto
            </router-link>
            
            <!-- Notification Bell -->
            <NotificationBell />
            
            <div class="text-right hidden sm:block">
              <div class="text-sm font-medium text-gray-200">{{ user.name }}</div>
              <div class="text-xs text-gray-400">
                {{ sessionInfo }}
              </div>
            </div>
            <button
              @click="handleLogout"
              class="btn btn-primary text-sm"
            >
              Sair
            </button>
          </div>
          <div v-else class="flex space-x-2">
            <router-link to="/login" class="btn btn-secondary text-sm">
              Entrar
            </router-link>
            <router-link to="/register" class="btn btn-primary text-sm">
              Registrar
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'
import NotificationBell from './NotificationBell.vue'

const { user, logout, getRemainingDays } = useAuth()
const router = useRouter()

const sessionInfo = computed(() => {
  const days = getRemainingDays()
  if (days === 0) return 'Sessão temporária'
  if (days === 1) return 'Expira em 1 dia'
  if (days <= 7) return `${days} dias restantes`
  return 'Sessão ativa'
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
