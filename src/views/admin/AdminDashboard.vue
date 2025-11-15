<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Kadesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link
                to="/admin/dashboard"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                :class="{ 'bg-gray-100': $route.path === '/admin/dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/admin/users"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Usuários
              </router-link>
              <router-link
                to="/admin/projects"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Projetos
              </router-link>
              <router-link
                to="/admin/payments"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Pagamentos
              </router-link>
              <router-link
                to="/admin/settings"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Configurações
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600 mr-4">{{ adminUser?.name }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Carregando estatísticas...</p>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Welcome Section -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Dashboard Administrativo</h2>
          <p class="mt-2 text-gray-600">Visão geral da plataforma Kadesh</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Users -->
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.users?.total || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ stats.users?.new_this_month || 0 }} novos este mês
                </p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-xs text-gray-600">
              <span class="font-medium">{{ stats.users?.clients || 0 }}</span> Clientes • 
              <span class="font-medium">{{ stats.users?.providers || 0 }}</span> Fornecedores
            </div>
          </div>

          <!-- Total Projects -->
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total de Projetos</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.projects?.total || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ stats.projects?.new_this_month || 0 }} novos este mês
                </p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-xs text-gray-600">
              <span class="font-medium">{{ stats.projects?.open || 0 }}</span> Abertos • 
              <span class="font-medium">{{ stats.projects?.in_progress || 0 }}</span> Em andamento
            </div>
          </div>

          <!-- Total Bids -->
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total de Propostas</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.bids?.total || 0 }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ stats.bids?.new_this_month || 0 }} novas este mês
                </p>
              </div>
              <div class="bg-purple-100 rounded-full p-3">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-xs text-gray-600">
              <span class="font-medium">{{ stats.bids?.pending || 0 }}</span> Pendentes • 
              <span class="font-medium">{{ stats.bids?.accepted || 0 }}</span> Aceitas
            </div>
          </div>

          <!-- Total Payments -->
          <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Volume de Pagamentos</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  R$ {{ formatCurrency(stats.payments?.total_amount || 0) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ stats.payments?.total || 0 }} transações
                </p>
              </div>
              <div class="bg-yellow-100 rounded-full p-3">
                <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4 text-xs text-gray-600">
              Taxas: <span class="font-medium">R$ {{ formatCurrency(stats.payments?.total_fees || 0) }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Users -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Usuários Recentes</h3>
            <div class="space-y-3">
              <div
                v-for="user in stats.recentUsers"
                :key="user.email"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="user.type === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                >
                  {{ user.type === 'client' ? 'Cliente' : 'Fornecedor' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Projetos Recentes</h3>
            <div class="space-y-3">
              <div
                v-for="project in stats.recentProjects"
                :key="project.id"
                class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ project.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">Por: {{ project.client_name }}</p>
                  </div>
                  <span class="text-sm font-bold text-green-600">
                    R$ {{ formatCurrency(project.budget) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const stats = ref({})
const adminUser = ref(null)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/stats/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    if (error.response?.status === 401) {
      toast.error('Sessão expirada. Faça login novamente.')
      router.push('/admin/login')
    } else {
      toast.error('Erro ao carregar estatísticas')
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  // Check if admin is logged in
  const storedAdmin = localStorage.getItem('adminUser')
  if (storedAdmin) {
    adminUser.value = JSON.parse(storedAdmin)
  }
  
  fetchDashboardStats()
})
</script>
