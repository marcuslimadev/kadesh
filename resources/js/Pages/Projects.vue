<template>
  <Layout>
    <div class="min-h-screen bg-gray-50">
      <!-- Header Section -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Projetos</h1>
              <p class="mt-2 text-gray-600">Explore oportunidades de trabalho disponíveis</p>
            </div>
            <div class="mt-4 sm:mt-0">
              <Link href="/projects/create" 
                    class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Novo Projeto
              </Link>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                v-model="filters.search"
                @input="handleFilterChange"
                placeholder="Pesquisar projetos..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                v-model="filters.category"
                @change="handleFilterChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as categorias</option>
                <option value="development">Desenvolvimento</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="writing">Redação</option>
                <option value="other">Outros</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="filters.status"
                @change="handleFilterChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                <option value="open">Aberto</option>
                <option value="bidding">Em licitação</option>
                <option value="awarded">Atribuído</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Orçamento</label>
              <select
                v-model="filters.budget"
                @change="handleFilterChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Qualquer valor</option>
                <option value="0-1000">Até R$ 1.000</option>
                <option value="1000-5000">R$ 1.000 - R$ 5.000</option>
                <option value="5000-10000">R$ 5.000 - R$ 10.000</option>
                <option value="10000+">Acima de R$ 10.000</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="grid gap-6">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Carregando projetos...</p>
          </div>

          <div v-else-if="projects.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum projeto encontrado</h3>
            <p class="mt-2 text-gray-500">Tente ajustar os filtros ou criar um novo projeto.</p>
          </div>

          <div v-else class="space-y-6">
            <div
              v-for="project in projects"
              :key="project.id"
              class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <h3 class="text-xl font-semibold text-gray-900">
                      <Link :href="`/projects/${project.id}`" class="hover:text-blue-600 transition-colors">
                        {{ project.title }}
                      </Link>
                    </h3>
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      project.status === 'open' ? 'bg-green-100 text-green-800' :
                      project.status === 'bidding' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'awarded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]">
                      {{ getStatusLabel(project.status) }}
                    </span>
                  </div>
                  
                  <p class="text-gray-600 mb-4 line-clamp-2">
                    {{ project.description }}
                  </p>

                  <div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      <span>Orçamento: R$ {{ formatMoney(project.budget) }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V9a4 4 0 018 0v6z"></path>
                      </svg>
                      <span>{{ project.bids_count || 0 }} propostas</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{{ formatDate(project.deadline) }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {{ getCategoryLabel(project.category) }}
                    </span>
                    <div v-if="project.skills" class="flex flex-wrap gap-1">
                      <span
                        v-for="skill in project.skills.slice(0, 3)"
                        :key="skill"
                        class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {{ skill }}
                      </span>
                      <span v-if="project.skills.length > 3" class="text-xs text-gray-500">
                        +{{ project.skills.length - 3 }} mais
                      </span>
                    </div>
                  </div>
                </div>

                <div class="ml-6 flex-shrink-0">
                  <Link :href="`/projects/${project.id}`"
                        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination && pagination.last_page > 1" class="flex justify-center mt-8">
            <nav class="flex items-center gap-2">
              <button
                v-if="pagination.current_page > 1"
                @click="loadPage(pagination.current_page - 1)"
                class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Anterior
              </button>
              
              <button
                v-for="page in getVisiblePages()"
                :key="page"
                @click="loadPage(page)"
                :class="[
                  'px-3 py-2 text-sm rounded-lg transition-colors',
                  page === pagination.current_page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                ]"
              >
                {{ page }}
              </button>

              <button
                v-if="pagination.current_page < pagination.last_page"
                @click="loadPage(pagination.current_page + 1)"
                class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import Layout from '../Components/Layout.vue'
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    default: () => ({})
  },
  filters: {
    type: Object,
    default: () => ({})
  }
})

const loading = ref(false)
const projects = ref(props.projects)
const pagination = ref(props.pagination)

const filters = reactive({
  search: props.filters.search || '',
  category: props.filters.category || '',
  status: props.filters.status || '',
  budget: props.filters.budget || ''
})

const handleFilterChange = () => {
  loading.value = true
  
  router.get('/projects', filters, {
    preserveState: true,
    onSuccess: (page) => {
      projects.value = page.props.projects
      pagination.value = page.props.pagination
      loading.value = false
    }
  })
}

const loadPage = (page) => {
  loading.value = true
  
  router.get('/projects', { ...filters, page }, {
    preserveState: true,
    onSuccess: (response) => {
      projects.value = response.props.projects
      pagination.value = response.props.pagination
      loading.value = false
    }
  })
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Aberto',
    bidding: 'Em licitação',
    awarded: 'Atribuído',
    completed: 'Concluído'
  }
  return labels[status] || status
}

const getCategoryLabel = (category) => {
  const labels = {
    development: 'Desenvolvimento',
    design: 'Design',
    marketing: 'Marketing',
    writing: 'Redação',
    other: 'Outros'
  }
  return labels[category] || category
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getVisiblePages = () => {
  const current = pagination.value.current_page
  const total = pagination.value.last_page
  const pages = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}
</script>