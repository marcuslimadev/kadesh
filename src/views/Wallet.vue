<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Minha Carteira</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <div v-if="loading">Carregando...</div>
      <div v-else>
        <div class="mb-6">
          <div class="text-lg font-bold">Saldo Disponível</div>
          <div class="text-3xl font-bold text-indigo-600">R$ {{ balance.toFixed(2) }}</div>
        </div>

        <h2 class="text-xl font-bold mb-4">Histórico de Transações</h2>
        <ul class="space-y-4">
          <li v-for="tx in transactions" :key="tx.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-md">
            <div>
              <div class="font-bold">{{ tx.type }}</div>
              <div class="text-sm text-gray-600">{{ new Date(tx.created_at).toLocaleString() }}</div>
            </div>
            <div :class="tx.amount > 0 ? 'text-green-600' : 'text-red-600'">
              {{ tx.amount > 0 ? '+' : '' }} R$ {{ parseFloat(tx.amount).toFixed(2) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const balance = ref(0)
const transactions = ref([])
const loading = ref(true)

async function fetchWalletData() {
  try {
    const [balanceRes, transactionsRes] = await Promise.all([
      api.get('/api/wallet/balance'),
      api.get('/api/wallet/transactions')
    ])
    balance.value = balanceRes.data.balance
    transactions.value = transactionsRes.data
  } catch (error) {
    console.error('Failed to fetch wallet data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchWalletData)
</script>
