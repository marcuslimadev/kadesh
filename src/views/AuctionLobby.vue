<template>
  <div class="lobby-shell py-8 px-4 sm:px-6 lg:px-8">
    <div class="lobby-grid max-w-7xl mx-auto">
      <AdRail position="left" />

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
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Carteira</span>
              </router-link>

              <router-link to="/contracts" class="action-tile">
                <svg class="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div v-else class="space-y-4">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="card project-card"
          >
            <div class="grid gap-6 md:grid-cols-[180px_1fr]">
              <div class="relative">
                <div
                  class="h-40 w-full rounded-xl overflow-hidden bg-surface-alt flex items-center justify-center border border-muted"
                >
                  <img
                    v-if="getCoverImage(project)"
                    :src="getCoverImage(project)"
                    :alt="project.title"
                    class="object-cover w-full h-full"
                  />
                  <div v-else class="text-center px-4">
                    <svg class="w-10 h-10 text-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10M7 11h10M7 15h7" />
                    </svg>
                    <p class="text-xs text-muted mt-2">Sem anexos enviados</p>
                  </div>
                </div>
                <div
                  v-if="attachmentCount(project)"
                  class="absolute top-2 left-2 bg-surface-alt/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary shadow border border-muted"
                >
                  {{ attachmentCount(project) }} {{ attachmentCount(project) === 1 ? 'arquivo' : 'arquivos' }}
                </div>
              </div>

              <div>
                <div class="flex flex-wrap gap-4 items-start justify-between">
                  <div class="flex-1 min-w-[220px] space-y-2">
                    <router-link
                      :to="`/projects/${project.id}`"
                      class="text-xl font-semibold text-primary hover:text-gold"
                    >
                      {{ project.title }}
                    </router-link>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-muted">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {{ getCategoryLabel(project.category) }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDate(project.created_at) }}
                      </span>
                      <span v-if="project.deadline" class="flex items-center text-amber-300">
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
                    <p class="text-xs uppercase tracking-wide text-muted">Orçamento Máx.</p>
                    <div class="text-2xl font-bold text-gold">R$ {{ formatCurrency(project.budget) }}</div>
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

                <p class="text-muted my-4 line-clamp-2">{{ project.description }}</p>

                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center text-muted">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{{ project.client_name || 'Contratante' }}</span>
                    </div>
                    <div class="flex items-center text-gold font-medium">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      {{ getBidCount(project) }} {{ getBidCount(project) === 1 ? 'proposta' : 'propostas' }}
                    </div>
                    <div
                      v-if="getBidCount(project) && getLowestBid(project)"
                      class="flex items-center text-emerald-300 font-medium"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Menor lance: R$ {{ formatCurrency(getLowestBid(project)) }}
                    </div>
                  </div>
                  <router-link
                    :to="`/projects/${project.id}`"
                    class="cta-link"
                  >
                    Ver detalhes
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
import { useViewModeStore } from '@/stores/viewModeStore'
import projectService from '@/services/projectService'
import api from '@/services/api'
import AdRail from '@/components/layout/AdRail.vue'

const viewModeStore = useViewModeStore()
const { currentMode } = storeToRefs(viewModeStore)
// const toast = useToast()

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
        text: 'text-blue-300'
      },
      {
        label: 'Aceitando propostas',
        value: openCount,
        caption: 'leilões abertos agora',
        text: 'text-emerald-300'
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
      text: 'text-emerald-300'
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
      text: 'text-blue-300'
    },
    {
      label: 'Alta prioridade',
      value: highPriority,
      caption: 'pagam melhor',
      text: 'text-purple-300'
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

const loadProjects = async () => {
  loading.value = true
  try {
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
  grid-template-columns: auto 1fr auto;
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
