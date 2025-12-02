<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading mb-2">
          Olá, {{ userName }}! 👋
        </h1>
        <p class="text-body">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      <div class="mb-6 px-4 py-3 rounded-xl border border-theme bg-surface text-heading flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm font-medium">Os gráficos do dashboard aparecem automaticamente assim que houver dados cadastrados nos seus projetos e propostas.</p>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <router-link
          to="/lobby"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-200 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-sm font-semibold">🎯 Lobby</span>
        </router-link>

        <router-link
          v-if="viewMode.isContractor"
          to="/projects/create"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-200 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-700 transform hover:scale-105 animate-fade-in"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-semibold">Novo Projeto</span>
        </router-link>

        <router-link
          v-if="viewMode.isProvider"
          to="/my-bids"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-200 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-700 transform hover:scale-105 animate-fade-in"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text-sm font-semibold">Minhas Propostas</span>
        </router-link>

        <router-link
          to="/wallet"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-200 via-yellow-200 to-orange-200 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="text-sm font-semibold">Carteira</span>
        </router-link>

        <router-link
          to="/receipts"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm font-semibold">Comprovantes</span>
        </router-link>

        <router-link
          to="/contracts"
          class="flex items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100 text-amber-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm font-semibold">Contratos</span>
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Projects -->
          <div class="bg-surface rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-body">
                  {{ viewMode.isContractor ? 'Projetos Criados' : 'Projetos Ganhos' }}
                </p>
                <p class="text-3xl font-bold text-heading mt-2">
                  {{ stats.total_projects || 0 }}
                </p>
              </div>
              <div class="p-3 bg-primary-100 rounded-lg">
                <svg class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm text-gray-500">
                {{ stats.active_projects || 0 }} ativos
              </span>
            </div>
          </div>

          <!-- Bids/Proposals -->
          <div class="bg-surface rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-body">
                  {{ isClient ? 'Propostas Recebidas' : 'Propostas Enviadas' }}
                </p>
                <p class="text-3xl font-bold text-heading mt-2">
                  {{ stats.total_bids || 0 }}
                </p>
              </div>
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm text-gray-500">
                {{ stats.pending_bids || 0 }} pendentes
              </span>
            </div>
          </div>

          <!-- Earnings/Spent -->
          <div class="bg-surface rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-body">
                  {{ isClient ? 'Total Investido' : 'Total Ganho' }}
                </p>
                <p class="text-3xl font-bold text-heading mt-2">
                  {{ formatCurrency(stats.total_amount || 0) }}
                </p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-lg">
                <svg class="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm text-gray-500">
                Este mês: {{ formatCurrency(stats.monthly_amount || 0) }}
              </span>
            </div>
          </div>

          <!-- Rating (Provider only) / Success Rate -->
          <div class="bg-surface rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-body">
                  {{ isClient ? 'Taxa de Sucesso' : 'Avaliação' }}
                </p>
                <p class="text-3xl font-bold text-heading mt-2">
                  {{ isClient ? (stats.success_rate || 0) + '%' : (stats.rating || 0).toFixed(1) }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <svg class="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <span class="text-sm text-gray-500">
                {{ isClient ? stats.completed_projects || 0 : stats.total_reviews || 0 }} {{ isClient ? 'concluídos' : 'avaliações' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Projects -->
          <div class="bg-surface rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-heading">
                  {{ isClient ? 'Meus Projetos Recentes' : 'Projetos em Andamento' }}
                </h2>
                <router-link
                  :to="isClient ? '/my-projects' : '/projects'"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todos
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div v-if="recentProjects.length > 0" class="space-y-4">
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-1 min-w-0">
                    <router-link
                      :to="`/projects/${project.id}`"
                      class="text-sm font-medium text-heading hover:text-primary-600"
                    >
                      {{ project.title }}
                    </router-link>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ formatCurrency(project.budget) }} • {{ formatDate(project.created_at) }}
                    </p>
                  </div>
                  <StatusBadge :status="project.status" />
                </div>
              </div>
              <div v-else class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">Nenhum projeto ainda</p>
              </div>
            </div>
          </div>

          <!-- Recent Notifications -->
          <div class="bg-surface rounded-lg shadow-sm">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-heading">
                  Notificações Recentes
                </h2>
                <router-link
                  to="/notifications"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Ver todas
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div v-if="recentNotifications.length > 0" class="space-y-4">
                <div
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-heading">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">Nenhuma notificação</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 bg-surface rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-heading mb-4">Ações Rápidas</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              v-if="isClient"
              to="/create-project"
              class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="ml-3 text-sm font-medium text-body">Criar Novo Projeto</span>
            </router-link>

            <router-link
              to="/projects"
              class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span class="ml-3 text-sm font-medium text-body">Explorar Projetos</span>
            </router-link>

            <router-link
              to="/wallet"
              class="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span class="ml-3 text-sm font-medium text-body">Ver Carteira</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useViewModeStore } from '@/stores/viewModeStore'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/services/api'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const authStore = useAuthStore()
const viewMode = useViewModeStore()

const isLoading = ref(false)
const stats = ref({})
const recentProjects = ref([])
const recentNotifications = ref([])

const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'Usuário')

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), "dd 'de' MMM", { locale: ptBR })
}

const loadDashboardData = async () => {
  isLoading.value = true

  try {
    // Load stats
    const statsResponse = await api.get('/api/dashboard/stats')
    if (statsResponse.data?.stats) {
      stats.value = statsResponse.data.stats
    } else if (statsResponse.data) {
      stats.value = statsResponse.data
    }

    // Load recent projects
    const projectsResponse = await api.get('/api/projects/my-projects', {
      params: { limit: 5, sort: 'recent' }
    })
    if (projectsResponse.data?.projects) {
      recentProjects.value = projectsResponse.data.projects
    }

    // Load recent notifications
    const notificationsResponse = await api.get('/api/notifications', {
      params: { limit: 5, unread: false }
    })
    if (notificationsResponse.data?.notifications) {
      recentNotifications.value = notificationsResponse.data.notifications
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    // Set default values on error
    stats.value = {
      total_projects: 0,
      active_projects: 0,
      total_bids: 0,
      pending_bids: 0,
      total_amount: 0,
      monthly_amount: 0,
      rating: 0,
      success_rate: 0
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
/* Animação de fade-in para elementos que aparecem/desaparecem */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.7s ease-out forwards;
}

/* Transições suaves globais */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
