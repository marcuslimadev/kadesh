<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="max-w-5xl mx-auto px-4 py-8">
      <div class="animate-pulse space-y-6">
        <div class="h-48 bg-gray-200 rounded-lg"></div>
        <div class="h-32 bg-gray-200 rounded-lg"></div>
        <div class="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="provider" class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-primary-500 to-accent-500"></div>
        <div class="px-8 pb-8">
          <div class="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                v-if="provider.avatar"
                class="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-cover bg-center"
                :style="{ backgroundImage: `url(${provider.avatar})` }"
              ></div>
              <div
                v-else
                class="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-4xl font-bold"
              >
                {{ provider.name?.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 mt-4">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ provider.name }}</h1>
              <p v-if="profile?.title" class="text-lg text-gray-600 mb-3">{{ profile.title }}</p>
              
              <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                <div v-if="stats.rating > 0" class="flex items-center gap-1">
                  <StarIcon class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span class="font-semibold">{{ stats.rating.toFixed(1) }}</span>
                  <span>({{ stats.reviews_count }} avaliações)</span>
                </div>
                <div v-if="stats.completed_contracts" class="flex items-center gap-1">
                  <CheckCircleIcon class="w-5 h-5 text-green-500" />
                  <span>{{ stats.completed_contracts }} projetos concluídos</span>
                </div>
                <div v-if="profile?.hourly_rate" class="flex items-center gap-1">
                  <CurrencyDollarIcon class="w-5 h-5 text-primary-500" />
                  <span>R$ {{ profile.hourly_rate }}/hora</span>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div class="flex-shrink-0">
              <button
                @click="contactProvider"
                class="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
              >
                Contratar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div v-if="profile?.bio" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Sobre</h2>
        <p class="text-gray-700 whitespace-pre-wrap">{{ profile.bio }}</p>
      </div>

      <!-- Skills -->
      <div v-if="profile?.skills?.length" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Habilidades</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in profile.skills"
            :key="skill"
            class="px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Portfolio (se houver) -->
      <div v-if="profile?.portfolio_url" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Portfólio</h2>
        <a
          :href="profile.portfolio_url"
          target="_blank"
          class="text-primary-600 hover:text-primary-700 font-medium"
        >
          {{ profile.portfolio_url }}
        </a>
      </div>

      <!-- Reviews -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Avaliações</h2>
        <ReviewList :userId="providerId" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-5xl mx-auto px-4 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Perfil não encontrado</h2>
      <p class="text-gray-600 mb-6">Este prestador não existe ou foi removido.</p>
      <router-link to="/projects" class="text-primary-600 hover:text-primary-700 font-medium">
        Ver projetos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { useToast } from 'vue-toastification'
import { StarIcon, CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/vue/24/solid'
import ReviewList from '@/components/review/ReviewList.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
// const toast = useToast()

const providerId = ref(route.params.id)
const provider = ref(null)
const profile = ref(null)
const stats = ref({
  rating: 0,
  reviews_count: 0,
  completed_contracts: 0
})
const loading = ref(true)

const loadProvider = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/users/${providerId.value}`)
    provider.value = data.user
    
    if (data.user.user_type !== 'provider') {
      throw new Error('Não é um prestador')
    }

    // Load provider profile
    try {
      const profileRes = await api.get(`/users/${providerId.value}/profile`)
      profile.value = profileRes.data.profile
    } catch (err) {
      console.log('Profile not found, using basic info')
    }

    // Load stats (simplified - usa reviews direto)
    try {
      const reviewsRes = await api.get('/reviews', {
        params: { user_id: providerId.value, limit: 1 }
      })
      stats.value.reviews_count = reviewsRes.data.pagination.total
      stats.value.rating = reviewsRes.data.pagination.avg_rating || 0
    } catch (err) {
      console.log('Stats not available')
    }
  } catch (error) {
    console.error('Error loading provider:', error)
    // toast.error('Erro ao carregar perfil do prestador')
    provider.value = null
  } finally {
    loading.value = false
  }
}

const contactProvider = () => {
  router.push(`/projects/new?provider=${providerId.value}`)
}

onMounted(() => {
  loadProvider()
})
</script>
