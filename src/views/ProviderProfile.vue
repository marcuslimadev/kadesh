<template>
  <div class="container mx-auto p-4">
    <div v-if="loading">Carregando...</div>
    <div v-else-if="user">
      <div class="p-8 bg-white rounded-lg shadow-md mb-8">
        <h1 class="text-3xl font-bold">{{ user.name }}</h1>
        <div class="flex items-center mt-2">
          <div class="text-yellow-400 text-xl">★ {{ parseFloat(user.rating).toFixed(1) }}</div>
          <div class="ml-2 text-gray-600">({{ user.total_ratings }} avaliações)</div>
        </div>
        <p class="mt-4 text-gray-700">{{ user.bio }}</p>
      </div>

      <h2 class="text-2xl font-bold mb-4">Avaliações Recebidas</h2>
      <div class="space-y-4">
        <div v-for="review in reviews" :key="review.id" class="p-4 bg-white rounded-lg shadow-md">
          <div class="flex justify-between">
            <div class="font-bold">{{ review.reviewer_name }}</div>
            <div class="text-yellow-400">★ {{ review.rating }}</div>
          </div>
          <p class="mt-2 text-gray-700">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const user = ref(null)
const reviews = ref([])
const loading = ref(true)

async function fetchData() {
  try {
    const userId = route.params.id
    const [userRes, reviewsRes] = await Promise.all([
      api.get(`/api/users/${userId}`),
      api.get(`/api/users/${userId}/reviews`)
    ])

    user.value = userRes.data
    reviews.value = reviewsRes.data
  } catch (error) {
    console.error('Failed to fetch profile data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
