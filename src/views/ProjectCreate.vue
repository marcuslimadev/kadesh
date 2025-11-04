<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Criar Nova Proposta</h1>
    <form @submit.prevent="createProject" class="p-8 bg-white rounded-lg shadow-md">
      <div class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" id="title" v-model="title" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea id="description" v-model="description" required rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div>
          <label for="budget" class="block text-sm font-medium text-gray-700">Orçamento (R$)</label>
          <input type="number" id="budget" v-model="budget" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Criar Proposta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const budget = ref(0)
const router = useRouter()

function createProject() {
  // Mock project creation logic
  const newProject = {
    title: title.value,
    description: description.value,
    budget: budget.value,
    status: 'Aberto',
  }

  // For demonstration, we'll just log it and redirect
  console.log('New project created:', newProject)

  // In a real app, you would save this to a database
  // and then redirect to the contractor dashboard
  router.push('/contractor/dashboard')
}
</script>
