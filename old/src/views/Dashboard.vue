<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <LoadingScreen v-if="loading" message="Carregando dashboard..." icon="📊" />
    
    <main v-else class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-primary-900">
          👋 Olá, {{ user?.name || 'Usuário' }}!
        </h1>
        <p class="text-gray-600 mt-1">
          {{ getUserGreeting() }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="card bg-gradient-to-br from-primary-900 to-primary-700 text-white hover:scale-105 transition-transform"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="text-4xl">{{ stat.icon }}</div>
            <div class="text-xs bg-white/20 px-2 py-1 rounded">{{ stat.label }}</div>
          </div>
          <div class="text-3xl font-bold mb-1">{{ stat.value }}</div>
          <div class="text-sm opacity-80">{{ stat.subtitle }}</div>
        </div>
      </div>

      <!-- Grid 2 Colunas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Atividade Recente -->
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="text-2xl font-bold text-primary-900 mb-4">📅 Atividade Recente</h2>
            
            <div v-if="recentActivity.length === 0" class="text-center py-8 text-gray-500">
              <div class="text-5xl mb-2">📭</div>
              <p>Nenhuma atividade recente</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="text-2xl">{{ activity.icon }}</div>
                <div class="flex-1">
                  <p class="font-medium text-primary-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(activity.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions + Quick Stats -->
        <div class="space-y-6">
          
          <!-- CTA Principal -->
          <div class="card bg-gradient-to-br from-accent-500 to-yellow-600 text-primary-900">
            <h3 class="text-xl font-bold mb-3">🚀 Ação Rápida</h3>
            <p class="text-sm mb-4 opacity-90">
              {{ isContractor ? 'Publique um novo projeto e receba propostas' : 'Encontre projetos e faça lances' }}
            </p>
            <router-link
              :to="isContractor ? '/create-project' : '/auctions'"
              class="block w-full bg-primary-900 text-white text-center py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors"
            >
              {{ isContractor ? '➕ Criar Projeto' : '🔍 Ver Leilões' }}
            </router-link>
          </div>

          <!-- Saldo (para provider) -->
          <div v-if="!isContractor" class="card bg-gradient-to-br from-green-600 to-green-700 text-white">
            <h3 class="font-bold mb-2">💰 Saldo Atual</h3>
            <div class="text-3xl font-bold mb-2">R$ {{ balance.toFixed(2) }}</div>
            <div class="text-sm opacity-80 mb-3">Disponível: R$ {{ availableBalance.toFixed(2) }}</div>
            <router-link
              to="/wallet"
              class="block w-full bg-white text-green-700 text-center py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
            >
              Ver Carteira →
            </router-link>
          </div>

          <!-- Links Rápidos -->
          <div class="card">
            <h3 class="font-bold text-primary-900 mb-3">⚡ Links Rápidos</h3>
            <div class="space-y-2">
              <router-link
                v-for="link in quickLinks"
                :key="link.to"
                :to="link.to"
                class="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span class="text-lg mr-2">{{ link.icon }}</span>
                <span class="text-sm font-medium text-gray-700">{{ link.label }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useWallet } from '@/composables/useWallet'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import axios from 'axios'

const router = useRouter()
const { user } = useAuth()
const { balance, availableBalance, fetchBalance } = useWallet()

const loading = ref(true)
const stats = ref([])
const recentActivity = ref([])

const isContractor = computed(() => {
  return user.value?.user_type === 'contractor' || user.value?.user_type === 'both'
})

const quickLinks = computed(() => {
  const baseLinks = [
    { to: '/auctions', icon: '🎯', label: 'Leilões Ativos' },
    { to: '/wallet', icon: '💰', label: 'Carteira' }
  ]

  if (isContractor.value) {
    baseLinks.unshift({ to: '/create-project', icon: '➕', label: 'Criar Projeto' })
  } else {
    baseLinks.push({ to: '/my-bids', icon: '📊', label: 'Meus Lances' })
  }

  return baseLinks
})

const getUserGreeting = () => {
  const hour = new Date().getHours()
  let greeting = 'Bom dia'
  if (hour >= 12 && hour < 18) greeting = 'Boa tarde'
  if (hour >= 18) greeting = 'Boa noite'
  
  if (isContractor.value) {
    return `${greeting}! Aqui está um resumo dos seus projetos.`
  }
  return `${greeting}! Veja suas estatísticas de lances.`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Agora mesmo'
  if (hours < 24) return `Há ${hours}h`
  
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Ontem'
  if (days < 7) return `Há ${days} dias`
  
  return date.toLocaleDateString('pt-BR')
}

const fetchDashboardData = async () => {
  loading.value = true
  
  try {
    // Fetch user stats
    const statsResponse = await axios.get('/api/user/stats', { withCredentials: true })
    
    if (isContractor.value) {
      stats.value = [
        {
          icon: '📁',
          label: 'Projetos',
          value: statsResponse.data.total_projects || 0,
          subtitle: `${statsResponse.data.active_projects || 0} ativos`
        },
        {
          icon: '💰',
          label: 'Lances Recebidos',
          value: statsResponse.data.total_bids_received || 0,
          subtitle: 'Total de propostas'
        },
        {
          icon: '✅',
          label: 'Concluídos',
          value: statsResponse.data.completed_projects || 0,
          subtitle: 'Projetos finalizados'
        },
        {
          icon: '⭐',
          label: 'Avaliação',
          value: (statsResponse.data.average_rating || 0).toFixed(1),
          subtitle: `${statsResponse.data.total_reviews || 0} reviews`
        }
      ]
    } else {
      stats.value = [
        {
          icon: '🎯',
          label: 'Lances Feitos',
          value: statsResponse.data.total_bids || 0,
          subtitle: `${statsResponse.data.active_bids || 0} ativos`
        },
        {
          icon: '🥇',
          label: 'Em 1º Lugar',
          value: statsResponse.data.first_place_bids || 0,
          subtitle: 'Liderando placar'
        },
        {
          icon: '✅',
          label: 'Vencidos',
          value: statsResponse.data.won_bids || 0,
          subtitle: 'Projetos conquistados'
        },
        {
          icon: '📈',
          label: 'Taxa de Vitória',
          value: `${statsResponse.data.win_rate || 0}%`,
          subtitle: 'Conversão de lances'
        }
      ]
      
      // Fetch balance for provider
      await fetchBalance()
    }

    // Fetch recent activity
    const activityResponse = await axios.get('/api/timeline/recent', { withCredentials: true })
    recentActivity.value = activityResponse.data.events || []
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    
    // Mock data for development
    if (isContractor.value) {
      stats.value = [
        { icon: '📁', label: 'Projetos', value: 5, subtitle: '2 ativos' },
        { icon: '💰', label: 'Lances Recebidos', value: 23, subtitle: 'Total de propostas' },
        { icon: '✅', label: 'Concluídos', value: 3, subtitle: 'Projetos finalizados' },
        { icon: '⭐', label: 'Avaliação', value: '4.8', subtitle: '12 reviews' }
      ]
    } else {
      stats.value = [
        { icon: '🎯', label: 'Lances Feitos', value: 15, subtitle: '8 ativos' },
        { icon: '🥇', label: 'Em 1º Lugar', value: 3, subtitle: 'Liderando placar' },
        { icon: '✅', label: 'Vencidos', value: 7, subtitle: 'Projetos conquistados' },
        { icon: '📈', label: 'Taxa de Vitória', value: '47%', subtitle: 'Conversão de lances' }
      ]
    }

    recentActivity.value = [
      {
        id: 1,
        icon: '🎯',
        title: 'Novo lance recebido',
        description: 'Projeto: Desenvolvimento de App Mobile',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        icon: '✅',
        title: 'Projeto aceito',
        description: 'Sua proposta foi aceita!',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
