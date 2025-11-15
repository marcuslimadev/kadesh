<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, {{ authStore.user?.name || 'Usuário' }}!
        </h1>
        <p class="text-gray-600">
          {{ authStore.isClient ? 'Gerencie seus projetos e propostas' : 'Encontre novos projetos e envie propostas' }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ authStore.isClient ? 'Projetos Ativos' : 'Propostas Enviadas' }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.active }}</p>
            </div>
            <div class="bg-primary-100 rounded-full p-3">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ authStore.isClient ? 'Propostas Recebidas' : 'Propostas Aceitas' }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.bids }}</p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Concluídos</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.completed }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Saldo Carteira</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(stats.balance) }}</p>
            </div>
            <div class="bg-yellow-100 rounded-full p-3">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            v-if="authStore.isClient"
            to="/projects/create"
            class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div class="bg-primary-600 rounded-lg p-2 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Criar Projeto</p>
              <p class="text-sm text-gray-600">Publique um novo projeto</p>
            </div>
          </router-link>

          <router-link
            to="/projects"
            class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div class="bg-primary-600 rounded-lg p-2 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ authStore.isClient ? 'Ver Todos Projetos' : 'Buscar Projetos' }}</p>
              <p class="text-sm text-gray-600">{{ authStore.isClient ? 'Gerencie seus projetos' : 'Encontre novas oportunidades' }}</p>
            </div>
          </router-link>

          <router-link
            to="/wallet"
            class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div class="bg-primary-600 rounded-lg p-2 mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Carteira</p>
              <p class="text-sm text-gray-600">Gerencie seus pagamentos</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Recent Projects -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ authStore.isClient ? 'Meus Projetos Recentes' : 'Projetos Recentes' }}
          </h2>
          <router-link
            :to="authStore.isClient ? '/my-projects' : '/projects'"
            class="text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Ver todos →
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>

        <!-- Projects List -->
        <div v-else-if="recentProjects.length > 0" class="space-y-4">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <router-link
                  :to="`/projects/${project.id}`"
                  class="text-lg font-medium text-gray-900 hover:text-primary-600"
                >
                  {{ project.title }}
                </router-link>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ project.description }}</p>
                <div class="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ getCategoryLabel(project.category) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    {{ project.bid_count || 0 }} propostas
                  </span>
                </div>
              </div>
              <div class="ml-4 text-right">
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(project.budget) }}</p>
                <StatusBadge :status="project.status" class="mt-2" />
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-4 text-sm text-gray-600">
            {{ authStore.isClient ? 'Você ainda não criou nenhum projeto' : 'Nenhum projeto disponível no momento' }}
          </p>
          <router-link
            v-if="authStore.isClient"
            to="/projects/create"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Criar Primeiro Projeto
          </router-link>
          <router-link
            v-else
            to="/projects"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Explorar Projetos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import projectService from '@/services/projectService'

const authStore = useAuthStore()
const projectsStore = useProjectsStore()

const stats = reactive({
  active: 0,
  bids: 0,
  completed: 0,
  balance: 0
})

const recentProjects = ref([])
const isLoading = ref(false)

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getCategoryLabel = (value) => {
  const categories = projectService.getCategories()
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const loadDashboardData = async () => {
  isLoading.value = true
  
  try {
    // Load recent projects
    const result = await projectService.getProjects({
      limit: 5,
      status: 'open'
    })
    
    if (result.success) {
      recentProjects.value = result.data.projects || []
    }

    // TODO: Load actual stats from API
    // For now, using mock data
    stats.active = 3
    stats.bids = 12
    stats.completed = 8
    stats.balance = 2500.00
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
