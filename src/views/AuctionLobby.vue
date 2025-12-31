<template>
  <div class="lobby-shell py-8 px-4 sm:px-6 lg:px-8">
    <div class="lobby-grid max-w-7xl mx-auto">
      <div class="space-y-8">
        <section class="lobby-hero card">
          <div class="flex flex-wrap items-start justify-between gap-6">
            <div class="space-y-3">
              <p class="hero-eyebrow">Service Bridge • Acesso premium</p>
              <h1 class="hero-title">{{ lobbyTitle }}</h1>
              <p class="hero-sub">{{ lobbyDescription }}</p>
              <div class="flex flex-wrap gap-2">
                <span class="tag">Modo: {{ isContractorView ? 'Contratante' : 'Prestador' }}</span>
                <span class="tag">{{ projects.length }} projetos carregados</span>
              </div>
            </div>
            <div class="flex flex-col gap-3 min-w-[240px]">
              <router-link to="/" class="cta-link">Voltar para a Home</router-link>
              <button class="cta-outline" @click="showQuickAccess = !showQuickAccess">
                {{ showQuickAccess ? 'Esconder acessos' : 'Mostrar acessos' }}
              </button>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="highlight in lobbyHighlights"
            :key="highlight.label"
            class="stat-card card"
          >
            <p class="text-sm text-muted">{{ highlight.label }}</p>
            <p class="text-3xl font-bold text-primary">{{ highlight.value }}</p>
            <span class="text-xs font-semibold" :class="highlight.text">{{ highlight.caption }}</span>
          </div>
        </section>

        <section class="card">
          <div class="flex items-center justify-between gap-4 mb-4">
            <div>
              <p class="text-sm text-muted">Acesso rápido</p>
              <h2 class="text-xl font-semibold">Navegue pelo que importa agora</h2>
            </div>
            <button class="cta-outline" @click="showQuickAccess = !showQuickAccess">
              {{ showQuickAccess ? 'Recolher' : 'Expandir' }}
            </button>
          </div>
          <transition name="fade">
            <div v-if="showQuickAccess" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <router-link to="/dashboard" class="action-tile">
                <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </router-link>

              <router-link
                v-if="isContractorView"
                to="/projects/create"
                class="action-tile primary"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Novo Projeto</span>
              </router-link>
              <router-link
                v-else
                to="/projects"
                class="action-tile primary"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Explorar Projetos</span>
              </router-link>

              <router-link to="/wallet" class="action-tile">
                <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Carteira</span>
              </router-link>

              <router-link to="/contracts" class="action-tile">
                <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Contratos</span>
              </router-link>
            </div>
          </transition>
        </section>

        <section class="card">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm text-muted">Filtros e curadoria</p>
              <h2 class="text-xl font-semibold">Refine o grid do Lobby</h2>
            </div>
            <button class="cta-link" @click="showCategoryModal = true">
              <span class="text-lg font-bold mr-1">+</span> Nova categoria
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="filter-label">Categoria</label>
              <select
                v-model="filters.category"
                class="filter-input"
              >
                <option value="">Todas</option>
                <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>

            <div>
              <label class="filter-label">Orçamento (Máx)</label>
              <select
                v-model="filters.budget"
                class="filter-input"
              >
                <option value="">Qualquer</option>
                <option value="500">Até R$ 500</option>
                <option value="1000">Até R$ 1.000</option>
                <option value="5000">Até R$ 5.000</option>
                <option value="10000">Até R$ 10.000</option>
              </select>
            </div>

            <div>
              <label class="filter-label">Prazo</label>
              <select
                v-model="filters.deadline"
                class="filter-input"
              >
                <option value="">Qualquer</option>
                <option value="7">Até 7 dias</option>
                <option value="15">Até 15 dias</option>
                <option value="30">Até 30 dias</option>
                <option value="60">Até 60 dias</option>
              </select>
            </div>

            <div>
              <label class="filter-label">Status</label>
              <select
                v-model="filters.status"
                class="filter-input"
              >
                <option value="">Todos</option>
                <option value="open">Aberto (aceita propostas)</option>
                <option value="in_progress">Em andamento</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          <div v-if="pendingCategories.length" class="pending-chip">
            Última sugestão: {{ pendingCategories[pendingCategories.length - 1].name }} aguardando validação do ADM.
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button
              @click="clearFilters"
              class="cta-ghost"
            >
              Limpar filtros
            </button>
            <button
              @click="applyFilters"
              class="cta-link"
            >
              Aplicar filtros
            </button>
          </div>
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
          <!-- Grid de cards de leilão estilo Monitor Leilão / Vestri -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="project in filteredProjects"
              :key="project.id"
              class="auction-card-modern group"
            >
              <!-- Image Thumbnail -->
              <div class="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0F1117]">
                <img
                  v-if="project.attachments && project.attachments.length > 0"
                  :src="project.attachments[0]"
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
                
                <!-- Status Badge -->
                <div class="absolute top-3 left-3">
                  <span
                    :class="[
                      'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm',
                      project.status === 'open' ? 'bg-emerald-500/90 text-white' :
                      project.status === 'in_progress' ? 'bg-amber-500/90 text-white' :
                      'bg-gray-500/90 text-white'
                    ]"
                  >
                    {{ getStatusLabel(project.status) }}
                  </span>
                </div>

                <!-- Countdown Timer - Prominent Display -->
                <div
                  v-if="getDeadlineBadge(project)"
                  class="absolute top-3 right-3"
                >
                  <div
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
                <div class="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#0F1117] rounded-xl">
                  <div class="text-center">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Orçamento</p>
                    <p class="text-base font-bold text-[#D4AF37]">
                      {{ formatCurrencyCompact(project.budget) }}
                    </p>
                  </div>
                  <div class="text-center border-x border-[rgba(212,175,55,0.1)]">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Propostas</p>
                    <p class="text-base font-bold text-[#F5F5F5]">{{ getBidCount(project) }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-xs text-[#8A8A8A] uppercase mb-1">Menor</p>
                    <p class="text-base font-bold" :class="getLowestBid(project) ? 'text-emerald-400' : 'text-[#8A8A8A]'">
                      {{ getLowestBid(project) ? formatCurrencyCompact(getLowestBid(project)) : '—' }}
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
                  <router-link
                    :to="`/projects/${project.id}`"
                    class="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E5C04A] text-[#0F1117] font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all transform hover:scale-105"
                  >
                    {{ isProviderView ? 'Dar Lance' : 'Ver' }}
                  </router-link>
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
              Página {{ currentPage }}
            </span>
            <button
              @click="currentPage++"
              :disabled="filteredProjects.length < pageSize"
              class="pagination-button rounded-r-md"
            >
              Próxima
            </button>
          </nav>
        </div>
      </div>

      <AdRail position="right" />
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
              <label class="filter-label">Descrição</label>
              <textarea v-model="newCategory.description" rows="3" class="filter-input" placeholder="Conte rapidamente o que engloba a categoria" />
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <button class="cta-ghost" @click="closeCategoryModal">Cancelar</button>
            <button class="cta-link" @click="submitCategoryRequest">Enviar para validação</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
// import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useViewModeStore } from '@/stores/viewModeStore'
import projectService from '@/services/projectService'
import api from '@/services/api'
import AdRail from '@/components/layout/AdRail.vue'

const authStore = useAuthStore()
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
  return 'Usuário'
})

