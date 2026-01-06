<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-amber-600">Kaddesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/disputes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Disputas</router-link>
              <router-link to="/admin/advertisements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Anúncios</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Gerenciar Projetos</h2>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              v-model="filters.search"
              @input="fetchProjects"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Titulo ou descricao..."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="filters.status" @change="fetchProjects" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select v-model="filters.category" @change="fetchProjects" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium">
              Limpar filtros
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
          <p class="mt-4 text-gray-600">Carregando projetos...</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratante</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orcamento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in projects" :key="project.id">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                  <div class="text-xs text-gray-500">{{ project.category || '-' }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ project.client_name || '-' }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusClass(project.status)">
                    {{ getStatusLabel(project.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatCurrency(project.budget) }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(project.created_at) }}</td>
              </tr>
            </tbody>
          </table>

          <div v-if="projects.length === 0" class="text-center py-12 text-gray-500">
            Nenhum projeto encontrado
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import projectService from '@/services/projectService'
import api from '@/services/api'
// import { useToast } from 'vue-toastification'

const router = useRouter()
// const toast = useToast()

const loading = ref(true)
const projects = ref([])
const filters = ref({ search: '', status: '', category: '' })
const categories = projectService.getCategories()
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('kadesh_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchProjects = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.limit,
      search: filters.value.search,
      status: filters.value.status,
      category: filters.value.category
    }
    const response = await api.get('/api/admin/projects', { params, headers: getAuthHeaders() })
    if (response.data.success) {
      projects.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching projects:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = { search: '', status: '', category: '' }
  pagination.value.page = 1
  fetchProjects()
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Aberto',
    in_progress: 'Em andamento',
    completed: 'Concluido',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  // toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  fetchProjects()
})
</script>
