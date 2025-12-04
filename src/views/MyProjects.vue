<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading">Meus Projetos</h1>
        <p class="mt-2 text-body">Gerencie todos os seus projetos publicados</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#F5F5F5]">{{ stats.total }}</p>
              <p class="text-sm text-[#C7C7C7]">Total</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#F5F5F5]">{{ stats.open }}</p>
              <p class="text-sm text-[#C7C7C7]">Abertos</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#F5F5F5]">{{ stats.in_progress }}</p>
              <p class="text-sm text-[#C7C7C7]">Em Andamento</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-[#F5F5F5]">{{ stats.completed }}</p>
              <p class="text-sm text-[#C7C7C7]">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-[#161821] rounded-lg shadow-lg p-6 mb-6 border border-[rgba(212,175,55,0.24)]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-[#C7C7C7] mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#C7C7C7] mb-2">Categoria</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-[#C7C7C7] mb-2">Ordenar Por</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="created_at_asc">Mais Antigos</option>
              <option value="budget_desc">Maior Orçamento</option>
              <option value="budget_asc">Menor Orçamento</option>
              <option value="bids_desc">Mais Propostas</option>
            </select>
          </div>
        </div>
        
        <div v-if="hasActiveFilters" class="mt-4">
          <button
            @click="clearFilters"
            class="text-sm text-[#D4AF37] hover:text-[#E5C04A] font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        <p class="mt-4 text-[#C7C7C7]">Carregando projetos...</p>
      </div>

      <div v-else-if="error" class="bg-[#161821] rounded-lg shadow-lg p-8 text-center border border-[rgba(212,175,55,0.24)]">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-[#F5F5F5]">Erro ao carregar projetos</h3>
        <p class="mt-2 text-sm text-[#C7C7C7]">{{ error }}</p>
        <button
          @click="loadProjects"
          class="mt-6 px-4 py-2 bg-[#D4AF37] text-[#0F1117] font-semibold rounded-md hover:bg-[#E5C04A]"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="bg-[#161821] rounded-lg shadow-lg p-12 text-center border border-[rgba(212,175,55,0.24)]">
        <svg class="mx-auto h-12 w-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-[#F5F5F5]">Nenhum projeto encontrado</h3>
        <p class="mt-2 text-sm text-[#C7C7C7]">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você ainda não criou nenhum projeto.' }}
        </p>
        <div class="mt-6">
          <router-link
            to="/create-project"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Criar Novo Projeto
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-surface rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-semibold text-heading">{{ project.title }}</h3>
                  <StatusBadge :status="project.status" />
                </div>
                <p class="text-body text-sm mb-4 line-clamp-2">{{ project.description }}</p>
                
                <div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ getCategoryLabel(project.category) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatCurrency(project.budget) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    {{ project.bid_count || 0 }} propostas
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(project.created_at) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
              <router-link
                :to="`/projects/${project.id}`"
                class="px-4 py-2 text-sm font-medium text-body bg-surface border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Ver Detalhes
              </router-link>
              <button
                v-if="project.status === 'open'"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Ver Propostas ({{ project.bid_count || 0 }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Pagination from '@/components/ui/Pagination.vue'
import projectService from '@/services/projectService'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const authStore = useAuthStore()

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const filters = ref({
  status: '',
  category: '',
  sortBy: 'created_at_desc'
})

const categories = projectService.getCategories()

const stats = computed(() => {
  return {
    total: projects.value.length,
    open: projects.value.filter(p => p.status === 'open').length,
    in_progress: projects.value.filter(p => p.status === 'in_progress').length,
    completed: projects.value.filter(p => p.status === 'completed').length
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.category !== ''
})

const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  // Apply filters
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'created_at_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'created_at_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'budget_desc':
        return (b.budget || 0) - (a.budget || 0)
      case 'budget_asc':
        return (a.budget || 0) - (b.budget || 0)
      case 'bids_desc':
        return (b.bid_count || 0) - (a.bid_count || 0)
      default:
        return 0
    }
  })
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = [...projects.value]
  
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  
  return Math.ceil(result.length / itemsPerPage)
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getCategoryLabel = (value) => {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const clearFilters = () => {
  filters.value = {
    status: '',
    category: '',
    sortBy: 'created_at_desc'
  }
  currentPage.value = 1
}

const loadProjects = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await projectService.getMyProjects()
    
    if (result.success) {
      projects.value = result.data.projects || []
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading projects:', err)
    error.value = 'Erro ao carregar projetos'
  } finally {
    isLoading.value = false
  }
}

// Reset to page 1 when filters change
watch(() => [filters.value.status, filters.value.category], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadProjects()
})
</script>


