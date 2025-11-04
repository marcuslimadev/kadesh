<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6">
    <div class="card card-elevated p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-2"> Avaliar Fornecedor</h1>
      <p class="opacity-90">Compartilhe sua experiência com {{ providerName }}</p>
    </div>

    <div class="card card-elevated p-6 space-y-6">
      <!-- Avaliação Geral -->
      <div>
        <label class="block text-lg font-bold text-neutral-900 mb-3">Avaliação Geral *</label>
        <div class="flex gap-2">
          <button
            v-for="star in 5"
            :key="star"
            @click="form.rating = star"
            class="text-5xl transition-all hover:opacity-90"
            :class="star <= form.rating ? 'text-yellow-400' : 'text-neutral-300'"
          >
            
          </button>
        </div>
      </div>

      <!-- Avaliações Detalhadas -->
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="label"> Qualidade do Trabalho</label>
          <select
            v-model.number="form.quality_rating"
            class="select select-lg"
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
          <label class="label">💬 Comunicação</label>
          <select
            v-model.number="form.communication_rating"
            class="select select-lg"
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
          <label class="label"> Cumprimento de Prazo</label>
          <select
            v-model.number="form.deadline_rating"
            class="select select-lg"
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
        <label class="label">Seu Comentário</label>
        <textarea
          v-model="form.comment"
          rows="5"
          placeholder="Conte sobre sua experiência, o que foi bom, o que poderia melhorar..."
          class="textarea"
        ></textarea>
      </div>

      <!-- Contratar novamente -->
      <div class="flex items-center gap-3 bg-primary-50 p-4 rounded">
        <input
          v-model="form.would_hire_again"
          type="checkbox"
          id="hire-again"
          class="checkbox"
        />
        <label for="hire-again" class="text-sm font-medium text-neutral-900 cursor-pointer">
           Sim, eu contrataria este fornecedor novamente
        </label>
      </div>

      <!-- Botões -->
      <div class="flex gap-4">
        <button
          @click="$router.go(-1)"
          class="btn btn-outline-primary px-6"
        >
          Cancelar
        </button>
        <button
          @click="submitReview"
          :disabled="!form.rating || loading"
          class="btn btn-primary flex-1"
        >
          {{ loading ? '⏳ Enviando...' : ' Enviar Avaliação' }}
        </button>
      </div>

      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-error'">
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
    message.value = ' Por favor, selecione uma avaliação geral'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    await axios.post('/kadesh/api/reviews', form.value)
    message.value = ' Avaliação enviada com sucesso!'
    messageType.value = 'success'
    
    setTimeout(() => {
      router.push('/projects')
    }, 2000)
  } catch (error) {
    message.value = ' Erro: ' + (error.response?.data?.message || error.message)
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




