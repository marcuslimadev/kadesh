<template>
  <div class="min-h-screen bg-neutral-50 py-6">
    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-neutral-600">Carregando perfil...</p>
      </div>

      <!-- Não encontrado -->
      <div v-else-if="!profile" class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Fornecedor não encontrado</h2>
        <router-link to="/projects" class="btn btn-outline-primary">
          ← Voltar para projetos
        </router-link>
      </div>

      <template v-else>
        <!-- Header do Perfil -->
        <div class="card card-elevated p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl flex-shrink-0">
              🔨
            </div>

            <div class="flex-1">
              <h1 class="text-3xl md:text-4xl font-bold mb-2">
                {{ profile.business_name || profile.name }}
              </h1>
              <p v-if="profile.tagline" class="text-xl text-white mb-4">{{ profile.tagline }}</p>

              <div class="flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <span></span>
                  <span class="font-bold">{{ profile.average_rating || 0 }}</span>
                  <span class="text-white">({{ profile.total_reviews || 0 }} avaliações)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span></span>
                  <span class="font-bold">{{ profile.completed_projects || 0 }}</span>
                  <span class="text-white">projetos concluídos</span>
                </div>
                <div v-if="profile.years_experience" class="flex items-center gap-2">
                  <span>📅</span>
                  <span class="font-bold">{{ profile.years_experience }}</span>
                  <span class="text-white">anos de experiência</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <div v-if="profile.availability_status === 'available'" class="badge badge-success text-center">
                 Disponível
              </div>
              <div v-else-if="profile.availability_status === 'busy'" class="badge badge-warning text-center">
                ⚠️ Ocupado
              </div>
              <div v-else class="badge badge-error text-center">
                 Indisponível
              </div>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Coluna Principal -->
          <div class="md:col-span-2 space-y-6">
            <!-- Sobre -->
            <div v-if="profile.about" class="card card-elevated p-6">
              <h2 class="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                 Sobre
              </h2>
              <p class="text-neutral-700 whitespace-pre-line">{{ profile.about }}</p>
            </div>

            <!-- Portfólio -->
            <div v-if="portfolio && portfolio.length > 0" class="card card-elevated p-6">
              <h2 class="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                 Portfólio ({{ portfolio.length }})
              </h2>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="item in portfolio"
                  :key="item.id"
                  class="relative group cursor-pointer"
                  @click="openImage(item)"
                >
                  <div v-if="item.is_featured" class="absolute top-2 left-2 z-10 badge badge-secondary">
                    
                  </div>
                  <img
                    :src="getImageUrl(item.file_path)"
                    :alt="item.title"
                    class="w-full h-48 object-cover rounded group-hover:opacity-90 transition-transform"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded transition-all flex items-end p-3">
                    <p class="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      {{ item.title || 'Sem título' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Avaliações -->
            <div v-if="reviews && reviews.length > 0" class="card card-elevated p-6">
              <h2 class="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                 Avaliações ({{ reviews.length }})
              </h2>

              <div class="space-y-4">
                <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border-2 border-neutral-100 rounded p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <p class="font-bold text-neutral-900">{{ review.reviewer_name }}</p>
                      <p class="text-sm text-neutral-600">{{ review.project_title }}</p>
                    </div>
                    <div class="text-yellow-500 text-xl">
                      {{ ''.repeat(review.rating) }}
                    </div>
                  </div>

                  <p class="text-neutral-700 mb-2">{{ review.comment }}</p>

                  <div v-if="review.quality_rating || review.communication_rating || review.deadline_rating" class="flex flex-wrap gap-3 text-sm text-neutral-600 mb-2">
                    <div v-if="review.quality_rating">
                       Qualidade: {{ review.quality_rating }}/5
                    </div>
                    <div v-if="review.communication_rating">
                      💬 Comunicação: {{ review.communication_rating }}/5
                    </div>
                    <div v-if="review.deadline_rating">
                       Prazo: {{ review.deadline_rating }}/5
                    </div>
                  </div>

                  <!-- Resposta do fornecedor -->
                  <div v-if="review.provider_response" class="bg-primary-50 border-l-4 border-primary-300 p-3 mt-3">
                    <p class="font-medium text-primary-900 text-sm mb-1">Resposta do fornecedor:</p>
                    <p class="text-primary-900 text-sm">{{ review.provider_response }}</p>
                  </div>

                  <p class="text-xs text-neutral-500 mt-2">{{ formatDate(review.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Especialidades -->
            <div v-if="profile.specialties && profile.specialties.length > 0" class="card card-elevated p-6">
              <h3 class="font-bold text-neutral-900 mb-3"> Especialidades</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(spec, index) in profile.specialties"
                  :key="index"
                  class="badge badge-primary"
                >
                  {{ spec }}
                </span>
              </div>
            </div>

            <!-- Serviços -->
            <div v-if="profile.services_offered && profile.services_offered.length > 0" class="card card-elevated p-6">
              <h3 class="font-bold text-neutral-900 mb-3"> Serviços Oferecidos</h3>
              <div class="space-y-2">
                <div
                  v-for="(service, index) in profile.services_offered"
                  :key="index"
                  class="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span class="text-primary-500">✓</span>
                  <span>{{ service }}</span>
                </div>
              </div>
            </div>

            <!-- Contato -->
            <div class="card card-elevated p-6">
              <h3 class="font-bold text-neutral-900 mb-3">📍 Contato & Localização</h3>
              <div class="space-y-3 text-sm">
                <div v-if="profile.city || profile.state" class="flex items-center gap-2">
                  <span>📌</span>
                  <span class="text-neutral-700">{{ profile.city }}, {{ profile.state }}</span>
                </div>
                <div v-if="profile.phone" class="flex items-center gap-2">
                  <span>📞</span>
                  <a :href="'tel:' + profile.phone" class="text-primary-600 hover:text-primary-700">{{ profile.phone }}</a>
                </div>
                <div v-if="profile.whatsapp" class="flex items-center gap-2">
                  <span>💬</span>
                  <a :href="'https://wa.me/' + profile.whatsapp.replace(/\D/g, '')" target="_blank" class="text-primary-600 hover:text-primary-700">
                    WhatsApp
                  </a>
                </div>
                <div v-if="profile.website" class="flex items-center gap-2">
                  <span>🌐</span>
                  <a :href="profile.website" target="_blank" class="text-primary-600 hover:text-primary-700 truncate">
                    {{ profile.website }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const loading = ref(true)
const profile = ref(null)
const portfolio = ref([])
const reviews = ref([])

const loadProviderProfile = async () => {
  loading.value = true
  try {
    const providerId = route.params.id
    const response = await axios.get(`/kadesh/api/providers/${providerId}/profile`)
    
    profile.value = response.data.profile
    portfolio.value = response.data.portfolio || []
    reviews.value = response.data.reviews || []
    
    // Processar JSON fields
    if (typeof profile.value.specialties === 'string') {
      profile.value.specialties = JSON.parse(profile.value.specialties)
    }
    if (typeof profile.value.services_offered === 'string') {
      profile.value.services_offered = JSON.parse(profile.value.services_offered)
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  } finally {
    loading.value = false
  }
}

const getImageUrl = (path) => {
  return path.startsWith('http') ? path : `/kadesh${path}`
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const openImage = (item) => {
  // Abrir imagem em nova aba ou modal
  window.open(getImageUrl(item.file_path), '_blank')
}

onMounted(() => {
  loadProviderProfile()
})
</script>




