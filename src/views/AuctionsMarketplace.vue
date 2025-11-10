<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    
    <LoadingScreen :show="loading" message="Carregando leilões..." icon="🎯" />

    <main class="flex-1 bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">🎯 Leilões Ativos</h1>
            <p class="text-gray-600 mt-1">
              {{ auctions.length }} leilões abertos
            </p>
          </div>
          
          <!-- Create Project Button (Contractor only) -->
          <router-link
            v-if="user && user.user_type === 'contractor'"
            to="/create-project"
            class="btn bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold"
          >
            ➕ Criar Novo Projeto
          </router-link>
        </div>

        <!-- Lista de Leilões -->
        <div v-if="auctions.length > 0" class="grid gap-6">
          <div
            v-for="auction in auctions"
            :key="auction.id"
            class="card hover:shadow-xl transition-shadow cursor-pointer"
            @click="router.push(`/auction/${auction.id}`)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ auction.title }}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">{{ auction.description }}</p>
                
                <div class="flex gap-3 flex-wrap">
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    📁 {{ auction.category || 'Geral' }}
                  </span>
                  <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    💰 R$ {{ parseFloat(auction.min_budget).toFixed(2) }} - R$ {{ parseFloat(auction.max_budget).toFixed(2) }}
                  </span>
                  <span class="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                    🎯 {{ auction.bid_count || 0 }} lances
                  </span>
                </div>
              </div>

              <div class="ml-6 text-right min-w-[140px]">
                <div :class="['px-3 py-2 rounded-lg mb-3', timeLeftClass(auction.ends_at)]">
                  <div class="text-xs text-gray-600 mb-1">ENCERRA EM</div>
                  <div class="text-lg font-bold">
                    {{ formatTimeLeft(auction.ends_at) }}
                  </div>
                </div>
                
                <div v-if="auction.current_lowest_bid">
                  <div class="text-xs text-gray-500">Lance atual</div>
                  <div class="text-xl font-bold text-green-600">
                    R$ {{ parseFloat(auction.current_lowest_bid).toFixed(2) }}
                  </div>
                </div>
                <div v-else class="text-sm text-gray-400">Sem lances</div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Publicado por <strong>{{ auction.contractor_name }}</strong>
              </div>
              <button class="btn btn-primary">
                Ver Detalhes →
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="!loading" class="text-center py-16">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum leilão ativo no momento</h3>
          <p class="text-gray-500 mb-6">
            <span v-if="user && user.user_type === 'contractor'">
              Seja o primeiro a criar um projeto!
            </span>
            <span v-else>
              Novos projetos aparecerão aqui em breve. Fique atento!
            </span>
          </p>
          
          <router-link
            v-if="user && user.user_type === 'contractor'"
            to="/create-project"
            class="btn btn-primary inline-block"
          >
            ➕ Criar Meu Primeiro Projeto
          </router-link>
          
          <div v-else class="space-y-3">
            <p class="text-sm text-gray-600">Enquanto isso, você pode:</p>
            <div class="flex gap-3 justify-center">
              <router-link to="/dashboard" class="btn btn-secondary">
                📊 Ver Dashboard
              </router-link>
              <router-link to="/my-bids" class="btn btn-secondary">
                💰 Meus Lances
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-primary-900 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="text-2xl font-bold text-accent-500 mb-2">⚡ KADESH</div>
        <p class="text-gray-400">&copy; 2025 Kadesh. Todos os direitos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuctions } from '@/composables/useAuctions'
import { useAuth } from '@/composables/useAuth'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const { user } = useAuth()
const { auctions, loading, fetchActiveAuctions } = useAuctions()

onMounted(async () => {
  await fetchActiveAuctions()
})

const formatTimeLeft = (endsAt) => {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end - now

  if (diff <= 0) return 'Encerrado'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }

  return `${hours}h ${minutes}m`
}

const timeLeftClass = (endsAt) => {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end - now
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 2) return 'bg-red-50 text-red-700'
  if (hours < 24) return 'bg-yellow-50 text-yellow-700'
  return 'bg-blue-50 text-blue-700'
}
</script>
