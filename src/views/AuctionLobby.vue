<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">🎯 Lobby de Leilões Reversos</h1>
        <p class="text-gray-600">Acompanhe todas as propostas e disputas em tempo real - Lance menor vence!</p>
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
          v-if="user?.type === 'client'"
          to="/projects/create"
          class="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg shadow hover:shadow-md transition"
        >
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-sm font-medium">Novo Projeto</span>
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

      <div v-else class="space-y-6">
        <!-- Auction Card for each project -->
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
        >
          <!-- Countdown Timer Banner -->
          <div 
            v-if="project.status === 'open' && project.deadline"
            class="px-6 py-3 flex items-center justify-between"
            :class="getCountdownBannerClass(project)"
          >
            <div class="flex items-center space-x-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-white">
                <p class="font-semibold">{{ getCountdownStatus(project) }}</p>
                <p class="text-sm text-white/80">Envie sua proposta antes do prazo</p>
              </div>
            </div>
            <div class="text-right text-white">
              <p class="text-sm opacity-80">Tempo restante</p>
              <p class="text-2xl font-bold font-mono">{{ getCountdownDisplay(project) }}</p>
            </div>
          </div>

          <!-- Deadline passed banner -->
          <div 
            v-else-if="project.status === 'open' && !project.deadline"
            class="px-6 py-3 bg-gray-500 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3 text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">Sem prazo definido</span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex flex-col lg:flex-row gap-6">
              <!-- Project Image/Thumbnail -->
              <div class="lg:w-48 flex-shrink-0">
                <div v-if="project.attachments && project.attachments.length > 0" class="aspect-video lg:aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    :src="project.attachments[0].file_url" 
                    :alt="project.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-else class="aspect-video lg:aspect-square rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg class="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Project Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <router-link
                      :to="`/projects/${project.id}`"
                      class="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                    >
                      {{ project.title }}
                    </router-link>
                    <div class="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {{ project.category || 'Geral' }}
                      </span>
                      <span class="flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ project.client_name || 'Contratante' }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-gray-500">Orçamento máximo</div>
                    <div class="text-2xl font-bold text-blue-600">
                      R$ {{ formatCurrency(project.budget) }}
                    </div>
                  </div>
                </div>

                <p class="text-gray-700 mb-4 line-clamp-2">{{ project.description }}</p>

                <!-- Bids Summary -->
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-900">
                      📊 Resumo das Propostas ({{ project.bids?.length || project.bid_count || 0 }})
                    </h3>
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        project.status === 'open' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      ]"
                    >
                      {{ getStatusLabel(project.status) }}
                    </span>
                  </div>

                  <!-- Bid List - Sorted by lowest price (winner first) -->
                  <div v-if="project.bids && project.bids.length > 0" class="space-y-2">
                    <div 
                      v-for="(bid, index) in getSortedBids(project.bids).slice(0, 3)" 
                      :key="bid.id"
                      :class="[
                        'flex items-center justify-between p-3 rounded-lg transition',
                        index === 0 ? 'bg-green-50 border-2 border-green-300' : 'bg-white border border-gray-200'
                      ]"
                    >
                      <div class="flex items-center space-x-3">
                        <!-- Ranking Badge -->
                        <div :class="[
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          index === 0 ? 'bg-green-500 text-white' : 
                          index === 1 ? 'bg-gray-400 text-white' : 
                          'bg-gray-300 text-gray-600'
                        ]">
                          {{ index === 0 ? '🏆' : index + 1 }}
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ bid.provider_name }}</p>
                          <div class="flex items-center text-xs text-gray-500">
                            <svg class="w-3 h-3 mr-1 text-yellow-500 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                            <span>{{ formatRating(bid.rating) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="text-right">
                        <p :class="[
                          'font-bold',
                          index === 0 ? 'text-green-600 text-lg' : 'text-gray-900'
                        ]">
                          R$ {{ formatCurrency(bid.amount) }}
                        </p>
                        <p class="text-xs text-gray-500">{{ bid.delivery_time }} dias</p>
                      </div>
                    </div>
                    
                    <!-- Show more bids link -->
                    <div v-if="project.bids.length > 3" class="text-center pt-2">
                      <router-link 
                        :to="`/projects/${project.id}`"
                        class="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Ver todas as {{ project.bids.length }} propostas →
                      </router-link>
                    </div>
                  </div>

                  <!-- No bids yet -->
                  <div v-else class="text-center py-4 text-gray-500">
                    <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Nenhuma proposta ainda. Seja o primeiro!</p>
                  </div>
                </div>

                <!-- Winner Display (for completed auctions) -->
                <div 
                  v-if="project.status === 'in_progress' && project.winner"
                  class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white mb-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                        🏆
                      </div>
                      <div>
                        <p class="font-bold text-lg">Vencedor do Leilão</p>
                        <p class="text-white/90">{{ project.winner.provider_name }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-white/80 text-sm">Lance vencedor</p>
                      <p class="text-2xl font-bold">R$ {{ formatCurrency(project.winner.amount) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Criado {{ formatDate(project.created_at) }}</span>
                  </div>
                  <div class="flex gap-2">
                    <router-link
                      :to="`/projects/${project.id}`"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                    >
                      Ver Detalhes
                    </router-link>
                    <button
                      v-if="project.status === 'open' && user?.type === 'provider'"
                      @click="goToBid(project.id)"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                    >
                      Dar Lance
                    </button>
                  </div>
                </div>
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
            class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span class="relative inline-flex items-center px-6 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            Página {{ currentPage }}
          </span>
          <button
            @click="currentPage++"
            :disabled="filteredProjects.length < pageSize"
            class="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Próxima →
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const loading = ref(false)
const projects = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const countdownIntervals = ref({})

const filters = ref({
  category: '',
  budget: '',
  deadline: '',
  status: ''
})

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
    const response = await api.get('/api/projects', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    const projectList = response.data.projects || response.data
    
    // Load bids for each project
    const projectsWithBids = await Promise.all(
      projectList.map(async (project) => {
        try {
          const bidsResponse = await api.get(`/api/bids/project/${project.id}`)
          return {
            ...project,
            bids: bidsResponse.data.bids || []
          }
        } catch (error) {
          return { ...project, bids: [] }
        }
      })
    )
    
    projects.value = projectsWithBids
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
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

const goToBid = (projectId) => {
  router.push(`/projects/${projectId}`)
}

// Sort bids by lowest amount (reverse auction - lowest wins)
const getSortedBids = (bids) => {
  if (!bids || bids.length === 0) return []
  return [...bids].sort((a, b) => (a.amount || 0) - (b.amount || 0))
}

// Countdown helpers
const getTimeRemaining = (deadline) => {
  if (!deadline) return null
  
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diff = deadlineDate - now
  
  if (diff <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return { expired: false, days, hours, minutes, seconds }
}

const getCountdownDisplay = (project) => {
  const time = getTimeRemaining(project.deadline)
  if (!time) return '--:--:--'
  if (time.expired) return 'Encerrado'
  
  if (time.days > 0) {
    return `${time.days}d ${String(time.hours).padStart(2, '0')}h ${String(time.minutes).padStart(2, '0')}m`
  }
  
  return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`
}

const getCountdownStatus = (project) => {
  const time = getTimeRemaining(project.deadline)
  if (!time) return 'Leilão Aberto'
  if (time.expired) return 'Leilão Encerrado'
  if (time.days > 2) return 'Leilão Ativo'
  if (time.days > 0) return 'Terminando em breve'
  if (time.hours > 6) return 'Últimas horas!'
  return 'Encerrando agora!'
}

const getCountdownBannerClass = (project) => {
  const time = getTimeRemaining(project.deadline)
  if (!time || time.expired) return 'bg-gray-500'
  if (time.days > 2) return 'bg-gradient-to-r from-green-500 to-emerald-600'
  if (time.days > 0) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
  if (time.hours > 6) return 'bg-gradient-to-r from-orange-500 to-red-500'
  return 'bg-gradient-to-r from-red-500 to-red-700'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Novo'
  const parsed = Number(rating)
  if (Number.isNaN(parsed)) return 'Novo'
  return parsed.toFixed(1)
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

// Update countdowns every second
let countdownTimer = null

const startCountdownTimer = () => {
  countdownTimer = setInterval(() => {
    // Force reactivity update by triggering a small state change
    projects.value = [...projects.value]
  }, 1000)
}

onMounted(() => {
  loadProjects()
  startCountdownTimer()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
