<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Criar Nova Proposta</h1>
    <form @submit.prevent="createProject" class="p-8 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="md:col-span-2">
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" id="title" v-model="form.title" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição Detalhada</label>
          <textarea id="description" v-model="form.description" required rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">Localização</label>
          <select id="location" v-model="form.location" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>Presencial</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </select>
        </div>
        <div>
          <label for="deadline" class="block text-sm font-medium text-gray-700">Prazo</label>
          <input type="date" id="deadline" v-model="form.deadline" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="minBudget" class="block text-sm font-medium text-gray-700">Orçamento Mínimo (R$)</label>
          <input type="number" id="minBudget" v-model.number="form.minBudget" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="maxBudget" class="block text-sm font-medium text-gray-700">Orçamento Máximo (R$)</label>
          <input type="number" id="maxBudget" v-model.number="form.maxBudget" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div class="md:col-span-2">
          <label for="attachments" class="block text-sm font-medium text-gray-700">Anexos</label>
          <input type="file" id="attachments" @change="handleFileUpload" multiple class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
        <div class="md:col-span-2">
          <div class="flex items-center">
            <input id="confidential" v-model="form.isConfidential" type="checkbox" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
            <label for="confidential" class="block ml-2 text-sm text-gray-900">Proposta Confidencial</label>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Criar Proposta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  title: '',
  description: '',
  location: 'Presencial',
  deadline: '',
  minBudget: 0,
  maxBudget: 0,
  attachments: [],
  isConfidential: false,
})

function handleFileUpload(event) {
  form.attachments = Array.from(event.target.files)
}

function createProject() {
  if (form.minBudget > form.maxBudget) {
    alert('O orçamento mínimo não pode ser maior que o máximo.')
    return
  }

  // Mock project creation
  console.log('New project created:', form)
  router.push('/contractor/dashboard')
}
</script>
