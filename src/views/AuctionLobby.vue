<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ lobbyTitle }}</h1>
        <p class="text-gray-600">{{ lobbyDescription }}</p>
      </div>

      <!-- Mode-specific highlights -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          v-for="highlight in lobbyHighlights"
          :key="highlight.label"
          class="bg-white rounded-xl shadow p-4 border-l-4"
          :class="highlight.border"
        >
          <p class="text-sm text-gray-500">{{ highlight.label }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ highlight.value }}</p>
          <span class="text-xs font-semibold" :class="highlight.text">{{ highlight.caption }}</span>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <router-link
          to="/dashboard"
          class="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-sm font-medium">Dashboard</span>
        </router-link>

        <router-link
          v-if="isContractorView"
          to="/projects/create"
          class="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-medium">Novo Projeto</span>
        </router-link>
        <router-link
          v-else
          to="/projects"
          class="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="text-sm font-medium">Explorar Projetos</span>
        </router-link>

        <router-link
          to="/wallet"
          class="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="text-sm font-medium">Carteira</span>
        </router-link>

        <router-link
          to="/contracts"
          class="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-sm font-medium">Contratos</span>
        </router-link>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">🔍 Filtros</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              v-model="filters.category"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              <option value="design">Design</option>
              <option value="desenvolvimento">Desenvolvimento</option>
              <option value="marketing">Marketing</option>
              <option value="escrita">Escrita</option>
              <option value="consultoria">Consultoria</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Orçamento (Máx)</label>
            <select
              v-model="filters.budget"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Qualquer</option>
              <option value="500">Até R$ 500</option>
              <option value="1000">Até R$ 1.000</option>
              <option value="5000">Até R$ 5.000</option>
              <option value="10000">Até R$ 10.000</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
            <select
              v-model="filters.deadline"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Qualquer</option>
              <option value="7">Até 7 dias</option>
              <option value="15">Até 15 dias</option>
              <option value="30">Até 30 dias</option>
              <option value="60">Até 60 dias</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="open">Aberto (aceita propostas)</option>
              <option value="in_progress">Em andamento</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="clearFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 mr-2"
          >
            Limpar filtros
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Carregando projetos...</p>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-600">Nenhum projeto encontrado com os filtros atuais</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white rounded-2xl shadow hover:shadow-lg transition p-6"
        >
          <div class="grid gap-6 md:grid-cols-[160px_1fr]">
            <div class="relative">
              <div
                class="h-40 w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
              >
                <img
                  v-if="getCoverImage(project)"
                  :src="getCoverImage(project)"
                  :alt="project.title"
                  class="object-cover w-full h-full"
                />
                <div v-else class="text-center px-4">
                  <svg class="w-10 h-10 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10M7 11h10M7 15h7" />
                  </svg>
                  <p class="text-xs text-gray-500 mt-2">Sem anexos enviados</p>
                </div>
              </div>
              <div
                v-if="attachmentCount(project)"
                class="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow"
              >
                {{ attachmentCount(project) }} {{ attachmentCount(project) === 1 ? 'arquivo' : 'arquivos' }}
              </div>
            </div>

            <div>
              <div class="flex flex-wrap gap-4 items-start justify-between">
                <div class="flex-1 min-w-[220px]">
                  <router-link
                    :to="`/projects/${project.id}`"
                    class="text-xl font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {{ project.title }}
                  </router-link>
                  <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {{ project.category || 'Geral' }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ formatDate(project.created_at) }}
                    </span>
                    <span v-if="project.deadline" class="flex items-center text-orange-600">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l3 3" />
                      </svg>
                      Prazo: {{ formatDeadline(project.deadline) }}
                    </span>
                    <span
                      v-if="getDeadlineBadge(project)"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="getDeadlineBadge(project).class"
                    >
                      <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6l3 3" />
                      </svg>
                      {{ getDeadlineBadge(project).text }}
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-xs uppercase tracking-wide text-gray-500">Orçamento Máx.</p>
                  <div class="text-2xl font-bold text-blue-600">R$ {{ formatCurrency(project.budget) }}</div>
                  <div
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-xs font-medium mt-2',
                      project.status === 'open' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ getStatusLabel(project.status) }}
                  </div>
                </div>
              </div>

              <p class="text-gray-700 my-4 line-clamp-2">{{ project.description }}</p>

              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-4 text-sm">
                  <div class="flex items-center text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{{ project.client_name || 'Contratante' }}</span>
                  </div>
                  <div class="flex items-center text-blue-600 font-medium">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    {{ getBidCount(project) }} {{ getBidCount(project) === 1 ? 'proposta' : 'propostas' }}
                  </div>
                  <div
                    v-if="getBidCount(project) && getLowestBid(project)
                    "
                    class="flex items-center text-emerald-600 font-medium"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Menor lance: R$ {{ formatCurrency(getLowestBid(project)) }}
                  </div>
                </div>
                <router-link
                  :to="`/projects/${project.id}`"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Ver Detalhes
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredProjects.length > 0" class="mt-8 flex justify-center">
        <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            Página {{ currentPage }}
          </span>
          <button
            @click="currentPage++"
            :disabled="filteredProjects.length < pageSize"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Próxima
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewModeStore } from '@/stores/viewModeStore'
import api from '@/services/api'

