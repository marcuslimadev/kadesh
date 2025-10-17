<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/admin/dashboard" class="text-white/80 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </router-link>
            <h1 class="text-3xl font-black">👥 Gerenciamento de Usuários</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <!-- Filtros e Busca -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">🔍 Buscar</label>
            <input
              v-model="filters.search"
              @input="loadUsers"
              type="text"
              placeholder="Nome ou email..."
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">👤 Tipo de Usuário</label>
            <select
              v-model="filters.type"
              @change="loadUsers"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="contractor">Contratantes</option>
              <option value="provider">Fornecedores</option>
              <option value="both">Ambos</option>
              <option value="admin">Administradores</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">📊 Estatísticas</label>
            <div class="text-2xl font-black text-purple-600">{{ users.length }} usuário(s)</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="w-16 h-16 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-gray-600 font-bold">Carregando usuários...</p>
      </div>

      <!-- Lista de Usuários -->
      <div v-else class="grid gap-4">
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div class="flex flex-col md:flex-row justify-between gap-4">
            <!-- Info do Usuário -->
            <div class="flex-1">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-black">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900">{{ user.name }}</h3>
                  <p class="text-gray-600">{{ user.email }}</p>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span :class="getUserTypeBadge(user.user_type)" class="px-3 py-1 rounded-full text-xs font-bold">
                      {{ getUserTypeLabel(user.user_type) }}
                    </span>
                    <span v-if="user.email_verified_at" class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      ✓ Verificado
                    </span>
                    <span v-else class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                      ⚠️ Não verificado
                    </span>
                  </div>
                </div>
              </div>

              <!-- Estatísticas -->
              <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <div class="text-2xl font-black text-purple-600">{{ user.projects_count || 0 }}</div>
                  <div class="text-xs text-gray-600 font-semibold">Projetos</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-black text-blue-600">{{ user.bids_count || 0 }}</div>
                  <div class="text-xs text-gray-600 font-semibold">Lances</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-black text-yellow-600">{{ (user.average_rating || 0).toFixed(1) }} ⭐</div>
                  <div class="text-xs text-gray-600 font-semibold">Avaliação</div>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex flex-col gap-2 min-w-[200px]">
              <button
                @click="resetPassword(user.id)"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                🔑 Resetar Senha
              </button>
              <button
                @click="toggleStatus(user.id)"
                :class="user.email_verified_at 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'"
                class="text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                {{ user.email_verified_at ? '🚫 Desativar' : '✅ Ativar' }}
              </button>
              <button
                @click="viewUser(user.id)"
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                👁️ Ver Detalhes
              </button>
              <button
                v-if="user.user_type !== 'admin'"
                @click="deleteUser(user.id)"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                🗑️ Remover
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="users.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">👥</div>
          <p class="text-xl text-gray-600 font-bold">Nenhum usuário encontrado</p>
        </div>
      </div>
    </div>

    <!-- Modal de Senha Resetada -->
    <div v-if="resetPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div class="text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">✅</span>
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-2">Senha Resetada!</h3>
          <p class="text-gray-600 mb-4">A senha temporária do usuário é:</p>
          <div class="bg-gray-100 p-4 rounded-xl mb-6">
            <code class="text-2xl font-mono font-bold text-purple-600">{{ tempPassword }}</code>
          </div>
          <p class="text-sm text-gray-500 mb-6">⚠️ Copie esta senha e envie para o usuário. Ela não será exibida novamente.</p>
          <button
            @click="resetPasswordModal = false"
            class="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold w-full"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const users = ref([])
const loading = ref(true)
const filters = ref({
  search: '',
  type: '',
  status: ''
})
const resetPasswordModal = ref(false)
const tempPassword = ref('')

const getUserTypeBadge = (type) => {
  const badges = {
    'contractor': 'bg-blue-100 text-blue-700',
    'provider': 'bg-purple-100 text-purple-700',
    'both': 'bg-indigo-100 text-indigo-700',
    'admin': 'bg-red-100 text-red-700'
  }
  return badges[type] || 'bg-gray-100 text-gray-700'
}

const getUserTypeLabel = (type) => {
  const labels = {
    'contractor': '🏢 Contratante',
    'provider': '🔨 Fornecedor',
    'both': '🔄 Ambos',
    'admin': '👑 Admin'
  }
  return labels[type] || type
}

const loadUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.type) params.append('type', filters.value.type)
    if (filters.value.status) params.append('status', filters.value.status)

    const response = await axios.get(`/kadesh/api/admin/users?${params}`)
    users.value = response.data
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

const resetPassword = async (userId) => {
  if (!confirm('Deseja resetar a senha deste usuário?')) return

  try {
    const response = await axios.post(`/kadesh/api/admin/users/${userId}/reset-password`)
    tempPassword.value = response.data.temp_password
    resetPasswordModal.value = true
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
    alert('Erro ao resetar senha')
  }
}

const toggleStatus = async (userId) => {
  try {
    const response = await axios.post(`/kadesh/api/admin/users/${userId}/toggle-status`)
    alert(response.data.message)
    loadUsers()
  } catch (error) {
    console.error('Erro ao alterar status:', error)
    alert('Erro ao alterar status')
  }
}

const viewUser = (userId) => {
  // TODO: Criar página de detalhes do usuário
  router.push(`/admin/users/${userId}`)
}

const deleteUser = async (userId) => {
  if (!confirm('Tem certeza que deseja remover este usuário? Esta ação não pode ser desfeita.')) return

  try {
    await axios.delete(`/kadesh/api/admin/users/${userId}`)
    alert('Usuário removido com sucesso')
    loadUsers()
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    alert(error.response?.data?.error || 'Erro ao deletar usuário')
  }
}

onMounted(() => {
  if (!localStorage.getItem('isAdmin')) {
    router.push('/admin/login')
    return
  }
  loadUsers()
})
</script>
