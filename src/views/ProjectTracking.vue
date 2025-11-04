<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Acompanhamento do Projeto</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Timeline de Eventos</h2>
      <div class="space-y-6">
        <div v-for="event in timeline" :key="event.id" class="flex items-start">
          <div class="flex items-center justify-center w-8 h-8 rounded-full" :class="event.color">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="event.icon"></svg>
          </div>
          <div class="ml-4">
            <div class="font-bold">{{ event.title }}</div>
            <div class="text-sm text-gray-600">{{ event.date }}</div>
          </div>
        </div>
      </div>

      <!-- Milestones Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Marcos (Milestones)</h2>
        <div class="space-y-4">
          <div v-for="milestone in milestones" :key="milestone.id" class="p-4 border border-gray-200 rounded-md">
            <div class="flex justify-between items-center">
              <div class="font-bold">{{ milestone.title }}</div>
              <div :class="milestone.status === 'Pago' ? 'text-green-600' : 'text-yellow-600'">{{ milestone.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timeline = ref([
  { id: 1, title: 'Proposta Criada', date: '2023-10-01', color: 'bg-blue-500', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />' },
  { id: 2, title: 'Leilão Iniciado', date: '2023-10-01', color: 'bg-yellow-500', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />' },
  { id: 3, title: 'Vencedor Escolhido', date: '2023-10-05', color: 'bg-green-500', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' },
  { id: 4, title: 'Pagamento em Escrow', date: '2023-10-06', color: 'bg-indigo-500', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />' },
])

const milestones = ref([
  { id: 1, title: 'Marco 1: Fundação', status: 'Pago' },
  { id: 2, title: 'Marco 2: Estrutura', status: 'Pendente' },
])
</script>
