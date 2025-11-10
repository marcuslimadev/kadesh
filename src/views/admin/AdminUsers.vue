<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p class="text-gray-600 mt-2">{{ filteredUsers.length }} usuários encontrados</p>
        </div>
        <button @click="exportUsers" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
          <i class="fas fa-download mr-2"></i>Exportar CSV
        </button>
      </div>

      <LoadingScreen :show="loading" message="Carregando usuários..." icon="👥" />

      <!-- Filtros -->
      <div v-if="!loading" class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input 
              v-model="filters.search"
              type="text" 
              placeholder="Nome, email..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select v-model="filters.user_type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="contractor">Contratante</option>
              <option value="provider">Fornecedor</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status KYC</label>
            <select v-model="filters.kyc_status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <button @click="resetFilters" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium">
              <i class="fas fa-undo mr-2"></i>Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Tabela de Usuários -->
      <div v-if="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {{ user.name?.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="user.user_type === 'contractor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                      class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ user.user_type === 'contractor' ? 'Contratante' : 'Fornecedor' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'bg-yellow-100 text-yellow-800': user.kyc_status === 'pending',
                  'bg-green-100 text-green-800': user.kyc_status === 'approved',
                  'bg-red-100 text-red-800': user.kyc_status === 'rejected'
                }" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ user.kyc_status === 'pending' ? 'Pendente' : user.kyc_status === 'approved' ? 'Aprovado' : 'Rejeitado' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-900">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click="editUser(user)" class="text-green-600 hover:text-green-900">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="banUser(user)" class="text-red-600 hover:text-red-900">
                  <i class="fas fa-ban"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Paginação -->
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * perPage + 1 }} até {{ Math.min(currentPage * perPage, filteredUsers.length) }} de {{ filteredUsers.length }} usuários
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
              :disabled="currentPage * perPage >= filteredUsers.length"
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
const users = ref([])
const filters = ref({
  search: '',
  user_type: '',
  kyc_status: ''
})
const currentPage = ref(1)
const perPage = 20

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/users', { withCredentials: true })
    users.value = res.data.users || res.data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchSearch = !filters.value.search || 
      user.name?.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchType = !filters.value.user_type || user.user_type === filters.value.user_type
    const matchKYC = !filters.value.kyc_status || user.kyc_status === filters.value.kyc_status
    
    return matchSearch && matchType && matchKYC
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

const resetFilters = () => {
  filters.value = { search: '', user_type: '', kyc_status: '' }
  currentPage.value = 1
}

const viewUser = (user) => {
  alert(`Ver detalhes do usuário: ${user.name}`)
  // TODO: Abrir modal com detalhes
}

const editUser = (user) => {
  alert(`Editar usuário: ${user.name}`)
  // TODO: Abrir modal de edição
}

const banUser = async (user) => {
  if (confirm(`Tem certeza que deseja banir ${user.name}?`)) {
    try {
      await axios.post(`/api/admin/users/${user.id}/ban`, {}, { withCredentials: true })
      alert('Usuário banido com sucesso')
      fetchUsers()
    } catch (error) {
      alert('Erro ao banir usuário')
    }
  }
}

const exportUsers = () => {
  const csv = 'ID,Nome,Email,Tipo,KYC,Data Cadastro\n' + 
    filteredUsers.value.map(u => 
      `${u.id},${u.name},${u.email},${u.user_type},${u.kyc_status},${u.created_at}`
    ).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `usuarios-kadesh-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchUsers()
})
</script>
