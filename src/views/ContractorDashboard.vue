<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Minhas Propostas</h1>
      <router-link to="/projects/create" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Nova Proposta
      </router-link>
    </div>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <!-- Mock data for proposals -->
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
import { ref } from 'vue'

const proposals = ref([
  { id: 1, title: 'Reforma de Cozinha', description: 'Reforma completa da cozinha, incluindo troca de azulejos e instalação de novos armários.', status: 'Aberto' },
  { id: 2, title: 'Pintura de Apartamento', description: 'Pintura de um apartamento de 2 quartos.', status: 'Em andamento' },
  { id: 3, title: 'Instalação de Ar Condicionado', description: 'Instalação de um ar condicionado split no quarto principal.', status: 'Concluído' },
])
</script>