const lobbyTitle = computed(() => {
  const mode = isContractorView.value ? 'Contratante' : 'Prestador'
  return `🎯 Lobby do ${mode} - ${userName.value}`
})

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
        text: 'text-amber-400'
      },
      {
        label: 'Aceitando propostas',
        value: openCount,
        caption: 'leilões abertos agora',
        text: 'text-amber-400'
      },
      {
        label: 'Prioridade alta',
        value: highPriority,
        caption: 'precisam de atenção',
        text: 'text-amber-300'
      }
    ]
  }

  return [
    {
      label: 'Projetos disponíveis',
      value: openCount,
      caption: 'aceitando novos lances',
      text: 'text-amber-400'
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
      text: 'text-amber-400'
    },
    {
      label: 'Alta prioridade',
      value: highPriority,
      caption: 'pagam melhor',
      text: 'text-amber-400'
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

const showQuickAccess = ref(true)
const showCategoryModal = ref(false)
const newCategory = ref({ name: '', description: '' })
const pendingCategories = ref([])

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

const ensureAuthHeader = () => {
  if (typeof window === 'undefined') return
  const storedToken = localStorage.getItem('kadesh_token')
  if (!storedToken) {
    console.warn('[Lobby] Nenhum token encontrado para setar header')
    return
  }

  // Setar em múltiplas camadas para garantir
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
  if (diffDays < 7) return `${diffDays}d atrás`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const getCategoryLabel = (value) => {
  const cat = categoryOptions.find(c => c.value === value || c.label === value)
  return cat ? cat.label : (value || 'Geral')
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
    // toast.success('Categoria enviada para análise do administrador.')
  closeCategoryModal()
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
.lobby-shell {
  background: radial-gradient(circle at 20% 0%, rgba(212, 175, 55, 0.08), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(99, 102, 241, 0.1), transparent 28%),
    var(--page-bg);
}

.lobby-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 18px;
}

.card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.hero-eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.hero-title {
  font-size: 30px;
  font-weight: 800;
}

.hero-sub {
  color: var(--text-secondary);
}

.tag {
  background: var(--surface);
  color: var(--accent);
  padding: 8px 16px;
  border-radius: 999px;
  border: 2px solid var(--accent);
  font-weight: 600;
  font-size: 13px;
}

.stat-card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
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
  padding: 12px 20px;
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
  padding: 12px 20px;
  border-radius: 10px;
  border: 2px solid var(--card-border);
  background: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.cta-outline:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
}

.cta-ghost {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--muted-border);
  color: var(--text-secondary);
  background: transparent;
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
  border: 2px solid var(--card-border);
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

.pending-chip {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(212, 175, 55, 0.12);
  border: 1px dashed var(--card-border);
  color: var(--text-primary);
}

.project-card {
  border: 2px solid var(--card-border);
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: var(--accent);
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

/* Auction Card - Novo design */
.auction-card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.auction-card:hover {
  border-color: var(--accent);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
  transform: translateY(-4px);
}

.countdown-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.bg-surface-alt {
  background: var(--surface-alt);
}

.text-muted {
  color: var(--text-secondary);
}

.border-muted {
  border-color: var(--muted-border);
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border: 2px solid var(--card-border);
  font-size: 14px;
  font-weight: 600;
  background: var(--surface);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--accent);
  color: #0f172a;
}

.pagination-button:disabled {
  opacity: 0.5;
}

.pagination-current {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border: 2px solid var(--accent);
  font-size: 14px;
  font-weight: 700;
  background: var(--surface);
  color: var(--accent);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.modal-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 520px;
  border: 1px solid var(--card-border);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.28);
}

/* Auction Card - Novo design estilo Monitor Leilão/Vestri */
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
}
</style>

