<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Avaliar Fornecedor</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <form @submit.prevent="submitReview" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nota (1 a 5)</label>
          <div class="flex mt-1">
            <button type="button" v-for="star in 5" :key="star" @click="form.rating = star" class="text-2xl" :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'">★</button>
          </div>
        </div>
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700">Comentário</label>
          <textarea id="comment" v-model="form.comment" rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"></textarea>
        </div>
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Enviar Avaliação
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const form = reactive({
  project_id: parseInt(route.params.id),
  reviewed_user_id: 0, // This needs to be fetched
  rating: 0,
  comment: '',
})

// TODO: Fetch the project to get the reviewed_user_id

async function submitReview() {
  try {
    // Need to get the provider's ID first
    // For now, let's assume we have it.
    // const projectRes = await api.get(`/api/projects/${route.params.id}`);
    // form.reviewed_user_id = projectRes.data.provider_id;

    await api.post('/api/reviews', form)
    router.push(`/projects/${route.params.id}/tracking`)
  } catch (error) {
    alert('Falha ao enviar avaliação.')
  }
}
</script>
