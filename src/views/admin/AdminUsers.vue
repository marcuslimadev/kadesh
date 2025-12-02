<template>
  <AdminLayout>
    <!-- Page Header -->
    <template #header>
      <div>
        <h1 class="admin-heading-1">Gerenciar Usuários</h1>
        <p class="admin-text-secondary mt-2">Visualize e gerencie todos os usuários da plataforma</p>
      </div>
    </template>

    <!-- Success Message -->
    <div v-if="successMessage" class="admin-alert admin-alert-success mb-6">
      <p>{{ successMessage }}</p>
      <button @click="successMessage = ''" class="admin-alert-close">×</button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="admin-alert admin-alert-danger mb-6">
      <p>{{ errorMessage }}</p>
      <button @click="errorMessage = ''" class="admin-alert-close">×</button>
    </div>

    <!-- Filters -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="admin-form-group">
            <label class="admin-form-label">Buscar</label>
            <input
              v-model="filters.search"
              @input="fetchUsers"
              type="text"
              class="admin-form-input"
              placeholder="Nome ou email..."
            />
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Tipo</label>
            <select v-model="filters.type" @change="fetchUsers" class="admin-form-select">
              <option value="">Todos</option>
              <option value="client">Contratantes</option>
              <option value="provider">Prestadores</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Status</label>
            <select v-model="filters.status" @change="fetchUsers" class="admin-form-select">
              <option value="">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="suspended">Suspenso</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="resetFilters" class="admin-btn admin-btn-outline w-full">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="admin-card">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="admin-spinner-lg"></div>
        <p class="mt-4 admin-text-secondary">Carregando usuários...</p>
      </div>

      <!-- Table Content -->
      <div v-else class="admin-table-container">
        <table class="admin-table">
          <thead class="admin-table-head">
            <tr>
              <th class="admin-table-th">Usuário</th>
              <th class="admin-table-th">Tipo</th>
              <th class="admin-table-th">Status</th>
              <th class="admin-table-th">Localização</th>
              <th class="admin-table-th">Cadastro</th>
              <th class="admin-table-th">Ações</th>
            </tr>
          </thead>
          <tbody class="admin-table-body">
            <tr v-for="user in users" :key="user.id" class="admin-table-row">
              <td class="admin-table-td">
                <div>
                  <div class="font-medium admin-text-primary">{{ user.name }}</div>
                  <div class="admin-text-xs admin-text-secondary">{{ user.email }}</div>
                </div>
              </td>
              <td class="admin-table-td">
                <span
                  class="admin-badge"
                  :class="user.type === 'client' ? 'admin-badge-primary' : 'admin-badge-success'"
                >
                  {{ user.type === 'client' ? 'Contratante' : 'Prestador' }}
                </span>
              </td>
              <td class="admin-table-td">
                <span class="admin-badge" :class="getStatusBadgeClass(user.status)">
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td class="admin-table-td admin-text-secondary">
                {{ user.location || '-' }}
              </td>
              <td class="admin-table-td admin-text-secondary">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="admin-table-td">
                <div class="flex gap-2">
                  <button
                    @click="viewUser(user.id)"
                    class="admin-btn admin-btn-sm admin-btn-outline"
                    title="Ver detalhes"
                  >
                    Ver
                  </button>
                  <button
                    @click="showPromoteModal(user)"
                    class="admin-btn admin-btn-sm admin-btn-warning"
                    title="Promover a administrador"
                  >
                    Promover
                  </button>
                  <button
                    @click="openToggleStatusModal(user)"
                    class="admin-btn admin-btn-sm admin-btn-secondary"
                    :title="user.status === 'active' ? 'Suspender usuário' : 'Ativar usuário'"
                  >
                    {{ user.status === 'active' ? 'Suspender' : 'Ativar' }}
                  </button>
                  <button
                    @click="openDeleteModal(user)"
                    class="admin-btn admin-btn-sm admin-btn-danger"
                    title="Excluir usuário"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="text-center py-12">
          <p class="admin-text-secondary">Nenhum usuário encontrado</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.pages > 1"
          class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200"
        >
          <div class="admin-text-sm admin-text-secondary">
            Página {{ pagination.page }} de {{ pagination.pages }} ({{ pagination.total }} usuários)
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="admin-btn admin-btn-sm admin-btn-outline"
            >
              Anterior
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.pages"
              class="admin-btn admin-btn-sm admin-btn-outline"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Promote to Admin Modal -->
    <ConfirmationModal
      :show="showPromote"
      type="warning"
      title="Promover Usuário a Administrador"
      :message="`Você está prestes a promover ${selectedUser?.name} a administrador. Preencha os dados de acesso administrativo:`"
      warningMessage="O usuário terá acesso total ao painel administrativo."
      confirmText="Promover"
      cancelText="Cancelar"
      :fields="promoteFields"
      :loading="promoting"
      @confirm="handlePromote"
      @cancel="closePromoteModal"
    />

    <!-- Toggle Status Modal -->
    <ConfirmationModal
      :show="showToggleStatus"
      :type="selectedUser?.status === 'active' ? 'warning' : 'info'"
      :title="selectedUser?.status === 'active' ? 'Suspender Usuário' : 'Ativar Usuário'"
      :message="`Tem certeza que deseja ${selectedUser?.status === 'active' ? 'suspender' : 'ativar'} o usuário ${selectedUser?.name}?`"
      :confirmText="selectedUser?.status === 'active' ? 'Suspender' : 'Ativar'"
      cancelText="Cancelar"
      :loading="togglingStatus"
      @confirm="handleToggleStatus"
      @cancel="closeToggleStatusModal"
    />

    <!-- Delete User Modal -->
    <ConfirmationModal
      :show="showDelete"
      type="danger"
      title="Excluir Usuário"
      :message="`Tem certeza que deseja excluir o usuário ${selectedUser?.name}?`"
      warningMessage="Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos."
      confirmText="Sim, excluir"
      cancelText="Cancelar"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ConfirmationModal from '@/components/admin/ConfirmationModal.vue'

