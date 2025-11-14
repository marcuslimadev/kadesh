<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <LoadingScreen v-if="loading" />
    
    <div v-else-if="provider" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 bg-gradient-to-br from-primary-900 to-accent-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {{ provider.name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ provider.name }}</h1>
            
            <!-- Rating -->
            <div class="flex items-center gap-2 mb-3">
              <div class="flex">
                <span v-for="i in 5" :key="i" class="text-2xl">
                  {{ i <= Math.round(provider.rating || 0) ? '⭐' : '☆' }}
                </span>
              </div>
              <span class="text-gray-600 font-semibold">
                {{ (provider.rating || 0).toFixed(1) }}
              </span>
              <span class="text-gray-400">
                ({{ provider.total_reviews || 0 }} avaliações)
              </span>
            </div>

            <!-- Stats -->
            <div class="flex gap-6 text-sm">
              <div>
                <span class="text-gray-600">Projetos concluídos:</span>
                <span class="font-bold text-primary-900 ml-1">
                  {{ provider.completed_projects || 0 }}
                </span>
              </div>
              <div>
                <span class="text-gray-600">Taxa de sucesso:</span>
                <span class="font-bold text-green-600 ml-1">
                  {{ provider.success_rate || 0 }}%
                </span>
              </div>
              <div>
                <span class="text-gray-600">Membro desde:</span>
                <span class="font-bold text-gray-700 ml-1">
                  {{ formatDate(provider.created_at) }}
                </span>
              </div>
            </div>

            <!-- Bio -->
            <p v-if="provider.bio" class="text-gray-700 mt-4">
              {{ provider.bio }}
            </p>
          </div>
        </div>

        <!-- Skills -->
        <div v-if="provider.skills && provider.skills.length > 0" class="mt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">Habilidades</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in provider.skills"
              :key="skill"
              class="px-3 py-1 bg-primary-100 text-primary-900 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'border-accent-500 text-accent-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Portfolio -->
          <div v-if="activeTab === 'portfolio'">
            <div v-if="portfolio.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-4xl mb-2">📁</div>
              <p>Nenhum item no portfólio ainda</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="item in portfolio"
                :key="item.id"
                class="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-48 object-cover"
                />
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-gray-600">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews -->
          <div v-else-if="activeTab === 'reviews'">
            <div v-if="reviews.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-4xl mb-2">⭐</div>
              <p>Nenhuma avaliação ainda</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="review in reviews"
                :key="review.id"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900">{{ review.reviewer_name }}</span>
                      <div class="flex">
                        <span v-for="i in review.rating" :key="i" class="text-yellow-500">⭐</span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</p>
                  </div>
                </div>
                <p class="text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
          </div>

          <!-- Projects -->
          <div v-else-if="activeTab === 'projects'">
            <div v-if="completedProjects.length === 0" class="text-center py-12 text-gray-500">
              <div class="text-4xl mb-2">📋</div>
              <p>Nenhum projeto concluído ainda</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="project in completedProjects"
                :key="project.id"
                class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 class="font-semibold text-gray-900 mb-2">{{ project.title }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Concluído em {{ formatDate(project.completed_at) }}</span>
                  <span class="font-bold text-green-600">R$ {{ formatMoney(project.final_price) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
      <p class="text-gray-500">Provider não encontrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useReviews } from '@/composables/useReviews'

const route = useRoute()
const { reviews, fetchReviews } = useReviews()

const provider = ref(null)
const portfolio = ref([])
const completedProjects = ref([])
const loading = ref(true)
const activeTab = ref('portfolio')

const tabs = [
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'reviews', label: 'Avaliações' },
  { id: 'projects', label: 'Projetos Concluídos' }
]

const fetchProviderData = async () => {
  loading.value = true
  try {
    const providerId = route.params.id
    
    // Buscar dados do provider
    const providerRes = await axios.get(`/api/users/${providerId}`, {
      withCredentials: true
    })
    provider.value = providerRes.data.user || providerRes.data

    // Buscar portfolio
    try {
      const portfolioRes = await axios.get(`/api/users/${providerId}/portfolio`, {
        withCredentials: true
      })
      portfolio.value = portfolioRes.data.portfolio || portfolioRes.data || []
    } catch (err) {
      console.log('Portfolio não disponível')
    }

    // Buscar reviews
    await fetchReviews(providerId, 'provider')

    // Buscar projetos concluídos
    try {
      const projectsRes = await axios.get(`/api/users/${providerId}/projects?status=completed`, {
        withCredentials: true
      })
      completedProjects.value = projectsRes.data.projects || projectsRes.data || []
    } catch (err) {
      console.log('Projetos não disponíveis')
    }
  } catch (err) {
    console.error('Erro ao carregar provider:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long'
  })
}

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

onMounted(() => {
  fetchProviderData()
})
</script>
