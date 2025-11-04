<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Criar Nova Proposta</h1>
    <form @submit.prevent="createProject" class="p-8 bg-white rounded-lg shadow-md">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div class="md:col-span-2">
          <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
          <input type="text" id="title" v-model="form.title" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea id="description" v-model="form.description" required rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"></textarea>
        </div>
        <div>
          <label for="max_budget" class="block text-sm font-medium text-gray-700">Orçamento Máximo (R$)</label>
          <input type="number" id="max_budget" v-model.number="form.max_budget" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
        <div>
          <label for="bidding_ends_at" class="block text-sm font-medium text-gray-700">Prazo para Lances</label>
          <input type="date" id="bidding_ends_at" v-model="form.bidding_ends_at" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
        </div>
      </div>
      <div v-if="error" class="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {{ error }}
      </div>
      <div class="mt-6">
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Criar Proposta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const form = reactive({
  title: '',
  description: '',
  max_budget: 0,
  bidding_ends_at: '',
})
const error = ref(null)

async function createProject() {
  error.value = null
  try {
    await api.post('/api/projects', form)
    router.push('/contractor/dashboard')
  } catch (err) {
    if (err.response && err.response.data.errors) {
      error.value = Object.values(err.response.data.errors).flat().join(' ')
    } else {
      error.value = 'Ocorreu um erro ao criar a proposta.'
    }
  }
}
</script>
