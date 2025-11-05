<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-8">Encontre Novos Projetos</h1>

    <!-- Filters -->
    <div class="mb-8 p-4 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="text" v-model="filters.keyword" placeholder="Buscar por palavra-chave..." @input="fetchProjects" class="input-field">
        <input type="number" v-model.number="filters.max_budget" placeholder="Orçamento máximo" @input="fetchProjects" class="input-field">
      </div>
    </div>

    <!-- Project Grid -->
    <div v-if="loading">Carregando...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="project in projects" :key="project.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">{{ project.title }}</h2>
          <p class="text-gray-600 text-sm mb-4">{{ project.description.substring(0, 100) }}...</p>
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold text-lg" :style="{'color': 'var(--color-primary-600)'}">R$ {{ project.max_budget }}</span>
            <span class="text-gray-500">{{ project.bids_count || 0 }} lances</span>
          </div>
          <router-link :to="`/projects/${project.id}`" class="block w-full text-center mt-4 btn-primary">Ver Projeto</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script setup from before, no changes needed
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
  try {
    const response = await api.get('/api/projects', { params: filters })
    projects.value = response.data
  } catch {
    error.value = 'Falha ao carregar projetos.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProjects)
</script>
