<template>
  <div class="space-y-4">
    <!-- Header com Stats -->
    <div v-if="stats" class="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6 border border-primary-200">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <StarIcon class="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <span class="text-3xl font-bold text-gray-900">{{ stats.average.toFixed(1) }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ stats.total }} avaliações</p>
        </div>
        <div class="text-right">
          <div class="flex gap-1 mb-1">
            <StarIcon
              v-for="star in 5"
              :key="star"
              :class="[
                'w-5 h-5',
                star <= Math.round(stats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              ]"
            />
          </div>
          <p class="text-xs text-gray-500">Média geral</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div v-else-if="reviews.length > 0" class="space-y-4">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div
              v-if="review.reviewer_avatar"
              class="w-12 h-12 rounded-full bg-cover bg-center"
              :style="{ backgroundImage: `url(${review.reviewer_avatar})` }"
            ></div>
            <div
              v-else
              class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold"
            >
              {{ review.reviewer_name?.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h4 class="font-semibold text-gray-900">{{ review.reviewer_name }}</h4>
                <p class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</p>
              </div>
              <div class="flex gap-0.5">
                <StarIcon
                  v-for="star in 5"
                  :key="star"
                  :class="[
                    'w-5 h-5',
                    star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  ]"
                />
              </div>
            </div>

            <p v-if="review.comment" class="text-gray-700 whitespace-pre-wrap">
              {{ review.comment }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <StarIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
      <p class="text-gray-600">Seja o primeiro a avaliar!</p>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && !loading" class="text-center pt-4">
      <button
        @click="loadMore"
        class="px-6 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition"
      >
        Carregar mais
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import api from '@/services/api'
// import { useToast } from 'vue-toastification'

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})

// const toast = useToast()
const reviews = ref([])
const loading = ref(false)
const stats = ref(null)
const pagination = ref({
  total: 0,
  limit: 10,
  offset: 0
})

const hasMore = computed(() => {
  return pagination.value.offset + reviews.value.length < pagination.value.total
})

const loadReviews = async (append = false) => {
  loading.value = true
  try {
    const { data } = await api.get('/reviews', {
      params: {
        user_id: props.userId,
        limit: pagination.value.limit,
        offset: append ? pagination.value.offset : 0
      }
    })

    if (append) {
      reviews.value = [...reviews.value, ...data.data]
    } else {
      reviews.value = data.data
    }

    pagination.value = {
      total: data.pagination.total,
      limit: data.pagination.limit,
      offset: data.pagination.offset
    }

    stats.value = {
      total: data.pagination.total,
      average: data.pagination.avg_rating || 0
    }
  } catch (error) {
    console.error('Error loading reviews:', error)
    // toast.error('Erro ao carregar avaliações')
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  pagination.value.offset += pagination.value.limit
  loadReviews(true)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  loadReviews()
})

defineExpose({
  loadReviews
})
</script>
