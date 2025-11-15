<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Minhas Propostas</h1>
        <p class="mt-2 text-gray-600">Acompanhe todas as suas propostas enviadas</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
              <p class="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
              <p class="text-sm text-gray-600">Pendentes</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.accepted }}</p>
              <p class="text-sm text-gray-600">Aceitas</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
              <p class="text-sm text-gray-600">Rejeitadas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="accepted">Aceita</option>
              <option value="rejected">Rejeitada</option>
              <option value="withdrawn">Retirada</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Todas</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar Por</label>
            <select
              v-model="filters.sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="created_at_asc">Mais Antigas</option>
              <option value="amount_desc">Maior Valor</option>
              <option value="amount_asc">Menor Valor</option>
            </select>
          </div>
        </div>
        
        <div v-if="hasActiveFilters" class="mt-4">
          <button
            @click="clearFilters"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Bids List -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Carregando propostas...</p>
      </div>

      <div v-else-if="error" class="bg-white rounded-lg shadow p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Erro ao carregar propostas</h3>
        <p class="mt-2 text-sm text-gray-600">{{ error }}</p>
        <button
          @click="loadBids"
          class="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Tentar Novamente
        </button>
      </div>

      <div v-else-if="filteredBids.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma proposta encontrada</h3>
        <p class="mt-2 text-sm text-gray-600">
          {{ hasActiveFilters ? 'Tente ajustar os filtros para ver mais resultados.' : 'Você ainda não enviou nenhuma proposta.' }}
        </p>
        <div class="mt-6">
          <router-link
            to="/projects"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Explorar Projetos
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="bid in filteredBids"
          :key="bid.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-semibold text-gray-900">{{ bid.project_title }}</h3>
                  <StatusBadge :status="bid.status" />
                </div>
                <p class="text-sm text-gray-500 mb-3">{{ getCategoryLabel(bid.project_category) }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(bid.amount) }}</p>
                <p class="text-sm text-gray-500">Sua proposta</p>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <p class="text-sm text-gray-700">{{ bid.description }}</p>
            </div>
            
            <div class="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ bid.delivery_time_days }} dias de entrega
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Enviada {{ formatDate(bid.created_at) }}
              </span>
              <span v-if="bid.project_budget" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Orçamento: {{ formatCurrency(bid.project_budget) }}
              </span>
            </div>
            
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <router-link
                :to="`/projects/${bid.project_id}`"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Ver Projeto
              </router-link>
              <button
                v-if="bid.status === 'pending'"
                @click="withdrawBid(bid.id)"
                class="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                Retirar Proposta
              </button>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import Pagination from '@/components/ui/Pagination.vue'
import bidService from '@/services/bidService'
import projectService from '@/services/projectService'
import { useToast } from 'vue-toastification'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const authStore = useAuthStore()
const toast = useToast()

const bids = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const filters = ref({
  status: '',
  category: '',
  sortBy: 'created_at_desc'
})

const categories = projectService.getCategories()

const stats = computed(() => {
  return {
    total: bids.value.length,
    pending: bids.value.filter(b => b.status === 'pending').length,
    accepted: bids.value.filter(b => b.status === 'accepted').length,
    rejected: bids.value.filter(b => b.status === 'rejected').length
  }
})

const hasActiveFilters = computed(() => {
  return filters.value.status !== '' || filters.value.category !== ''
})

const filteredBids = computed(() => {
  let result = [...bids.value]
  
  // Apply filters
  if (filters.value.status) {
    result = result.filter(b => b.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(b => b.project_category === filters.value.category)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (filters.value.sortBy) {
      case 'created_at_desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'created_at_asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'amount_desc':
        return (b.amount || 0) - (a.amount || 0)
      case 'amount_asc':
        return (a.amount || 0) - (b.amount || 0)
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
  let result = [...bids.value]
  
  if (filters.value.status) {
    result = result.filter(b => b.status === filters.value.status)
  }
  
  if (filters.value.category) {
    result = result.filter(b => b.project_category === filters.value.category)
  }
  
  return Math.ceil(result.length / itemsPerPage)
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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

const withdrawBid = async (bidId) => {
  if (!confirm('Tem certeza que deseja retirar esta proposta?')) {
    return
  }

  try {
    const result = await bidService.withdrawBid(bidId)
    
    if (result.success) {
      toast.success('Proposta retirada com sucesso')
      // Update bid status locally
      const bid = bids.value.find(b => b.id === bidId)
      if (bid) {
        bid.status = 'withdrawn'
      }
    } else {
      toast.error(result.error || 'Erro ao retirar proposta')
    }
  } catch (err) {
    console.error('Error withdrawing bid:', err)
    toast.error('Erro ao retirar proposta')
  }
}

const loadBids = async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await bidService.getMyBids()
    
    if (result.success) {
      bids.value = result.data.bids || []
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading bids:', err)
    error.value = 'Erro ao carregar propostas'
  } finally {
    isLoading.value = false
  }
}

// Reset to page 1 when filters change
watch(() => [filters.value.status, filters.value.category], () => {
  currentPage.value = 1
})

onMounted(() => {
  loadBids()
})
</script>
