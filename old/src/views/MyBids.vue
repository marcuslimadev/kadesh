<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <LoadingScreen v-if="loading" message="Carregando lances..." icon="🎯" />
    
    <main v-else class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-primary-900 mb-6">🎯 Meus Lances</h1>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div class="text-sm opacity-80 mb-1">Total de Lances</div>
          <div class="text-4xl font-bold">{{ totalBids }}</div>
        </div>
        <div class="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div class="text-sm opacity-80 mb-1">Em 1º Lugar 🥇</div>
          <div class="text-4xl font-bold">{{ firstPlaceBids }}</div>
        </div>
        <div class="card bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div class="text-sm opacity-80 mb-1">Vencidos ✅</div>
          <div class="text-4xl font-bold">{{ wonBids }}</div>
        </div>
        <div class="card bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div class="text-sm opacity-80 mb-1">Taxa de Vitória</div>
          <div class="text-4xl font-bold">{{ winRate }}%</div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="flex gap-3 mb-6">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-2 rounded-lg font-medium transition-all"
          :class="activeFilter === filter.value
            ? 'bg-primary-900 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Lista de Bids -->
      <div v-if="filteredBids.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-2">Nenhum lance encontrado</h2>
        <p class="text-gray-500 mb-6">{{ getEmptyMessage() }}</p>
        <router-link to="/auctions" class="btn btn-primary">
          🔍 Explorar Leilões
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="bid in filteredBids"
          :key="bid.id"
          class="card border-l-4 hover:shadow-lg transition-all cursor-pointer"
          :class="getBidCardClass(bid)"
          @click="router.push(`/auction/${bid.auction_id}`)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">{{ getBidStatusIcon(bid) }}</span>
                <h3 class="text-lg font-bold text-primary-900">{{ bid.project_title }}</h3>
                <span
                  class="text-xs px-2 py-1 rounded-full font-semibold"
                  :class="getBidStatusBadgeClass(bid)"
                >
                  {{ getBidStatusLabel(bid) }}
                </span>
              </div>
              
              <div class="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <div class="text-xs text-gray-600">Meu Lance</div>
                  <div class="text-xl font-bold text-green-600">R$ {{ bid.amount.toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-600">Score</div>
                  <div class="text-xl font-bold text-primary-900">{{ bid.calculated_score.toFixed(1) }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-600">Posição Atual</div>
                  <div class="text-xl font-bold" :class="getPositionColor(bid.current_position)">
                    #{{ bid.current_position || '?' }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-600">Total de Lances</div>
                  <div class="text-xl font-bold text-gray-700">{{ bid.total_bids }}</div>
                </div>
              </div>

              <div v-if="bid.proposal_text" class="pt-3 border-t border-gray-200">
                <button
                  @click.stop="toggleProposal(bid.id)"
                  class="text-sm text-primary-900 hover:text-accent-500 font-medium"
                >
                  {{ expandedProposals.includes(bid.id) ? '▼ Ocultar Proposta' : '▶ Ver Proposta' }}
                </button>
                <p
                  v-if="expandedProposals.includes(bid.id)"
                  class="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded"
                >
                  {{ bid.proposal_text }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-200">
            <div>
              📅 Lance feito em {{ formatDate(bid.created_at) }}
            </div>
            <button
              @click.stop="router.push(`/auction/${bid.auction_id}`)"
              class="text-primary-900 hover:text-accent-500 font-semibold"
            >
              Ver Leilão →
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)
const bids = ref([])
const activeFilter = ref('all')
const expandedProposals = ref([])

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'won', label: 'Vencidos' },
  { value: 'lost', label: 'Perdidos' }
]

const totalBids = computed(() => bids.value.length)
const firstPlaceBids = computed(() => bids.value.filter(b => b.current_position === 1).length)
const wonBids = computed(() => bids.value.filter(b => b.status === 'won').length)
const winRate = computed(() => {
  if (totalBids.value === 0) return 0
  return Math.round((wonBids.value / totalBids.value) * 100)
})

const filteredBids = computed(() => {
  if (activeFilter.value === 'all') return bids.value
  if (activeFilter.value === 'active') {
    return bids.value.filter(b => b.auction_status === 'active')
  }
  if (activeFilter.value === 'won') {
    return bids.value.filter(b => b.status === 'won')
  }
  if (activeFilter.value === 'lost') {
    return bids.value.filter(b => b.status === 'lost')
  }
  return bids.value
})

const getBidCardClass = (bid) => {
  if (bid.current_position === 1) return 'border-yellow-500 bg-yellow-50'
  if (bid.status === 'won') return 'border-green-500 bg-green-50'
  if (bid.status === 'lost') return 'border-red-500 bg-red-50'
  return 'border-gray-200 bg-white'
}

const getBidStatusIcon = (bid) => {
  if (bid.current_position === 1) return '🥇'
  if (bid.status === 'won') return '✅'
  if (bid.status === 'lost') return '❌'
  return '🏅'
}

const getBidStatusLabel = (bid) => {
  if (bid.current_position === 1 && bid.auction_status === 'active') return 'Em 1º Lugar'
  if (bid.status === 'won') return 'Vencedor'
  if (bid.status === 'lost') return 'Não Venceu'
  if (bid.auction_status === 'active') return 'Ativo'
  return 'Encerrado'
}

const getBidStatusBadgeClass = (bid) => {
  if (bid.current_position === 1 && bid.auction_status === 'active') {
    return 'bg-yellow-200 text-yellow-900'
  }
  if (bid.status === 'won') return 'bg-green-200 text-green-900'
  if (bid.status === 'lost') return 'bg-red-200 text-red-900'
  return 'bg-gray-200 text-gray-900'
}

const getPositionColor = (position) => {
  if (position === 1) return 'text-yellow-600'
  if (position === 2) return 'text-gray-500'
  if (position === 3) return 'text-orange-600'
  return 'text-gray-700'
}

const getEmptyMessage = () => {
  if (activeFilter.value === 'active') return 'Você não tem lances ativos no momento'
  if (activeFilter.value === 'won') return 'Você ainda não venceu nenhum leilão'
  if (activeFilter.value === 'lost') return 'Nenhum leilão perdido'
  return 'Comece a dar lances em projetos!'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const toggleProposal = (bidId) => {
  const index = expandedProposals.value.indexOf(bidId)
  if (index > -1) {
    expandedProposals.value.splice(index, 1)
  } else {
    expandedProposals.value.push(bidId)
  }
}

const fetchMyBids = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/bids/my', { withCredentials: true })
    bids.value = response.data.bids || []
  } catch (error) {
    console.error('Erro ao carregar lances:', error)
    // Mock data for development
    bids.value = [
      {
        id: 1,
        auction_id: 1,
        project_title: 'Desenvolvimento de App Mobile',
        amount: 450,
        calculated_score: 85.5,
        current_position: 1,
        total_bids: 5,
        auction_status: 'active',
        status: null,
        proposal_text: 'Tenho experiência em React Native...',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        auction_id: 2,
        project_title: 'Design de Logo',
        amount: 200,
        calculated_score: 78.2,
        current_position: 3,
        total_bids: 8,
        auction_status: 'active',
        status: null,
        proposal_text: null,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyBids()
})
</script>
