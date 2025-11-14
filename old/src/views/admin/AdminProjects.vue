<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gerenciar Projetos</h1>
          <p class="text-gray-600 mt-2">{{ filteredProjects.length }} projetos encontrados</p>
        </div>
      </div>

      <LoadingScreen :show="loading" message="Carregando projetos..." icon="📁" />

      <!-- Filtros -->
      <div v-if="!loading" class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Título do projeto..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">
              <i class="fas fa-undo mr-2"></i>Limpar
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Projetos -->
      <div v-if="!loading" class="space-y-4">
        <div v-for="project in paginatedProjects" :key="project.id" 
             class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ project.title }}</h3>
                <span :class="{
                  'bg-green-100 text-green-800': project.status === 'open',
                  'bg-blue-100 text-blue-800': project.status === 'in_progress',
                  'bg-gray-100 text-gray-800': project.status === 'completed',
                  'bg-red-100 text-red-800': project.status === 'cancelled'
                }" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStatusLabel(project.status) }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ project.description }}</p>
              
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span><i class="fas fa-user text-blue-500"></i> {{ project.contractor_name || 'N/A' }}</span>
                <span><i class="fas fa-comments text-green-500"></i> {{ project.bids_count || 0 }} lances</span>
                <span><i class="fas fa-calendar text-purple-500"></i> {{ formatDate(project.created_at) }}</span>
                <span><i class="fas fa-dollar-sign text-yellow-500"></i> R$ {{ formatMoney(project.min_budget) }} - R$ {{ formatMoney(project.max_budget) }}</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 ml-4">
              <button @click="viewProject(project)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                <i class="fas fa-eye mr-2"></i>Ver Detalhes
              </button>
              <button v-if="project.status === 'open'" @click="closeProject(project)" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium">
                <i class="fas fa-times-circle mr-2"></i>Fechar
              </button>
              <button @click="deleteProject(project)" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
                <i class="fas fa-trash mr-2"></i>Excluir
              </button>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div class="bg-white rounded-lg shadow px-6 py-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * perPage + 1 }} até {{ Math.min(currentPage * perPage, filteredProjects.length) }} de {{ filteredProjects.length }} projetos
          </div>
          <div class="flex gap-2">
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>
            <button 
              @click="currentPage++" 
              :disabled="currentPage * perPage >= filteredProjects.length"
              class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const loading = ref(false)
const projects = ref([])
const filters = ref({ search: '', status: '' })
const currentPage = ref(1)
const perPage = 10

const fetchProjects = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/projects', { withCredentials: true })
    projects.value = res.data.projects || res.data || []
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
  } finally {
    loading.value = false
  }
}

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchSearch = !filters.value.search || 
      project.title?.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchStatus = !filters.value.status || project.status === filters.value.status
    return matchSearch && matchStatus
  })
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProjects.value.slice(start, start + perPage)
})

const resetFilters = () => {
  filters.value = { search: '', status: '' }
  currentPage.value = 1
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const viewProject = (project) => {
  window.open(`/auction/${project.id}`, '_blank')
}

const closeProject = async (project) => {
  if (confirm(`Tem certeza que deseja fechar o projeto "${project.title}"?`)) {
    try {
      await axios.post(`/api/admin/projects/${project.id}/close`, {}, { withCredentials: true })
      alert('Projeto fechado com sucesso')
      fetchProjects()
    } catch (error) {
      alert('Erro ao fechar projeto')
    }
  }
}

const deleteProject = async (project) => {
  if (confirm(`ATENÇÃO: Tem certeza que deseja EXCLUIR o projeto "${project.title}"? Esta ação não pode ser desfeita.`)) {
    try {
      await axios.delete(`/api/admin/projects/${project.id}`, { withCredentials: true })
      alert('Projeto excluído com sucesso')
      fetchProjects()
    } catch (error) {
      alert('Erro ao excluir projeto')
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatMoney = (value) => {
  return parseFloat(value || 0).toFixed(2).replace('.', ',')
}

onMounted(() => {
  fetchProjects()
})
</script>
