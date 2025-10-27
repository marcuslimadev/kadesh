<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link to="/admin/dashboard" class="text-white/80 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </router-link>
            <h1 class="text-3xl font-semibold">📋 Gerenciamento de Projetos</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <!-- Filtros -->
      <div class="bg-white rounded shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">🔍 Buscar</label>
            <input
              v-model="filters.search"
              @input="loadProjects"
              type="text"
              placeholder="Título ou descrição..."
              class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-neutral-300 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2"> Status</label>
            <select
              v-model="filters.status"
              @change="loadProjects"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-neutral-300 focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="bidding">Recebendo Lances</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2"> Total</label>
            <div class="text-2xl font-semibold text-neutral-900">{{ projects.length }} projeto(s)</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="w-16 h-16 border-8 border-neutral-300 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-gray-600 font-bold">Carregando projetos...</p>
      </div>

      <!-- Lista de Projetos -->
      <div v-else class="grid gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white rounded shadow-lg p-6 hover:shadow transition-shadow"
        >
          <div class="flex flex-col md:flex-row justify-between gap-4">
            <!-- Info do Projeto -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-gray-900">{{ project.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ project.contractor_name }} - {{ project.contractor_email }}</p>
                </div>
                <span :class="getStatusBadge(project.status)" class="px-4 py-2 rounded text-sm font-bold whitespace-nowrap">
                  {{ getStatusLabel(project.status) }}
                </span>
              </div>

              <p class="text-gray-700 mb-4 line-clamp-2">{{ project.description }}</p>

              <!-- Estatísticas do Projeto -->
              <div class="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <div class="text-lg font-semibold text-neutral-900">R$ {{ formatMoney(project.max_budget) }}</div>
                  <div class="text-xs text-gray-600 font-semibold">Orçamento Max</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-neutral-900">{{ project.bids_count || 0 }}</div>
                  <div class="text-xs text-gray-600 font-semibold">Lances</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-neutral-900">
                    {{ project.lowest_bid ? `R$ ${formatMoney(project.lowest_bid)}` : '-' }}
                  </div>
                  <div class="text-xs text-gray-600 font-semibold">Menor Lance</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-semibold text-orange-600">{{ formatDate(project.created_at) }}</div>
                  <div class="text-xs text-gray-600 font-semibold">Criado</div>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex flex-col gap-2 min-w-[180px]">
              <router-link
                :to="`/projects/${project.id}`"
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-bold transition-colors text-center flex items-center justify-center gap-2"
              >
                👁️ Ver Projeto
              </router-link>
              <button
                v-if="project.status !== 'cancelled' && project.status !== 'completed'"
                @click="closeProject(project.id)"
                class="bg-neutral-600 hover:bg-neutral-600 text-white px-4 py-2 rounded font-bold transition-colors flex items-center justify-center gap-2"
              >
                🚫 Encerrar
              </button>
              <button
                v-if="project.bids_count > 0"
                @click="viewBids(project.id)"
                class="bg-neutral-700 hover:bg-neutral-700 text-white px-4 py-2 rounded font-bold transition-colors flex items-center justify-center gap-2"
              >
                 Ver Lances
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="projects.length === 0" class="text-center py-20">
          <div class="text-6xl mb-4">📋</div>
          <p class="text-xl text-gray-600 font-bold">Nenhum projeto encontrado</p>
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
const projects = ref([])
const loading = ref(true)
const filters = ref({
  search: '',
  status: ''
})

const getStatusBadge = (status) => {
  const badges = {
    'open': 'bg-neutral-800 text-neutral-900',
    'bidding': 'bg-neutral-700 text-neutral-900',
    'in_progress': 'bg-neutral-600 text-yellow-700',
    'completed': 'bg-purple-100 text-neutral-900',
    'cancelled': 'bg-neutral-600 text-red-700'
  }
  return badges[status] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status) => {
  const labels = {
    'open': '🟢 Aberto',
    'bidding': ' Recebendo Lances',
    'in_progress': ' Em Andamento',
    'completed': ' Concluído',
    'cancelled': '🚫 Cancelado'
  }
  return labels[status] || status
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const loadProjects = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('status', filters.value.status)

    const response = await axios.get(`/kadesh/api/admin/projects?${params}`)
    projects.value = response.data
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

const closeProject = async (projectId) => {
  if (!confirm('Deseja encerrar este projeto? Esta ação não pode ser desfeita.')) return

  try {
    await axios.post(`/kadesh/api/admin/projects/${projectId}/close`)
    alert('Projeto encerrado com sucesso')
    loadProjects()
  } catch (error) {
    console.error('Erro ao encerrar projeto:', error)
    alert('Erro ao encerrar projeto')
  }
}

const viewBids = (projectId) => {
  router.push(`/projects/${projectId}`)
}

onMounted(() => {
  if (!localStorage.getItem('isAdmin')) {
    router.push('/admin/login')
    return
  }
  loadProjects()
})
</script>




