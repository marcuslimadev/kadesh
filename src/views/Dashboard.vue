<template>
  <div class="container mx-auto p-4">
    <div v-if="user">
      <h1 class="text-3xl font-bold mb-2">Bem-vindo, {{ user.name }}!</h1>
      <p class="text-gray-600 mb-8">Escolha como você quer começar.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contractor Panel -->
        <router-link to="/contractor/dashboard" class="block p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-bold">Sou Contratante</h2>
          <p class="mt-2 text-gray-600">Crie e gerencie seus projetos, encontre os melhores profissionais.</p>
        </router-link>

        <!-- Provider Panel -->
        <router-link to="/provider/dashboard" class="block p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-bold">Sou Fornecedor</h2>
          <p class="mt-2 text-gray-600">Encontre projetos, envie suas propostas e gerencie seus trabalhos.</p>
        </router-link>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Carregando...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const user = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/api/user')
    user.value = data
  } catch {
    // Handle error
  }
})
</script>
