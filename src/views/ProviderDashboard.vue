<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Buscar Propostas</h1>

    <div class="p-4 mb-6 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input type="text" v-model="filters.keyword" placeholder="Palavra-chave..." @input="fetchProjects" class="w-full px-3 py-2 border rounded-md">
        <input type="number" v-model.number="filters.max_budget" placeholder="Orçamento Máx." @input="fetchProjects" class="w-full px-3 py-2 border rounded-md">
      </div>
    </div>

    <div v-if="loading" class="text-center">Carregando...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project in projects" :key="project.id" class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-bold">{{ project.title }}</h2>
        <p class="text-gray-600">{{ project.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-lg font-bold">R$ {{ project.max_budget }}</span>
          <router-link :to="`/projects/${project.id}`" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md">
            Ver Detalhes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api'

const projects = ref([])
const loading = ref(true)
const error = ref(null)

const filters = reactive({
  keyword: '',
  max_budget: null,
})

async function fetchProjects() {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/api/projects', { params: filters })
    projects.value = response.data
  } catch (err) {
    error.value = 'Falha ao carregar os projetos.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjects)
</script>