const viewModeStore = useViewModeStore()
const { currentMode } = storeToRefs(viewModeStore)

const isContractorView = computed(() => currentMode.value === 'contractor')
const isProviderView = computed(() => currentMode.value === 'provider')

const lobbyTitle = computed(() =>
  isContractorView.value ? '🎯 Lobby do Contratante' : '⚙️ Lobby do Prestador'
)

const lobbyDescription = computed(() =>
  isContractorView.value
    ? 'Gerencie seus leilões, monitore os lances e acompanhe o vencedor em tempo real.'
    : 'Descubra projetos em aberto, acompanhe disputas e envie lances competitivos instantaneamente.'
)

const lobbyHighlights = computed(() => {
  const total = projects.value.length
  const openCount = projects.value.filter(p => p.status === 'open').length
  const highPriority = projects.value.filter(p => (p.priority || 3) <= 2).length

  if (isContractorView.value) {
    return [
      {
        label: 'Projetos ativos',
        value: total,
        caption: 'publicados por você',
        border: 'border-blue-200',
        text: 'text-blue-600'
      },
      {
        label: 'Aceitando propostas',
        value: openCount,
        caption: 'leilões abertos agora',
        border: 'border-green-200',
        text: 'text-green-600'
      },
      {
        label: 'Prioridade alta',
        value: highPriority,
        caption: 'precisam de atenção',
        border: 'border-amber-200',
        text: 'text-amber-600'
      }
    ]
  }

  return [
    {
      label: 'Projetos disponíveis',
      value: openCount,
      caption: 'aceitando novos lances',
      border: 'border-green-200',
      text: 'text-green-600'
    },
    {
      label: 'Novos hoje',
      value: projects.value.filter(p => {
        const created = new Date(p.created_at)
        const now = new Date()
        const diff = now - created
        return diff <= 24 * 60 * 60 * 1000
      }).length,
      caption: 'oportunidades frescas',
      border: 'border-blue-200',
      text: 'text-blue-600'
    },
    {
      label: 'Alta prioridade',
      value: highPriority,
      caption: 'pagam melhor',
      border: 'border-purple-200',
      text: 'text-purple-600'
    }
  ]
})

const loading = ref(false)
const projects = ref([])
const currentPage = ref(1)
const pageSize = ref(20)

const filters = ref({
  category: '',
  budget: '',
  deadline: '',
  status: ''
})

const FILTER_STORAGE_KEYS = {
  contractor: 'kadesh_lobby_filters_contractor',
  provider: 'kadesh_lobby_filters_provider'
}

