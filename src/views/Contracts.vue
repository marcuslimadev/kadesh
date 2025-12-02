<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Meus Contratos</h1>
          <p class="text-gray-600">Acompanhe seus contratos como Contratante ou Prestador</p>
        </div>
        <button @click="fetchContracts" class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">Atualizar</button>
      </div>

      <div v-if="loading" class="bg-white rounded-lg p-12 text-center shadow-sm">
        <div class="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <p class="mt-3 text-gray-600">Carregando contratos...</p>
      </div>

      <div v-else>
        <div v-if="contracts.length === 0" class="bg-white rounded-lg p-10 text-center shadow-sm">
          <p class="text-gray-600">Nenhum contrato encontrado.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="c in contracts" :key="c.id" class="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ c.project_title }}</h3>
                <p class="text-sm text-gray-500">Contrato #{{ c.id }} • {{ formatStatus(c.status) }}</p>
              </div>
              <router-link :to="{ name: 'contract-detail', params: { id: c.id } }" class="text-sm text-primary-600 hover:text-primary-700">
                Ver detalhes
              </router-link>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Contratante</p>
                <p class="font-medium text-gray-900">{{ c.client_name }}</p>
              </div>
              <div>
                <p class="text-gray-500">Prestador</p>
                <p class="font-medium text-gray-900">{{ c.provider_name }}</p>
              </div>
              <div>
                <p class="text-gray-500">Orçamento</p>
                <p class="font-medium text-gray-900">{{ formatCurrency(c.project_budget) }}</p>
              </div>
              <div>
                <p class="text-gray-500">Criado em</p>
                <p class="font-medium text-gray-900">{{ formatDate(c.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(true)
const contracts = ref([])

function formatCurrency(value) {
  const v = Number(value || 0)
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('pt-BR')
}
function formatStatus(status) {
  const map = {
    in_progress: 'Em andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }
  return map[status] || status
}

async function fetchContracts() {
  loading.value = true
  try {
    const { data } = await api.get('/api/contracts')
    contracts.value = data?.data || []
  } finally {
    loading.value = false
  }
}

onMounted(fetchContracts)
</script>
