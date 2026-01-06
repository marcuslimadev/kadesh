<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-heading">Meus Projetos</h1>
        <p class="mt-2 text-body">Gerencie todos os seus projetos publicados</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-heading">{{ stats.total }}</p>
              <p class="text-sm text-body">Total</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-heading">{{ stats.open }}</p>
              <p class="text-sm text-body">Abertos</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-heading">{{ stats.in_progress }}</p>
              <p class="text-sm text-body">Em Andamento</p>
            </div>
          </div>
        </div>
        
        <div class="bg-[#161821] rounded-lg shadow-lg p-6 border border-[rgba(212,175,55,0.24)]">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] mr-4 border border-[#D4AF37]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-heading">{{ stats.completed }}</p>
              <p class="text-sm text-body">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-[#161821] rounded-lg shadow-lg p-6 mb-6 border border-[rgba(212,175,55,0.24)]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-body mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-heading focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-body mb-2">Categoria</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-heading focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-body mb-2">Ordenar Por</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-[rgba(212,175,55,0.24)] rounded-md bg-[#1A1A1A] text-heading focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="created_at_asc">Mais Antigos</option>
              <option value="budget_desc">Maior Orçamento</option>
              <option value="budget_asc">Menor Orçamento</option>
              <option value="bids_desc">Mais Propostas</option>
            </select>
          </div>
        </div>
        
        <div v-if="hasActiveFilters" class="mt-4">
          <button
            @click="clearFilters"
            class="text-sm text-[#D4AF37] hover:text-[#E5C04A] font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Projects List -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        <p class="mt-4 text-body">Carregando projetos...</p>
      </div>

      <div v-else-if="error" class="bg-[#161821] rounded-lg shadow-lg p-8 text-center border border-[rgba(212,175,55,0.24)]">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Erro ao carregar projetos</h3>
        <p class="mt-2 text-sm text-body">{{ error }}</p>
        <button
          @click="loadProjects"
          class="mt-6 px-4 py-2 bg-[#D4AF37] text-[#0F1117] font-semibold rounded-md hover:bg-[#E5C04A]"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredProjects.length === 0" class="bg-[#161821] rounded-lg shadow-lg p-12 text-center border border-[rgba(212,175,55,0.24)]">
        <svg class="mx-auto h-12 w-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Nenhum projeto encontrado</h3>
        <p class="mt-2 text-sm text-body">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você ainda não criou nenhum projeto.' }}
        </p>
        <div class="mt-6">
          <router-link
            to="/projects/create"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Criar Novo Projeto
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="auction-card-modern group"
          >
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
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
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
              <div v-if="getDeadlineBadge(project)" class="absolute top-3 right-3">
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
            </div>

            <div class="p-5 bg-[#161821] border-x border-b border-[rgba(212,175,55,0.24)] rounded-b-2xl">
              <span class="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold rounded-full mb-3">
                {{ getCategoryLabel(project.category) }}
              </span>

              <p class="text-xs uppercase tracking-wide text-[#C7C7C7] mb-1">
                Contratante: <span class="text-[#F5F5F5] font-semibold">{{ userName }}</span>
              </p>

              <router-link
                :to="`/projects/${project.id}`"
                class="block text-lg font-bold text-[#F5F5F5] hover:text-[#D4AF37] transition-colors line-clamp-2 mb-3 leading-tight"
              >
                {{ project.title }}
              </router-link>

              <p class="text-[#C7C7C7] text-sm line-clamp-2 mb-4">
                {{ project.description }}
              </p>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 bg-[#0F1117] rounded-xl">
                <div class="text-center">
                  <p class="text-xs text-[#8A8A8A] uppercase mb-1">Orcamento</p>
                  <p class="text-base font-bold text-[#D4AF37]">
                    {{ formatCurrencyCompact(project.budget || project.max_budget) }}
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
                    {{ getLowestBid(project) ? formatCurrencyCompact(getLowestBid(project)) : '—' }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-[rgba(212,175,55,0.1)]">
                <router-link
                  :to="`/projects/${project.id}`"
                  class="cta-view"
                >
                  Ver Detalhes
                </router-link>
                <button
                  v-if="project.status === 'open'"
                  class="cta-bid"
                >
                  Ver Propostas ({{ getBidCount(project) }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/ui/Pagination.vue'
import projectService from '@/services/projectService'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const authStore = useAuthStore()

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const userName = computed(() => authStore.user?.name || 'Voce')

const filters = ref({
  status: '',
  category: '',
  sortBy: 'created_at_desc'
})

const categories = projectService.getCategories()

const stats = computed(() => {
  return {
    total: projects.value.length,
    open: projects.value.filter(p => p.status === 'open').length,
    in_progress: projects.value.filter(p => p.status === 'in_progress').length,
    completed: projects.value.filter(p => p.status === 'completed').length
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.category !== ''
})

const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  // Apply filters
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'created_at_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'created_at_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'budget_desc':
        return (b.budget || 0) - (a.budget || 0)
      case 'budget_asc':
        return (a.budget || 0) - (b.budget || 0)
      case 'bids_desc':
        return (b.bid_count || 0) - (a.bid_count || 0)
      default:
        return 0
    }
  })
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return result.slice(start, end)
})

const totalPages = computed(() => {
  let result = [...projects.value]
  
  if (filters.value.status) {
    result = result.filter(p => p.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  
  return Math.ceil(result.length / itemsPerPage)
})

const normalizeAttachments = (project) => {
  if (!project) return []
  if (!Array.isArray(project.attachments)) return []
  return project.attachments
    .map(item => (typeof item === 'string' ? { file_url: item } : item))
    .filter(Boolean)
}

const getCoverImage = (project) => {
  const list = normalizeAttachments(project)
  const firstImage = list.find(item => item?.mime_type?.startsWith('image/')) || list[0]
  return firstImage?.file_url || null
}

const formatDate = (date) => {
  if (!date) return 'Data nao disponivel'
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch (error) {
    return 'Data invalida'
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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

const formatDeadlineCompact = (dateString) => {
  if (!dateString) return 'Sem prazo'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Sem prazo'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
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

  let bgClass = 'bg-emerald-500/90'
  if (days <= 2) {
    bgClass = 'bg-amber-500/90'
  }
  if (hours < 6 && days === 0) {
    bgClass = 'bg-orange-500/90'
  }
  if (hours === 0 && days === 0) {
    bgClass = 'bg-red-500/90'
  }

  return {
    text: label,
    bgClass
  }
}

const getCategoryLabel = (value) => {
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const clearFilters = () => {
  filters.value = {
    status: '',
    category: '',
    sortBy: 'created_at_desc'
  }
  currentPage.value = 1
}

const loadProjects = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await projectService.getMyProjects()
    
    if (result.success) {
      projects.value = result.data.projects || []
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading projects:', err)
    error.value = 'Erro ao carregar projetos'
  } finally {
    isLoading.value = false
  }
}

const handleProjectsUpdated = () => {
  loadProjects()
}

// Reset to page 1 when filters change
watch(() => [filters.value.status, filters.value.category], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadProjects()
  if (typeof window !== 'undefined') {
    window.addEventListener('kadesh:projects-updated', handleProjectsUpdated)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('kadesh:projects-updated', handleProjectsUpdated)
  }
})
</script>

<style scoped>
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
</style>







