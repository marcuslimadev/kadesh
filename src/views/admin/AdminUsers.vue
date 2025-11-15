<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Include the same navigation as AdminDashboard -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Kadesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100" :class="{ 'bg-gray-100': $route.path === '/admin/users' }">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-600 mr-4">{{ adminUser?.name }}</span>
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-gray-900">Gerenciar Usuários</h2>
        <p class="mt-2 text-gray-600">Visualize e gerencie todos os usuários da plataforma</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input v-model="filters.search" @input="fetchUsers" type="text" placeholder="Nome ou email..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select v-model="filters.type" @change="fetchUsers" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="client">Clientes</option>
              <option value="provider">Fornecedores</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status" @change="fetchUsers" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="suspended">Suspenso</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">Limpar Filtros</button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <div v-else>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="user.type === 'client' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'">
                    {{ user.type === 'client' ? 'Cliente' : 'Fornecedor' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(user.status)">
                    {{ getStatusLabel(user.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.location || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button @click="viewUser(user.id)" class="text-blue-600 hover:text-blue-800 mr-3">Ver</button>
                  <button @click="toggleUserStatus(user)" class="text-yellow-600 hover:text-yellow-800 mr-3">
                    {{ user.status === 'active' ? 'Suspender' : 'Ativar' }}
                  </button>
                  <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-800">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="pagination.pages > 1" class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Página {{ pagination.page }} de {{ pagination.pages }} ({{ pagination.total }} usuários)
            </div>
            <div class="flex space-x-2">
              <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Anterior</button>
              <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.pages" class="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const users = ref([])
const adminUser = ref(null)
const filters = ref({ search: '', type: '', status: '' })
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

const fetchUsers = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('adminToken')
    const params = { page: pagination.value.page, limit: pagination.value.limit, ...filters.value }
    
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    })

    if (response.data.success) {
      users.value = response.data.data
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    } else {
      toast.error('Erro ao carregar usuários')
    }
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = { search: '', type: '', status: '' }
  pagination.value.page = 1
  fetchUsers()
}

const changePage = (page) => {
  pagination.value.page = page
  fetchUsers()
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = { active: 'Ativo', inactive: 'Inativo', suspended: 'Suspenso', pending: 'Pendente' }
  return labels[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const viewUser = (id) => {
  router.push(`/admin/users/${id}`)
}

const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    const token = localStorage.getItem('adminToken')
    
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Status atualizado com sucesso')
    fetchUsers()
  } catch (error) {
    console.error('Error updating user status:', error)
    toast.error('Erro ao atualizar status')
  }
}

const deleteUser = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) return

  try {
    const token = localStorage.getItem('adminToken')
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success('Usuário excluído com sucesso')
    fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Erro ao excluir usuário')
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  const storedAdmin = localStorage.getItem('adminUser')
  if (storedAdmin) {
    adminUser.value = JSON.parse(storedAdmin)
  }
  fetchUsers()
})
</script>
