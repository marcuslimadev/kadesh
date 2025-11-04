<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Minhas Propostas</h1>
      <router-link to="/projects/create" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Nova Proposta
      </router-link>
    </div>
    <div v-if="loading" class="text-center">Carregando...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="proposal in proposals" :key="proposal.id" class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-bold">{{ proposal.title }}</h2>
        <p class="text-gray-600">{{ proposal.description }}</p>
        <div class="mt-4">
          <span class="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">{{ proposal.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const proposals = ref([])
const loading = ref(true)
const error = ref(null)

async function fetchProposals() {
  try {
    const response = await api.get('/api/projects')
    // O endpoint GET /api/projects retorna todos os projetos, não apenas do usuário.
    // O ideal seria um endpoint /api/my-projects, mas vamos filtrar no frontend por enquanto.
    const userResponse = await api.get('/api/user');
    if (userResponse.data.user) {
        const userId = userResponse.data.user.id;
        proposals.value = response.data.filter(p => p.contractor_id === userId);
    }
  } catch (err) {
    error.value = 'Falha ao carregar as propostas.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProposals)
</script>
