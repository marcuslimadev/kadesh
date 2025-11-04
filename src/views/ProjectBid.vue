<template>
  <div class="container mx-auto p-4">
    <div v-if="loading">Carregando...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="project" class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Project Details -->
      <div class="p-8 bg-white rounded-lg shadow-md md:col-span-2">
        <h1 class="text-3xl font-bold mb-2">{{ project.title }}</h1>
        <p class="text-gray-700 mb-4">{{ project.description }}</p>
        <div class="text-2xl font-bold text-indigo-600 mb-6">Orçamento Máximo: R$ {{ project.max_budget }}</div>

        <form @submit.prevent="placeBid" class="space-y-4">
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Valor do Lance (R$)</label>
            <input type="number" id="amount" v-model="bidForm.amount" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
          </div>
          <div>
            <label for="proposal" class="block text-sm font-medium text-gray-700">Sua Proposta</label>
            <textarea id="proposal" v-model="bidForm.proposal" required rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"></textarea>
          </div>
          <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Dar Lance
          </button>
        </form>
      </div>

      <!-- Bidding Leaderboard -->
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Lances</h2>
        <ul class="space-y-4">
          <li v-for="bid in bids" :key="bid.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-md">
            <div>
              <div class="font-bold">{{ bid.user_name }}</div>
            </div>
            <div class="text-lg font-bold text-indigo-600">R$ {{ bid.amount }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const project = ref(null)
const bids = ref([])
const loading = ref(true)
const error = ref(null)

const bidForm = reactive({
  project_id: parseInt(route.params.id),
  amount: 0,
  proposal: '',
})

async function fetchData() {
  try {
    const projectRes = await api.get(`/api/projects/${route.params.id}`)
    project.value = projectRes.data

    const bidsRes = await api.get(`/api/projects/${route.params.id}/bids`)
    bids.value = bidsRes.data
  } catch (err) {
    error.value = 'Falha ao carregar os dados do projeto.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

async function placeBid() {
  try {
    const response = await api.post('/api/bids', bidForm)
    // Adicionar o novo lance à lista localmente para atualização instantânea
    const userResponse = await api.get('/api/user');
    const newBid = {
        ...response.data,
        ...bidForm,
        user_name: userResponse.data.user?.name || 'Você'
    };
    bids.value.unshift(newBid);

    bidForm.amount = 0
    bidForm.proposal = ''
  } catch (err) {
    alert('Erro ao enviar o lance.')
  }
}
</script>
