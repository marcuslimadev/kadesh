<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Buscar Propostas</h1>

    <!-- Search and Filters -->
    <div class="p-4 mb-6 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input type="text" v-model="filters.keyword" placeholder="Palavra-chave..." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option value="">Todas as Categorias</option>
          <option>Construção</option>
          <option>Reforma</option>
          <option>Manutenção</option>
        </select>
        <input type="number" v-model.number="filters.maxBudget" placeholder="Orçamento Máx." class="w-full px-3 py-2 border border-gray-300 rounded-md">
        <button @click="applyFilters" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Filtrar</button>
      </div>
    </div>

    <!-- Project Listings -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="project in filteredProjects" :key="project.id" class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-lg font-bold">{{ project.title }}</h2>
        <p class="text-gray-600">{{ project.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-lg font-bold">R$ {{ project.budget }}</span>
          <button @click="viewProject(project.id)" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const projects = ref([
  { id: 1, title: 'Reforma de Cozinha', description: 'Reforma completa da cozinha...', budget: 5000, category: 'Reforma' },
  { id: 2, title: 'Pintura de Apartamento', description: 'Pintura de um apartamento de 2 quartos.', budget: 2000, category: 'Reforma' },
  { id: 3, title: 'Instalação de Ar Condicionado', description: 'Instalação de um ar condicionado split.', budget: 500, category: 'Manutenção' },
  { id: 4, title: 'Construção de Muro', description: 'Construção de um muro de 2 metros de altura.', budget: 10000, category: 'Construção' },
])

const filters = reactive({
  keyword: '',
  category: '',
  maxBudget: null,
})

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const keywordMatch = filters.keyword ? p.title.toLowerCase().includes(filters.keyword.toLowerCase()) : true
    const categoryMatch = filters.category ? p.category === filters.category : true
    const budgetMatch = filters.maxBudget ? p.budget <= filters.maxBudget : true
    return keywordMatch && categoryMatch && budgetMatch
  })
})

function applyFilters() {
  // The computed property will update automatically
}

function viewProject(projectId) {
  router.push(`/projects/${projectId}`)
}
</script>
