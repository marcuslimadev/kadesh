<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6">
    <div class="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white shadow-xl mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">⭐ Avaliar Fornecedor</h1>
      <p class="opacity-90">Compartilhe sua experiência com {{ providerName }}</p>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <!-- Avaliação Geral -->
      <div>
        <label class="block text-lg font-bold text-gray-900 mb-3">Avaliação Geral *</label>
        <div class="flex gap-2">
          <button
            v-for="star in 5"
            :key="star"
            @click="form.rating = star"
            class="text-5xl transition-all hover:scale-110"
            :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
          >
            ⭐
          </button>
        </div>
      </div>

      <!-- Avaliações Detalhadas -->
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">✨ Qualidade do Trabalho</label>
          <select
            v-model.number="form.quality_rating"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          >
            <option value="">Selecione...</option>
            <option value="1">1 - Muito Ruim</option>
            <option value="2">2 - Ruim</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bom</option>
            <option value="5">5 - Excelente</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">💬 Comunicação</label>
          <select
            v-model.number="form.communication_rating"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          >
            <option value="">Selecione...</option>
            <option value="1">1 - Muito Ruim</option>
            <option value="2">2 - Ruim</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bom</option>
            <option value="5">5 - Excelente</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">⏰ Cumprimento de Prazo</label>
          <select
            v-model.number="form.deadline_rating"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
          >
            <option value="">Selecione...</option>
            <option value="1">1 - Muito Atrasado</option>
            <option value="2">2 - Atrasado</option>
            <option value="3">3 - No Prazo</option>
            <option value="4">4 - Antes do Prazo</option>
            <option value="5">5 - Muito Antes</option>
          </select>
        </div>
      </div>

      <!-- Comentário -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Seu Comentário</label>
        <textarea
          v-model="form.comment"
          rows="5"
          placeholder="Conte sobre sua experiência, o que foi bom, o que poderia melhorar..."
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500"
        ></textarea>
      </div>

      <!-- Contratar novamente -->
      <div class="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
        <input
          v-model="form.would_hire_again"
          type="checkbox"
          id="hire-again"
          class="w-6 h-6 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label for="hire-again" class="text-sm font-medium text-gray-900 cursor-pointer">
          👍 Sim, eu contrataria este fornecedor novamente
        </label>
      </div>

      <!-- Botões -->
      <div class="flex gap-4">
        <button
          @click="$router.go(-1)"
          class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          @click="submitReview"
          :disabled="!form.rating || loading"
          class="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {{ loading ? '⏳ Enviando...' : '⭐ Enviar Avaliação' }}
        </button>
      </div>

      <div v-if="message" class="p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id
const providerName = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const form = ref({
  project_id: projectId,
  rating: 0,
  quality_rating: null,
  communication_rating: null,
  deadline_rating: null,
  comment: '',
  would_hire_again: false
})

const submitReview = async () => {
  if (!form.value.rating) {
    message.value = '❌ Por favor, selecione uma avaliação geral'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    await axios.post('/kadesh/api/reviews', form.value)
    message.value = '✅ Avaliação enviada com sucesso!'
    messageType.value = 'success'
    
    setTimeout(() => {
      router.push('/projects')
    }, 2000)
  } catch (error) {
    message.value = '❌ Erro: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Carregar info do projeto
  try {
    const response = await axios.get(`/kadesh/api/projects/${projectId}`)
    providerName.value = response.data.provider_name || 'o fornecedor'
  } catch (error) {
    console.error('Erro ao carregar projeto:', error)
  }
})
</script>
