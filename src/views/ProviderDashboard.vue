<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Buscar Propostas</h1>

    <div class="p-4 mb-6 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input type="text" v-model="filters.keyword" placeholder="Palavra-chave..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        <input type="number" v-model.number="filters.maxBudget" placeholder="Orçamento Máx." class="w-full px-3 py-2 border border-gray-300 rounded-md">
      </div>
    </div>

    <div v-if="loading" class="text-center">Carregando...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project in filteredProjects" :key="project.id" class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-bold">{{ project.title }}</h2>
        <p class="text-gray-600">{{ project.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-lg font-bold">R$ {{ project.max_budget }}</span>
          <button @click="viewProject(project.id)" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const allProjects = ref([])
const loading = ref(true)
const error = ref(null)

const filters = reactive({
  keyword: '',
  maxBudget: null,
})

async function fetchProjects() {
  try {
    const response = await api.get('/api/projects')
    allProjects.value = response.data
  } catch (err) {
    error.value = 'Falha ao carregar os projetos.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjects)

const filteredProjects = computed(() => {
  return allProjects.value.filter(p => {
    const keywordMatch = filters.keyword ? p.title.toLowerCase().includes(filters.keyword.toLowerCase()) : true
    const budgetMatch = filters.maxBudget ? p.max_budget <= filters.maxBudget : true
    return keywordMatch && budgetMatch
  })
})

function viewProject(projectId) {
  router.push(`/projects/${projectId}`)
}
</script>
