<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <LoadingScreen v-if="loading" message="Carregando leilão..." icon="⚡" />
    
    <main v-else-if="currentAuction" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <router-link to="/auctions" class="text-primary-900 hover:text-accent-500">← Voltar para Leilões</router-link>
      </nav>

      <!-- Layout 2 Colunas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- COLUNA ESQUERDA: Info + Placar (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Info do Projeto -->
          <div class="card">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-primary-900 mb-2">{{ currentAuction.title }}</h1>
                <div class="flex gap-3 text-sm">
                  <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {{ currentAuction.category }}
                  </span>
                  <span class="text-gray-600">
                    Por: <span class="font-semibold">{{ currentAuction.contractor_name }}</span>
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-600">Orçamento</div>
                <div class="text-xl font-bold text-primary-900">
                  R$ {{ currentAuction.min_budget }} - {{ currentAuction.max_budget }}
                </div>
              </div>
            </div>
            
            <p class="text-gray-700 leading-relaxed mb-4">{{ currentAuction.description }}</p>
            
            <div class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div class="text-sm text-gray-600">Total de Lances</div>
                <div class="text-2xl font-bold text-primary-900">{{ bids.length }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Menor Lance</div>
                <div class="text-2xl font-bold text-green-600">
                  {{ lowestBid ? `R$ ${lowestBid.toFixed(2)}` : '-' }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Média dos Lances</div>
                <div class="text-2xl font-bold text-gray-600">
                  {{ averageBid ? `R$ ${averageBid.toFixed(2)}` : '-' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Placar de Lances -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-primary-900">🏆 Placar de Lances</h2>
              <button @click="refreshBids" class="text-sm text-primary-900 hover:text-accent-500">
                🔄 Atualizar
              </button>
            </div>

            <div v-if="bids.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-5xl mb-3">📭</div>
              <p>Nenhum lance ainda. Seja o primeiro!</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(bid, index) in bids"
                :key="bid.id"
                class="p-4 rounded-lg border-l-4 transition-all hover:shadow-md"
                :class="getBidCardClass(index)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-2xl">{{ getMedalIcon(index) }}</span>
                      <span class="font-bold text-lg">{{ bid.provider_name }}</span>
                      <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        #{{ index + 1 }}
                      </span>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <div class="text-xs text-gray-600">Valor do Lance</div>
                        <div class="text-xl font-bold text-green-600">R$ {{ bid.amount.toFixed(2) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-600">Score Total</div>
                        <div class="text-xl font-bold text-primary-900">{{ bid.calculated_score.toFixed(1) }}</div>
                      </div>
                      <div>
                        <div class="text-xs text-gray-600">Reputação</div>
                        <div class="text-xl font-bold text-blue-600">
                          {{ bid.provider_rating ? bid.provider_rating.toFixed(1) : '0.0' }} ⭐
                        </div>
                      </div>
                    </div>

                    <div v-if="bid.proposal_text" class="mt-3 pt-3 border-t border-gray-200">
                      <div class="text-xs text-gray-600 mb-1">Proposta:</div>
                      <p class="text-sm text-gray-700 line-clamp-2">{{ bid.proposal_text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUNA DIREITA: Timer + Form (1/3) -->
        <div class="space-y-6">
          
          <!-- Timer Countdown -->
          <div class="card" :class="getTimerClass()">
            <div class="text-center">
              <div class="text-sm font-semibold mb-2 opacity-80">⏱️ Tempo Restante</div>
              <div class="text-4xl font-bold mb-2">{{ timeLeft }}</div>
              <div class="text-xs opacity-70">
                Encerra em: {{ formatDate(currentAuction.ends_at) }}
              </div>
              <div v-if="isUrgent" class="mt-3 text-sm bg-white/20 backdrop-blur-sm rounded px-3 py-2">
                ⚡ Urgente! Menos de 2 horas
              </div>
            </div>
          </div>

          <!-- Formulário de Lance (APENAS PARA FORNECEDORES) -->
          <div class="card">
            <h3 class="text-xl font-bold text-primary-900 mb-4">💰 Fazer Lance</h3>
            
            <!-- Se é o DONO do projeto -->
            <div v-if="isProjectOwner" class="text-center py-8">
              <div class="text-5xl mb-3">👀</div>
              <h4 class="font-semibold text-primary-900 mb-2">Este é o seu projeto!</h4>
              <p class="text-gray-600 text-sm">
                Aguarde os fornecedores enviarem lances. Você receberá notificações de cada nova proposta.
              </p>
              <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                ℹ️ Você poderá aceitar o melhor lance quando o leilão encerrar
              </div>
            </div>

            <!-- Se é CONTRATANTE mas não é o dono -->
            <div v-else-if="user && user.user_type === 'contractor'" class="text-center py-8">
              <div class="text-5xl mb-3">🔒</div>
              <h4 class="font-semibold text-primary-900 mb-2">Apenas fornecedores podem dar lances</h4>
              <p class="text-gray-600 text-sm">
                Este projeto foi criado por outro contratante.
              </p>
            </div>

            <!-- Se é FORNECEDOR - MOSTRAR FORMULÁRIO -->
            <div v-else-if="isProvider">
              <div v-if="error" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {{ error }}
              </div>

              <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                {{ successMessage }}
              </div>

              <form @submit.prevent="handlePlaceBid" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-primary-900 mb-2">
                    Valor do Lance (R$) *
                  </label>
                  <input
                    v-model="bidForm.amount"
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    class="input w-full"
                    placeholder="Ex: 450.00"
                  />
                  <p class="text-xs text-gray-600 mt-1">
                    {{ lowestBid ? `Deve ser menor que R$ ${lowestBid.toFixed(2)}` : 'Seja o primeiro a dar um lance!' }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-primary-900 mb-2">
                    Proposta (opcional)
                  </label>
                  <textarea
                    v-model="bidForm.proposal_text"
                    rows="4"
                    class="input w-full"
                    placeholder="Descreva como você vai executar o projeto..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary w-full"
                >
                  {{ loading ? 'Enviando...' : '🚀 Enviar Lance' }}
                </button>
              </form>
            </div>

            <!-- Se NÃO ESTÁ LOGADO -->
            <div v-else class="text-center py-8">
              <div class="text-5xl mb-3">🔐</div>
              <h4 class="font-semibold text-primary-900 mb-2">Faça login como fornecedor</h4>
              <p class="text-gray-600 text-sm mb-4">
                Para dar lances, você precisa estar logado como fornecedor.
              </p>
              <router-link to="/login" class="btn btn-primary inline-block">
                Fazer Login
              </router-link>
            </div>
          </div>

          <!-- Info Adicional -->
          <div class="card bg-gradient-to-br from-primary-900 to-primary-700 text-white">
            <h4 class="font-bold mb-3">ℹ️ Como Funciona</h4>
            <ul class="text-sm space-y-2 opacity-90">
              <li>✅ Score = 70% preço + 30% reputação</li>
              <li>⏱️ Lances nos últimos 2min estendem prazo</li>
              <li>🥇 Melhor score vence ao encerrar</li>
              <li>💰 Menor valor nem sempre ganha!</li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="text-6xl mb-4">❌</div>
        <h2 class="text-2xl font-bold text-primary-900 mb-2">Leilão não encontrado</h2>
        <router-link to="/auctions" class="text-accent-500 hover:underline">
          Voltar para leilões
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuctions } from '@/composables/useAuctions'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { currentAuction, fetchAuctionDetail, placeBid, loading } = useAuctions()

const bidForm = ref({ amount: '', proposal_text: '' })
const bids = ref([])
const timeLeft = ref('')
const error = ref(null)
const successMessage = ref(null)

let timerId = null
let refreshId = null

// Verificar se usuário é o dono do projeto
const isProjectOwner = computed(() => {
  if (!user.value || !currentAuction.value) return false
  return user.value.user_id === currentAuction.value.contractor_id
})

// Verificar se é fornecedor
const isProvider = computed(() => {
  return user.value?.user_type === 'provider'
})

// Computed
const lowestBid = computed(() => {
  if (bids.value.length === 0) return null
  return Math.min(...bids.value.map(b => parseFloat(b.amount)))
})

const averageBid = computed(() => {
  if (bids.value.length === 0) return null
  const sum = bids.value.reduce((acc, b) => acc + parseFloat(b.amount), 0)
  return sum / bids.value.length
})

const isUrgent = computed(() => {
  if (!currentAuction.value?.ends_at) return false
  const now = new Date()
  const end = new Date(currentAuction.value.ends_at)
  const diff = end - now
  const hours = diff / (1000 * 60 * 60)
  return hours < 2 && hours > 0
})

// Methods
const calculateTimeLeft = () => {
  if (!currentAuction.value?.ends_at) return 'Encerrado'
  const now = new Date()
  const end = new Date(currentAuction.value.ends_at)
  const diff = end - now
  
  if (diff <= 0) return 'Encerrado'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR')
}

const getMedalIcon = (index) => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return '🏅'
}

const getBidCardClass = (index) => {
  if (index === 0) return 'bg-yellow-50 border-yellow-500'
  if (index === 1) return 'bg-gray-50 border-gray-400'
  if (index === 2) return 'bg-orange-50 border-orange-400'
  return 'bg-white border-gray-200'
}

const getTimerClass = () => {
  if (!currentAuction.value?.ends_at) return 'bg-gray-500 text-white'
  const now = new Date()
  const end = new Date(currentAuction.value.ends_at)
  const diff = end - now
  const hours = diff / (1000 * 60 * 60)
  
  if (hours < 2) return 'bg-gradient-to-br from-red-600 to-red-700 text-white'
  if (hours < 24) return 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
  return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
}

const refreshBids = async () => {
  const auction = await fetchAuctionDetail(route.params.id)
  if (auction?.bids) {
    bids.value = auction.bids.sort((a, b) => b.calculated_score - a.calculated_score)
  }
}

const handlePlaceBid = async () => {
  error.value = null
  successMessage.value = null

  // Validação
  const amount = parseFloat(bidForm.value.amount)
  if (lowestBid.value && amount >= lowestBid.value) {
    error.value = `Seu lance deve ser menor que R$ ${lowestBid.value.toFixed(2)}`
    return
  }

  const success = await placeBid(
    route.params.id,
    amount,
    bidForm.value.proposal_text
  )

  if (success) {
    bidForm.value = { amount: '', proposal_text: '' }
    await refreshBids()
    
    // Encontrar posição do novo lance
    const userBid = bids.value.findIndex(b => b.amount === amount)
    const position = userBid + 1
    
    successMessage.value = `✅ Lance enviado com sucesso! Você está em ${position}º lugar no placar.`
    
    setTimeout(() => {
      successMessage.value = null
    }, 5000)
  } else {
    error.value = 'Erro ao enviar lance. Tente novamente.'
  }
}

onMounted(async () => {
  await refreshBids()
  
  // Timer atualiza a cada 1s
  timerId = setInterval(() => {
    timeLeft.value = calculateTimeLeft()
  }, 1000)
  
  // Placar atualiza a cada 15s
  refreshId = setInterval(refreshBids, 15000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  if (refreshId) clearInterval(refreshId)
})
</script>
