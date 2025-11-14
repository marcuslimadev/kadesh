<template>
  <nav class="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Admin -->
        <div class="flex items-center gap-3">
          <img src="/assets/image/logo.png" alt="Kadesh Admin" class="h-10">
          <span class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">ADMIN</span>
        </div>

        <!-- Menu Principal -->
        <div class="hidden md:flex items-center gap-6">
          <router-link 
            to="/admin/dashboard" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-chart-line mr-2"></i>Dashboard
          </router-link>
          
          <router-link 
            to="/admin/users" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-users mr-2"></i>Usuários
          </router-link>
          
          <router-link 
            to="/admin/projects" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-project-diagram mr-2"></i>Projetos
          </router-link>
          
          <router-link 
            to="/admin/payments" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-dollar-sign mr-2"></i>Pagamentos
          </router-link>
          
          <router-link 
            to="/admin/disputes" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-balance-scale mr-2"></i>Disputas
          </router-link>
          
          <router-link 
            to="/admin/settings" 
            class="text-gray-300 hover:text-white font-medium transition-colors"
            active-class="text-white font-bold"
          >
            <i class="fas fa-cog mr-2"></i>Configurações
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center gap-4">
          <router-link 
            to="/dashboard" 
            class="text-gray-300 hover:text-white text-sm"
          >
            <i class="fas fa-home mr-2"></i>Voltar ao Site
          </router-link>
          
          <button 
            @click="handleLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>Sair
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>
