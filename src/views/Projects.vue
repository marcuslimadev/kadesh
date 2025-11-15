<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Projetos Disponíveis</h1>
        <p class="text-gray-600">Encontre projetos que combinam com suas habilidades</p>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Buscar projetos..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              @input="debouncedSearch"
            />
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              @change="applyFilters"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Budget Range -->
          <div>
            <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">
              Orçamento
            </label>
            <select
              id="budget"
              v-model="filters.budgetRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="0-1000">Até R$ 1.000</option>
              <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
              <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
              <option value="10000-99999999">Acima de R$ 10.000</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gray-600">Filtros ativos:</span>
          <button
            v-if="filters.category"
            @click="clearFilter('category')"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200"
          >
            {{ getCategoryLabel(filters.category) }}
            <svg class="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            v-if="filters.budgetRange"
            @click="clearFilter('budgetRange')"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200"
          >
            {{ getBudgetLabel(filters.budgetRange) }}
            <svg class="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            @click="clearAllFilters"
            class="text-xs text-primary-600 hover:text-primary-800 font-medium"
          >
            Limpar todos
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && projects.length === 0" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Carregando projetos...</p>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            v-for="project in projects" 
            :key="project.id" 
            :project="project"
          />
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total="totalProjects"
          :per-page="perPage"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow-md">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
        <p class="mt-2 text-sm text-gray-500">
          Tente ajustar seus filtros ou volte mais tarde para ver novos projetos.
        </p>
        <div class="mt-6">
          <button
            @click="clearAllFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/ui/ProjectCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import projectService from '@/services/projectService'

const projectsStore = useProjectsStore()

const filters = ref({
  search: '',
  category: '',
  budgetRange: '',
  status: 'open'
})

const currentPage = ref(1)
const perPage = ref(20)
const totalProjects = ref(0)
const projects = ref([])
const isLoading = ref(false)

const categories = projectService.getCategories()

let searchTimeout = null

const totalPages = computed(() => {
  return Math.ceil(totalProjects.value / perPage.value)
})

const hasActiveFilters = computed(() => {
  return filters.value.category || filters.value.budgetRange || filters.value.search
})

const getCategoryLabel = (value) => {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const getBudgetLabel = (range) => {
  const labels = {
    '0-1000': 'Até R$ 1.000',
    '1000-5000': 'R$ 1.000 - R$ 5.000',
    '5000-10000': 'R$ 5.000 - R$ 10.000',
    '10000-99999999': 'Acima de R$ 10.000'
  }
  return labels[range] || range
}

const loadProjects = async () => {
  isLoading.value = true
  
  try {
    const params = {
      limit: perPage.value,
      offset: (currentPage.value - 1) * perPage.value,
      status: filters.value.status
    }

    if (filters.value.search) {
      params.search = filters.value.search
    }

    if (filters.value.category) {
      params.category = filters.value.category
    }

    if (filters.value.budgetRange) {
      const [min, max] = filters.value.budgetRange.split('-')
      params.budget_min = parseInt(min)
      params.budget_max = parseInt(max)
    }

    const result = await projectService.getProjects(params)
    
    if (result.success) {
      projects.value = result.data.projects || []
      totalProjects.value = result.data.total || 0
    } else {
      console.error('Error loading projects:', result.error)
      projects.value = []
      totalProjects.value = 0
    }
  } catch (error) {
    console.error('Error loading projects:', error)
    projects.value = []
    totalProjects.value = 0
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadProjects()
}

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const clearFilter = (filterName) => {
  filters.value[filterName] = ''
  applyFilters()
}

const clearAllFilters = () => {
  filters.value.search = ''
  filters.value.category = ''
  filters.value.budgetRange = ''
  applyFilters()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadProjects()
})
</script>
