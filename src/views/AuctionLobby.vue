<template>
  <div class="lobby-shell py-3 px-4 sm:px-6 lg:px-8">
    <div class="max-w-[1600px] mx-auto">
      <div class="lobby-grid">
        <!-- Anúncios Esquerda (Desktop) -->
        <AdRail position="left" class="hidden lg:block" />
        
        <div class="lobby-main space-y-2">
          <section class="bg-surface rounded-lg p-2 border border-muted-border">
            <div class="flex items-center justify-between mb-2">
              <button @click="showFilters = !showFilters" class="flex items-center gap-2 text-xs font-medium text-body hover:text-heading">
                <svg class="w-4 h-4" :class="{'rotate-180': showFilters}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span>Filtros</span>
              </button>
              <span class="text-xs text-muted">{{ filteredProjects.length }} projeto(s)</span>
            </div>
            <transition name="fade">
              <div v-if="showFilters" class="flex items-center gap-2">
                <select v-model="filters.category" class="flex-1 px-2 py-1 bg-surface-elevated border border-muted-border rounded text-xs text-body">
                  <option value="">Categoria</option>
                  <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                </select>
                <select v-model="filters.budget" class="flex-1 px-2 py-1 bg-surface-elevated border border-muted-border rounded text-xs text-body">
                  <option value="">Orçamento</option>
                  <option value="5000">~R$ 5k</option>
                  <option value="10000">~R$ 10k</option>
                </select>
                <select v-model="filters.status" class="flex-1 px-2 py-1 bg-surface-elevated border border-muted-border rounded text-xs text-body">
                  <option value="">Status</option>
                  <option value="open">Aberto</option>
                </select>
                <button @click="clearFilters" class="px-2 py-1 text-xs text-muted hover:text-heading">Limpar</button>
                <button @click="applyFilters" class="px-3 py-1 bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1117] rounded text-xs font-semibold">Filtrar</button>
              </div>
            </transition>
        </section>

        <div v-if="loading" class="card text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
          <p class="mt-4 text-muted">Carregando projetos...</p>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="card text-center py-12">
          <svg class="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-muted">Nenhum projeto encontrado com os filtros atuais</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Grid de cards de leilao estilo Monitor Leilao / Vestri -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="auction-card-modern group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              :class="getDeadlineBadge(project)?.hours <= 24 ? 'ring-2 ring-[#D4AF37] ring-opacity-50 animate-pulse' : ''"
            >
              <!-- Image Thumbnail -->
              <div class="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F1117]">
                <img
                  v-if="getCoverImage(project)"
                  :src="getCoverImage(project)"
                  :alt="project.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-20 h-20 text-[#D4AF37]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <!-- Overlay gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <!-- Top Row: Status + Timer -->
                <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                  <!-- Status Badge -->
                  <span
                    v-if="!isDeadlineExpired(project)"
                    :class="[
                      'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm',
                      project.status === 'open' ? 'bg-emerald-500/90 text-white' :
                      project.status === 'in_progress' ? 'bg-amber-500/90 text-white' :
                      'bg-gray-500/90 text-white'
                    ]"
                  >
                    {{ getStatusLabel(project.status) }}
                  </span>

                  <!-- Countdown Timer -->
                  <div
                    v-if="getDeadlineBadge(project)"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm text-white font-bold text-sm"
                    :class="getDeadlineBadge(project).bgClass"
                  >
                    <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    {{ getDeadlineBadge(project).text }}
                  </div>
                </div>

                <!-- Bid Count Badge -->
                <div class="absolute bottom-3 left-3">
                  <div class="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/90 backdrop-blur-sm rounded-full text-[#0F1117] font-bold text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    {{ getBidCount(project) }} Lance(s)
                  </div>
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-5 bg-[#161821] border-x border-b border-[rgba(212,175,55,0.24)] rounded-b-2xl">
                <!-- Category Tag -->
                <span class="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold rounded-full mb-3">
                  {{ getCategoryLabel(project.category) }}
                </span>

                <p class="text-xs uppercase tracking-wide text-[#C7C7C7] mb-1">
                  Contratante: <span class="text-[#F5F5F5] font-semibold">{{ project.client_name || 'Contratante' }}</span>
                </p>

                <!-- Title -->
                <router-link
                  :to="`/projects/${project.id}`"
                  class="block text-lg font-bold text-[#F5F5F5] hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3 leading-tight"
                >
                  {{ project.title }}
                </router-link>

                <!-- Description -->
                <p class="text-[#C7C7C7] text-sm line-clamp-2 mb-4">
                  {{ project.description }}
                </p>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-[#0F1117] rounded-xl">
                  <div class="text-center">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Orcamento</p>
                    <p class="text-base font-bold text-[#D4AF37]">
                      {{ formatCurrencyCompact(project.budget) }}
                    </p>
                  </div>
                  <div class="text-center border-x border-[rgba(212,175,55,0.1)]">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Prazo</p>
                    <p class="text-sm font-semibold text-[#F5F5F5]">
                      {{ formatDeadlineCompact(project.deadline) }}
                    </p>
                  </div>
                  <div class="text-center border-x border-[rgba(212,175,55,0.1)] sm:border-x-0 sm:border-l sm:border-[rgba(212,175,55,0.1)]">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Propostas</p>
                    <p class="text-base font-bold text-[#F5F5F5]">{{ getBidCount(project) }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Menor</p>
                    <p class="text-base font-bold" :class="getLowestBid(project) ? 'text-emerald-400' : 'text-[#8A8A8A]'">
                      {{ getLowestBid(project) ? formatCurrencyCompact(getLowestBid(project)) : 'ÔÇö' }}
                    </p>
                  </div>
                </div>

                <!-- Client Info & CTA -->
                <div class="flex items-center justify-between pt-3 border-t border-[rgba(212,175,55,0.1)]">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                      <span class="text-[#D4AF37] font-bold text-xs">
                        {{ (project.client_name || 'C')[0].toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-[#F5F5F5]">{{ project.client_name || 'Contratante' }}</p>
                      <p class="text-xs text-[#8A8A8A]">{{ formatDateCompact(project.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="isProviderView"
                      type="button"
                      class="cta-bid"
                      @click="openBidModal(project)"
                    >
                      Dar lance
                    </button>
                    <router-link
                      :to="`/projects/${project.id}`"
                      class="cta-view"
                    >
                      {{ isProviderView ? 'Detalhes' : 'Ver' }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredProjects.length > 0" class="flex justify-center">
          <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="pagination-button rounded-l-md"
            >
              Anterior
            </button>
            <span class="pagination-current">
              Pagina {{ currentPage }}
            </span>
            <button
              @click="currentPage++"
              :disabled="filteredProjects.length < pageSize"
              class="pagination-button rounded-r-md"
            >
              Proxima
            </button>
          </nav>
        </div>
        </div>
        
        <!-- Anúncios Direita (Desktop) -->
        <AdRail position="right" class="hidden lg:block" />
      </div>
    </div>

    <transition name="fade">
      <div v-if="showCategoryModal" class="modal-overlay" @click.self="closeCategoryModal">
        <div class="modal-card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-muted">+ Categoria</p>
              <h3 class="text-xl font-semibold">Sugerir nova categoria</h3>
            </div>
            <button class="cta-ghost" @click="closeCategoryModal">Fechar</button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="filter-label">Nome</label>
              <input v-model="newCategory.name" type="text" class="filter-input" placeholder="Ex: IA Generativa" />
            </div>
            <div>
              <label class="filter-label">Descricao</label>
              <textarea v-model="newCategory.description" rows="3" class="filter-input" placeholder="Conte rapidamente o que engloba a categoria" />
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <button class="cta-ghost" @click="closeCategoryModal">Cancelar</button>
            <button class="cta-link" @click="submitCategoryRequest">Enviar para validacao</button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showBidModal" class="modal-overlay" @click.self="closeBidModal">
        <div class="modal-card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-muted">Enviar proposta</p>
              <h3 class="text-xl font-semibold">Lance rapido no leilao</h3>
            </div>
            <button class="cta-ghost" @click="closeBidModal">Fechar</button>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[#0F1117]">
              <p class="text-sm text-[#8A8A8A] uppercase tracking-wide">Projeto</p>
              <p class="text-lg font-semibold text-heading">{{ activeBidProject?.title }}</p>
            </div>

            <div>
              <label class="filter-label">Valor do lance (R$)</label>
              <input v-model.number="bidForm.amount" type="number" min="1" class="filter-input" placeholder="0,00" />
            </div>
            <div>
              <label class="filter-label">Prazo (dias)</label>
              <input v-model.number="bidForm.delivery_time" type="number" min="1" class="filter-input" placeholder="7" />
            </div>
            <div>
              <label class="filter-label">Proposta</label>
              <textarea v-model="bidForm.proposal" rows="4" class="filter-input proposal-highlight" placeholder="Descreva sua proposta com clareza"></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button class="cta-ghost" @click="closeBidModal">Cancelar</button>
            <button class="cta-link" :disabled="isSubmittingBid" @click="submitQuickBid">
              {{ isSubmittingBid ? 'Enviando...' : 'Enviar lance' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useViewModeStore } from '@/stores/viewModeStore'
import projectService from '@/services/projectService'
import bidService from '@/services/bidService'
import api from '@/services/api'
import AdRail from '@/components/layout/AdRail.vue'

const authStore = useAuthStore()
const router = useRouter()
const viewModeStore = useViewModeStore()
const { currentMode } = storeToRefs(viewModeStore)
// const toast = useToast()

const isContractorView = computed(() => currentMode.value === 'contractor')
const isProviderView = computed(() => currentMode.value === 'provider')

const userName = computed(() => {
  const user = authStore.user
  if (user && user.name) {
    return user.name.split(' ')[0] // Apenas primeiro nome
  }
  return 'Usuario'
})

const lobbyTitle = computed(() => {
  const mode = isContractorView.value ? 'Contratante' : 'Prestador'
  return `🎯 Lobby do ${mode} - ${userName.value}`
})

const lobbyDescription = computed(() =>
  isContractorView.value
    ? 'Gerencie seus leiloes, monitore os lances e acompanhe o vencedor em tempo real.'
    : 'Descubra projetos em aberto, acompanhe disputas e envie lances competitivos instantaneamente.'
)

const lobbyHighlights = computed(() => {
  const total = projects.value.length
  const openCount = projects.value.filter(p => p.status === 'open').length
  const myBidsCount = projects.value.filter(p => p.user_has_bid).length || 0
  const highPriority = projects.value.filter(p => (p.priority || 3) <= 2).length

  if (isContractorView.value) {
    return [
      {
        label: 'Propostas ativas',
        value: myBidsCount,
        caption: 'Gerencie suas propostas com correções às propostas ativas',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        iconBg: 'bg-amber-500/10',
        iconColor: 'text-amber-500'
      },
      {
        label: 'Aguardando lances',
        value: openCount,
        caption: 'Lances comuns lançes, acompanhe o vencedor dos lances',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500'
      },
      {
        label: 'Prioridade alta',
        value: highPriority,
        caption: 'Contratador seleccionou alta parcticipação na armadura em tempo real',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-500'
      }
    ]
  }

  return [
    {
      label: 'Propostas ativas',
      value: myBidsCount,
      caption: 'Gerencie suas propostas com correções às propostas ativas',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-500'
    },
    {
      label: 'Aguardando lances',
      value: openCount,
      caption: 'Lances comuns lançes, acompanhe o vencedor dos lances',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Prioridade alta',
      value: highPriority,
      caption: 'Contratador seleccionou alta parcticipação na armadura em tempo real',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500'
    }
  ]
})

const loading = ref(false)
const projects = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const categoryOptions = projectService.getCategories()

const filters = ref({
  category: '',
  budget: '',
  deadline: '',
  status: ''
})

const showFilters = ref(false)
const showQuickAccess = ref(true)
const showCategoryModal = ref(false)
const newCategory = ref({ name: '', description: '' })
const pendingCategories = ref([])
const showBidModal = ref(false)
const activeBidProject = ref(null)
const bidForm = ref({
  amount: null,
  delivery_time: null,
  proposal: ''
})
const isSubmittingBid = ref(false)

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
    console.warn('Nao foi possivel restaurar filtros do lobby:', error)
  }
}

const persistFilters = () => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(filters.value))
  } catch (error) {
    console.warn('Nao foi possivel salvar filtros do lobby:', error)
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

const ensureAuthHeader = () => {
  if (typeof window === 'undefined') return
  const storedToken = localStorage.getItem('kadesh_token')
  if (!storedToken || storedToken === 'undefined' || storedToken === 'null') {
    console.warn('[Lobby] Nenhum token encontrado para setar header')
    return
  }

  // Setar em multiplas camadas para garantir
  if (api?.defaults?.headers?.common) {
    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`
    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
  }
  if (api?.defaults?.headers) {
    api.defaults.headers.Authorization = `Bearer ${storedToken}`
  }
  console.log('[Lobby] Header Authorization garantido antes de loadProjects')
}

const loadProjects = async () => {
  loading.value = true
  try {
    ensureAuthHeader()

    const endpoint = isContractorView.value ? '/api/projects/my-projects' : '/api/projects'
    const params = {
      per_page: pageSize.value,
      page: currentPage.value
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

const formatCurrencyCompact = (value) => {
  const num = Number(value || 0)
  if (num >= 1000000) {
    return `R$ ${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `R$ ${(num / 1000).toFixed(1)}k`
  }
  return `R$ ${num.toFixed(0)}`
}

const formatDateCompact = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays}d atras`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const formatDeadlineCompact = (dateString) => {
  if (!dateString) return 'Sem prazo'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Sem prazo'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const getCategoryLabel = (value) => {
  const cat = categoryOptions.find(c => c.value === value || c.label === value)
  return cat ? cat.label : (value || 'Geral')
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data nao disponivel'
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
    completed: 'Concluido',
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

const isDeadlineExpired = (project) => {
  if (!project?.deadline) return false
  const deadline = new Date(project.deadline)
  if (Number.isNaN(deadline.getTime())) return false
  return deadline <= new Date()
}

const getBidCount = (project) => {
  if (!project) return 0
  return project.bid_count ?? project.bids_count ?? 0
}

const getLowestBid = (project) => {
  if (!project) return null
  const value = project.lowest_bid_amount ?? project.lowest_bid ?? null
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
      class: 'bg-red-100 text-red-700',
      bgClass: 'bg-red-500/90'
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
  let bgClass = 'bg-emerald-500/90'
  
  if (days <= 2) {
    badgeClass = 'bg-amber-100 text-amber-700'
    bgClass = 'bg-amber-500/90'
  }
  if (hours < 6 && days === 0) {
    badgeClass = 'bg-orange-100 text-orange-700'
    bgClass = 'bg-orange-500/90'
  }
  if (hours === 0 && days === 0) {
    badgeClass = 'bg-red-100 text-red-700'
    bgClass = 'bg-red-500/90'
  }

  return {
    text: label,
    class: badgeClass,
    bgClass: bgClass
  }
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  newCategory.value = { name: '', description: '' }
}

const submitCategoryRequest = () => {
  if (!newCategory.value.name) {
    // toast.error('Informe um nome para a categoria antes de enviar.')
    return
  }
  pendingCategories.value.push({ ...newCategory.value, created_at: new Date() })
    // toast.success('Categoria enviada para analise do administrador.')
  closeCategoryModal()
}

const openBidModal = (project) => {
  if (!isProviderView.value) return
  activeBidProject.value = project
  bidForm.value = {
    amount: null,
    delivery_time: null,
    proposal: ''
  }
  showBidModal.value = true
}

const closeBidModal = () => {
  showBidModal.value = false
  activeBidProject.value = null
}

const submitQuickBid = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/lobby' } })
    return
  }
  if (!bidForm.value.amount || !bidForm.value.delivery_time || !bidForm.value.proposal?.trim()) {
    return
  }
  if (!activeBidProject.value?.id) return

  isSubmittingBid.value = true
  try {
    const payload = {
      project_id: activeBidProject.value.id,
      amount: bidForm.value.amount,
      delivery_time: bidForm.value.delivery_time,
      proposal: bidForm.value.proposal
    }
    const result = await bidService.createBid(payload)
    if (result.success) {
      await loadProjects()
      closeBidModal()
    }
  } catch (error) {
    console.error('Erro ao enviar lance rapido:', error)
  } finally {
    isSubmittingBid.value = false
  }
}

const handleProjectsUpdated = () => {
  loadProjects()
}

onMounted(() => {
  restoreFiltersForMode()
  loadProjects()
  if (typeof window !== 'undefined') {
    window.addEventListener('kadesh:projects-updated', handleProjectsUpdated)
  }
})

watch(currentMode, () => {
  restoreFiltersForMode()
  currentPage.value = 1
  loadProjects()
})

watch(filters, () => {
  persistFilters()
}, { deep: true })

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('kadesh:projects-updated', handleProjectsUpdated)
  }
})
</script>

<style scoped>
.lobby-shell {
  background: radial-gradient(circle at 20% 0%, rgba(212, 175, 55, 0.08), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.1), transparent 28%),
    var(--page-bg);
  min-height: 100vh;
}

.lobby-grid {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1023px) {
  .lobby-grid {
    grid-template-columns: 1fr;
  }
}

.lobby-main {
  min-width: 0;
  width: 100%;
}

.card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.lobby-hero {
  padding: 16px 18px;
}

.hero-eyebrow {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
}

.hero-sub {
  color: var(--text-secondary);
}

.tag {
  background: var(--surface);
  color: var(--accent);
  padding: 6px 12px;
  border-radius: 999px;
  border: 2px solid var(--accent);
  font-weight: 600;
  font-size: 12px;
}

.stat-card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
  padding: 12px 14px;
}

.text-muted {
  color: var(--text-secondary);
}

.text-primary {
  color: var(--text-primary);
}

.bg-surface-alt {
  background: var(--surface-alt);
}

.border-muted {
  border-color: var(--muted-border);
}

.action-tile {
  border: 2px solid var(--card-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.action-tile.primary {
  background: var(--surface);
  border: 2px solid var(--accent);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
}

.action-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.25);
  border-color: var(--accent);
}

.cta-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 2px solid var(--accent);
  color: var(--text-primary);
  background: var(--surface);
  font-weight: 700;
  transition: all 0.2s ease;
}

.cta-link:hover {
  background: var(--accent);
  color: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.cta-outline {
  padding: 10px 18px;
  border-radius: 10px;
  border: 2px solid var(--card-border);
  background: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}.cta-outline:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
}


.cta-bid {
  padding: 8px 12px;
  border-radius: 10px;
  background: #d4af37;
  color: #0f172a;
  font-weight: 800;
  font-size: 12px;
  border: none;
  transition: all 0.2s ease;
}

.cta-bid:hover {
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
  transform: translateY(-1px);
}

.cta-view {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #f5f5f5;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.2s ease;
}

.cta-view:hover {
  border-color: #d4af37;
  color: #d4af37;
}
.filter-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.filter-input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--card-border);
  padding: 10px 14px;
  border-radius: 10px;
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.proposal-highlight {
  border-color: rgba(212, 175, 55, 0.6);
  background: rgba(212, 175, 55, 0.08);
}

.filters-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-width: 1px;
}

.pending-chip {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.12);
  border: 1px dashed var(--card-border);
  color: var(--text-primary);
}

.auction-card-modern {
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auction-card-modern:hover {
  transform: translateY(-6px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1279px) {
  .lobby-grid {
    grid-template-columns: 1fr;
  }

.lobby-main {
  min-width: 0;
}
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>