const getStorageKey = () => {
  return currentMode.value === 'contractor'
    ? FILTER_STORAGE_KEYS.contractor
    : FILTER_STORAGE_KEYS.provider
}

const restoreFiltersForMode = () => {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(getStorageKey())
    if (!raw) return
    const saved = JSON.parse(raw)
    filters.value = {
      category: saved.category || '',
      budget: saved.budget || '',
      deadline: saved.deadline || '',
      status: saved.status || ''
    }
  } catch (error) {
    console.warn('Não foi possível restaurar filtros do lobby:', error)
  }
}

const persistFilters = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(filters.value))
  } catch (error) {
    console.warn('Não foi possível salvar filtros do lobby:', error)
  }
}

const filteredProjects = computed(() => {
  let result = projects.value

  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }

  if (filters.value.budget) {
    result = result.filter(p => p.budget <= parseInt(filters.value.budget))
  }

  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }

  return result
})

const loadProjects = async () => {
  loading.value = true
  try {
    const endpoint = isContractorView.value ? '/api/projects/my-projects' : '/api/projects'
    const params = {
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value
    }

    if (filters.value.status) {
      params.status = filters.value.status
    } else if (isProviderView.value) {
      params.status = 'open'
    }

    if (filters.value.category) {
      params.category = filters.value.category
    }

    if (filters.value.budget) {
      params.budget_max = filters.value.budget
    }

    const response = await api.get(endpoint, { params })
    const payload = Array.isArray(response.data)
      ? response.data
      : response.data?.projects || []
    projects.value = payload
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
    projects.value = []
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadProjects()
}

const clearFilters = () => {
  filters.value = {
    category: '',
    budget: '',
    deadline: '',
    status: ''
  }
  applyFilters()
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const formatDeadline = (dateString) => {
  if (!dateString) return 'Sem prazo'
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusLabel = (status) => {
  const labels = {
    open: 'Aberto',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const normalizeAttachments = (project) => {
  if (!project) return []
  if (Array.isArray(project.attachments)) return project.attachments
  return []
}

const attachmentCount = (project) => normalizeAttachments(project).length

const getCoverImage = (project) => {
  const list = normalizeAttachments(project)
  const firstImage = list.find(item => item?.mime_type?.startsWith('image/'))
  return firstImage?.file_url || null
}

const getBidCount = (project) => {
  if (!project) return 0
  return project.bid_count ?? project.bids_count ?? 0
}

const getLowestBid = (project) => {
  if (!project) return null
  const value = project.lowest_bid_amount ?? null
  return typeof value === 'number' ? value : (value ? parseFloat(value) : null)
}

const getDeadlineBadge = (project) => {
  if (!project?.deadline) return null
  const deadline = new Date(project.deadline)
  if (Number.isNaN(deadline.getTime())) return null
  const now = new Date()
  const diffMs = deadline - now
  if (diffMs <= 0) {
    return {
      text: 'Prazo encerrado',
      class: 'bg-red-100 text-red-700'
    }
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  let label = ''
  if (days > 0) {
    label = `${days}d ${hours}h`
  } else if (hours > 0) {
    label = `${hours}h ${minutes}m`
  } else {
    label = `${minutes}m`
  }

  let badgeClass = 'bg-green-100 text-green-700'
  if (days <= 2) badgeClass = 'bg-amber-100 text-amber-700'
  if (hours < 6 && days === 0) badgeClass = 'bg-orange-100 text-orange-700'
  if (hours === 0 && days === 0) badgeClass = 'bg-red-100 text-red-700'

  return {
    text: `Termina em ${label}`,
    class: badgeClass
  }
}

onMounted(() => {
  restoreFiltersForMode()
  loadProjects()
})

watch(currentMode, () => {
  restoreFiltersForMode()
  currentPage.value = 1
  loadProjects()
})

watch(filters, () => {
  persistFilters()
}, { deep: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