const router = useRouter()

const loading = ref(true)
const users = ref([])
const filters = ref({ search: '', type: '', status: '' })
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 })

// Success/Error messages
const successMessage = ref('')
const errorMessage = ref('')

// Promote Modal
const showPromote = ref(false)
const selectedUser = ref(null)
const promoting = ref(false)
const promoteFields = ref([
  {
    name: 'username',
    label: 'Nome de usuário (admin)',
    type: 'text',
    placeholder: 'Digite o username do admin',
    required: true
  },
  {
    name: 'password',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite a senha',
    required: true
  },
  {
    name: 'role',
    label: 'Nível de Acesso',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'super_admin', label: 'Super Admin' }
    ]
  }
])

// Toggle Status Modal
const showToggleStatus = ref(false)
const togglingStatus = ref(false)

// Delete Modal
const showDelete = ref(false)
const deleting = ref(false)

const fetchUsers = async () => {
  try {
    loading.value = true
    const token = localStorage.getItem('kadesh_token') || localStorage.getItem('kadesh_token') || localStorage.getItem('adminToken')
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
      errorMessage.value = 'Erro ao carregar usuários'
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

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'admin-badge-success',
    inactive: 'admin-badge-neutral',
    suspended: 'admin-badge-danger',
    pending: 'admin-badge-warning'
  }
  return classes[status] || 'admin-badge-neutral'
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

// Promote to Admin
const showPromoteModal = (user) => {
  selectedUser.value = user
  showPromote.value = true
}

const closePromoteModal = () => {
  showPromote.value = false
  selectedUser.value = null
}

const handlePromote = async (formData) => {
  try {
    promoting.value = true
    const token = localStorage.getItem('kadesh_token') || localStorage.getItem('kadesh_token') || localStorage.getItem('adminToken')
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.value.id}/promote`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (response.data.success) {
      successMessage.value = `${selectedUser.value.name} foi promovido a administrador com sucesso!`
      closePromoteModal()
      fetchUsers()
      
      // Auto-dismiss success message after 5s
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    }
  } catch (error) {
    console.error('Error promoting user:', error)
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Erro ao promover usuário a administrador'
    }
  } finally {
    promoting.value = false
  }
}

// Toggle Status
const openToggleStatusModal = (user) => {
  selectedUser.value = user
  showToggleStatus.value = true
}

const closeToggleStatusModal = () => {
  showToggleStatus.value = false
  selectedUser.value = null
}

const handleToggleStatus = async () => {
  try {
    togglingStatus.value = true
    const newStatus = selectedUser.value.status === 'active' ? 'suspended' : 'active'
    const token = localStorage.getItem('kadesh_token') || localStorage.getItem('kadesh_token') || localStorage.getItem('adminToken')
    
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.value.id}/status`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    successMessage.value = 'Status atualizado com sucesso'
    closeToggleStatusModal()
    fetchUsers()
    
    // Auto-dismiss success message after 3s
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error updating user status:', error)
    errorMessage.value = 'Erro ao atualizar status do usuário'
  } finally {
    togglingStatus.value = false
  }
}

// Delete User
const openDeleteModal = (user) => {
  selectedUser.value = user
  showDelete.value = true
}

const closeDeleteModal = () => {
  showDelete.value = false
  selectedUser.value = null
}

const handleDelete = async () => {
  try {
    deleting.value = true
    const token = localStorage.getItem('kadesh_token') || localStorage.getItem('kadesh_token') || localStorage.getItem('adminToken')
    
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser.value.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    successMessage.value = 'Usuário excluído com sucesso'
    closeDeleteModal()
    fetchUsers()
    
    // Auto-dismiss success message after 3s
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error deleting user:', error)
    errorMessage.value = 'Erro ao excluir usuário'
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
@import '@/assets/admin-design-system.css';
</style>

