<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p class="text-gray-600 mt-2">Visão geral do sistema Kadesh</p>
      </div>

      <LoadingScreen :show="loading" message="Carregando dados..." icon="📊" />

      <!-- Stats Grid -->
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Usuários -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total Usuários</p>
              <p class="text-3xl font-bold mt-2">{{ stats.total_users || 0 }}</p>
              <p class="text-blue-100 text-xs mt-2">
                <span class="text-green-200">+{{ stats.new_users_this_month || 0 }}</span> este mês
              </p>
            </div>
            <i class="fas fa-users text-5xl opacity-20"></i>
          </div>
        </div>

        <!-- Projetos Ativos -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Projetos Ativos</p>
              <p class="text-3xl font-bold mt-2">{{ stats.active_projects || 0 }}</p>
              <p class="text-green-100 text-xs mt-2">
                {{ stats.total_projects || 0 }} total
              </p>
            </div>
            <i class="fas fa-briefcase text-5xl opacity-20"></i>
          </div>
        </div>

        <!-- Lances Hoje -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Lances Hoje</p>
              <p class="text-3xl font-bold mt-2">{{ stats.bids_today || 0 }}</p>
              <p class="text-purple-100 text-xs mt-2">
                {{ stats.total_bids || 0 }} total
              </p>
            </div>
            <i class="fas fa-gavel text-5xl opacity-20"></i>
          </div>
        </div>

        <!-- Receita Total -->
        <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-100 text-sm font-medium">Receita Total</p>
              <p class="text-3xl font-bold mt-2">R$ {{ formatMoney(stats.total_revenue || 0) }}</p>
              <p class="text-yellow-100 text-xs mt-2">
                Taxa 10% dos projetos
              </p>
            </div>
            <i class="fas fa-dollar-sign text-5xl opacity-20"></i>
          </div>
        </div>
      </div>

      <!-- Gráficos e Listas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Últimos Usuários -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-user-plus text-blue-500"></i>
            Últimos Usuários Cadastrados
          </h3>
          <div class="space-y-3">
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center justify-between py-3 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {{ user.name?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <div class="text-right">
                <span :class="user.user_type === 'contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ user.user_type === 'contractor' ? 'Contratante' : 'Fornecedor' }}
                </span>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
          </div>
          <router-link to="/admin/users" class="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
            Ver todos usuários →
          </router-link>
        </div>

        <!-- Últimos Projetos -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-project-diagram text-green-500"></i>
            Últimos Projetos Criados
          </h3>
          <div class="space-y-3">
            <div v-for="project in recentProjects" :key="project.id" class="py-3 border-b border-gray-100">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ project.title }}</h4>
                  <p class="text-sm text-gray-600 line-clamp-1 mt-1">{{ project.description }}</p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span><i class="fas fa-user"></i> {{ project.contractor_name }}</span>
                    <span><i class="fas fa-comments"></i> {{ project.bids_count || 0 }} lances</span>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="text-sm font-bold text-green-600">R$ {{ formatMoney(project.max_budget) }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(project.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          <router-link to="/admin/projects" class="block mt-4 text-center text-green-600 hover:text-green-700 font-medium text-sm">
            Ver todos projetos →
          </router-link>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link to="/admin/users" class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <i class="fas fa-users text-3xl text-blue-500 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Gerenciar Usuários</span>
          </router-link>
          
          <router-link to="/admin/projects" class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <i class="fas fa-project-diagram text-3xl text-green-500 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Gerenciar Projetos</span>
          </router-link>
          
          <router-link to="/admin/payments" class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
            <i class="fas fa-dollar-sign text-3xl text-yellow-500 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Pagamentos</span>
          </router-link>
          
          <router-link to="/admin/settings" class="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <i class="fas fa-cog text-3xl text-purple-500 mb-2"></i>
            <span class="text-sm font-medium text-gray-700">Configurações</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const loading = ref(false)
const stats = ref({})
const recentUsers = ref([])
const recentProjects = ref([])

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [statsRes, usersRes, projectsRes] = await Promise.all([
      axios.get('/api/admin/dashboard/stats', { withCredentials: true }),
      axios.get('/api/admin/users?limit=5', { withCredentials: true }),
      axios.get('/api/admin/projects?limit=5', { withCredentials: true })
    ])
    
    stats.value = statsRes.data
    recentUsers.value = usersRes.data.users || usersRes.data || []
    recentProjects.value = projectsRes.data.projects || projectsRes.data || []
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    if (error.response?.status === 403) {
      alert('Acesso negado. Apenas administradores podem acessar esta área.')
      router.push('/dashboard')
    }
  } finally {
    loading.value = false
  }
}

const formatMoney = (value) => {
  return parseFloat(value || 0).toFixed(2).replace('.', ',')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days} dias atrás`
  return date.toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchDashboardData()
})
</script>
