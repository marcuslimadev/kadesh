<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <LoadingScreen v-if="loading" />
    
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">📋 Meus Projetos</h1>
        <router-link to="/create-project" class="btn btn-primary">
          ➕ Criar Novo Projeto
        </router-link>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              :class="activeFilter === filter.id
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'"
            >
              {{ filter.label }}
              <span
                v-if="getFilterCount(filter.id) > 0"
                class="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
              >
                {{ getFilterCount(filter.id) }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="filteredProjects.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum projeto {{ getFilterLabel(activeFilter) }}</h3>
        <p class="text-gray-500 mb-6">Comece criando seu primeiro projeto!</p>
        <router-link to="/create-project" class="btn btn-primary">
          ➕ Criar Projeto
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="router.push(`/project/${project.id}`)"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ project.title }}</h3>
              <p class="text-gray-600 mb-3">{{ project.description }}</p>
              
              <div class="flex gap-3 flex-wrap">
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  📁 {{ project.category }}
                </span>
                <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  💰 R$ {{ formatMoney(project.min_budget) }} - R$ {{ formatMoney(project.max_budget) }}
                </span>
                <span class="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                  🎯 {{ project.total_bids || 0 }} lances
                </span>
              </div>
            </div>

            <span
              class="px-4 py-2 rounded-full text-sm font-bold"
              :class="getStatusClass(project.status)"
            >
              {{ getStatusLabel(project.status) }}
            </span>
          </div>

          <div class="flex justify-between items-center pt-4 border-t">
            <div class="text-sm text-gray-500">
              Criado em {{ formatDate(project.created_at) }}
            </div>
            
            <div class="flex gap-2">
              <button
                v-if="project.status === 'active'"
                @click.stop="viewBids(project.id)"
                class="btn btn-secondary text-sm"
              >
                Ver Lances ({{ project.total_bids || 0 }})
              </button>
              
              <button
                v-if="project.status === 'in_progress' || project.status === 'completed'"
                @click.stop="viewProject(project.id)"
                class="btn btn-primary text-sm"
              >
                Gerenciar →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const projects = ref([])
const loading = ref(true)
const activeFilter = ref('all')

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Leilão Ativo' },
  { id: 'in_progress', label: 'Em Andamento' },
  { id: 'completed', label: 'Concluídos' },
  { id: 'cancelled', label: 'Cancelados' }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') {
    return projects.value
  }
  return projects.value.filter(p => p.status === activeFilter.value)
})

const getFilterCount = (filterId) => {
  if (filterId === 'all') return projects.value.length
  return projects.value.filter(p => p.status === filterId).length
}

const getFilterLabel = (filterId) => {
  const filter = filters.find(f => f.id === filterId)
  return filter ? filter.label.toLowerCase() : ''
}

const fetchMyProjects = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/projects/my', {
      withCredentials: true
    })
    projects.value = response.data.projects || response.data || []
  } catch (err) {
    console.error('Erro ao carregar projetos:', err)
  } finally {
    loading.value = false
  }
}

const viewBids = (projectId) => {
  router.push(`/auction/${projectId}`)
}

const viewProject = (projectId) => {
  router.push(`/project/${projectId}`)
}

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    'active': 'Leilão Ativo',
    'in_progress': 'Em Andamento',
    'completed': 'Concluído',
    'cancelled': 'Cancelado'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

onMounted(() => {
  fetchMyProjects()
})
</script>
