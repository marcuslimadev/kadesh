<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading mb-2">Projetos Disponíveis</h1>
        <p class="text-body">Encontre oportunidades e faça propostas</p>
      </div>

      <!-- Filters and Search -->
      <div class="bg-surface rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-body mb-1">
              Buscar
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Digite palavras-chave..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              @input="debouncedSearch"
            />
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-body mb-1">
              Categoria
            </label>
            <select
              id="category"
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              @change="applyFilters"
            >
              <option value="">Todas</option>
              <option value="Desenvolvimento Web">Desenvolvimento Web</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Redação">Redação</option>
              <option value="Mobile">Mobile</option>
              <option value="Consultoria">Consultoria</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <!-- Budget Range -->
          <div>
            <label for="budget" class="block text-sm font-medium text-body mb-1">
              Orçamento
            </label>
            <select
              id="budget"
              v-model="filters.budgetRange"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="0-1000">Até R$ 1.000</option>
              <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
              <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
              <option value="10000-">Acima de R$ 10.000</option>
            </select>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2">
          <span class="text-sm text-body">Filtros ativos:</span>
          <button
            v-if="filters.search"
            @click="clearFilter('search')"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
          >
            Busca: "{{ filters.search }}"
            <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            v-if="filters.category"
            @click="clearFilter('category')"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
          >
            {{ filters.category }}
            <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            v-if="filters.budgetRange"
            @click="clearFilter('budgetRange')"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
          >
            Orçamento
            <svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            @click="clearAllFilters"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpar todos
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="bg-surface rounded-lg shadow-sm p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-heading">Nenhum projeto encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">Tente ajustar os filtros ou fazer uma nova busca.</p>
        <div class="mt-6">
          <button
            @click="clearAllFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="!isLoading && totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ProjectCard from '@/components/project/ProjectCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import projectService from '@/services/projectService'

const router = useRouter()
const route = useRoute()

const projects = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(12)

const filters = reactive({
  search: '',
  category: '',
  budgetRange: ''
})

let searchTimeout = null

const hasActiveFilters = computed(() => {
  return filters.search || filters.category || filters.budgetRange
})

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

const applyFilters = () => {
  currentPage.value = 1
  loadProjects()
}

const clearFilter = (filterName) => {
  filters[filterName] = ''
  applyFilters()
}

const clearAllFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.budgetRange = ''
  applyFilters()
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadProjects = async () => {
  isLoading.value = true

  try {
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      status: 'open'
    }

    if (filters.search) {
      params.search = filters.search
    }

    if (filters.category) {
      params.category = filters.category
    }

    if (filters.budgetRange) {
      const [min, max] = filters.budgetRange.split('-')
      if (min) params.budget_min = min
      if (max) params.budget_max = max
    }

    const result = await projectService.getProjects(params)

    if (result.success) {
      projects.value = result.data.projects || []
      totalPages.value = result.data.total_pages || 1
      currentPage.value = result.data.current_page || 1
    } else {
      projects.value = []
      totalPages.value = 1
    }
  } catch (error) {
    console.error('Error loading projects:', error)
    projects.value = []
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Load filters from query params if available
  if (route.query.search) filters.search = route.query.search
  if (route.query.category) filters.category = route.query.category
  if (route.query.budget) filters.budgetRange = route.query.budget
  if (route.query.page) currentPage.value = parseInt(route.query.page)

  loadProjects()
})
</script>
