<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Minha Carteira</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <div class="mb-6">
        <div class="text-lg font-bold">Saldo Disponível</div>
        <div class="text-3xl font-bold text-indigo-600">R$ {{ balance.toFixed(2) }}</div>
      </div>

      <h2 class="text-xl font-bold mb-4">Histórico de Transações</h2>
      <ul class="space-y-4">
        <li v-for="tx in transactions" :key="tx.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-md">
          <div>
            <div class="font-bold">{{ tx.description }}</div>
            <div class="text-sm text-gray-600">{{ tx.date }}</div>
          </div>
          <div :class="tx.amount > 0 ? 'text-green-600' : 'text-red-600'">
            {{ tx.amount > 0 ? '+' : '' }} R$ {{ tx.amount.toFixed(2) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const balance = ref(1250.75)
const transactions = ref([
  { id: 1, description: 'Pagamento liberado - Marco 1', date: '2023-10-10', amount: 2000 },
  { id: 2, description: 'Taxa da plataforma', date: '2023-10-10', amount: -200 },
  { id: 3, description: 'Saque para conta bancária', date: '2023-10-11', amount: -1800 },
])
</script>
