<template>
  <div class="max-w-2xl mx-auto p-4 md:p-6">
    <div class="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded text-white shadow mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">💳 Pagamento do Projeto</h1>
      <p class="opacity-90">Finalize o pagamento via Mercado Pago</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded shadow-lg p-12 text-center">
      <div class="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600">Preparando pagamento...</p>
    </div>

    <!-- Detalhes do Pagamento -->
    <div v-else-if="project" class="space-y-6">
      <div class="bg-white rounded shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">📋 Detalhes do Projeto</h2>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Projeto:</span>
            <span class="font-bold text-gray-900">{{ project.title }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fornecedor:</span>
            <span class="font-bold text-gray-900">{{ project.provider_name }}</span>
          </div>
          <div class="flex justify-between text-lg pt-3 border-t-2 border-gray-100">
            <span class="font-bold text-gray-900">Valor Total:</span>
            <span class="font-bold text-neutral-900">R$ {{ formatMoney(amount) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border-2 border-neutral-300 rounded p-4 text-sm text-neutral-900">
        <p class="font-medium mb-2">ℹ️ Informações importantes:</p>
        <ul class="space-y-1 ml-4 list-disc">
          <li>Pagamento seguro via Mercado Pago</li>
          <li>O fornecedor só recebe após confirmação</li>
          <li>Você pode pagar com cartão, boleto ou Pix</li>
          <li>Taxa da plataforma: {{ platformFee }}% (já incluída)</li>
        </ul>
      </div>

      <!-- Erro -->
      <div v-if="error" class="bg-neutral-600 border-2 border-neutral-300 text-red-800 p-4 rounded">
         {{ error }}
      </div>

      <!-- Botão de Pagamento -->
      <div v-if="!paymentPreference">
        <button
          @click="createPayment"
          :disabled="creatingPayment"
          class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded font-bold text-lg shadow-lg hover:shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ creatingPayment ? '⏳ Preparando...' : '💳 Ir para Pagamento' }}
        </button>
      </div>

      <!-- Link do Mercado Pago -->
      <div v-else class="space-y-4">
        <div class="bg-neutral-800 border-2 border-green-300 text-neutral-900 p-4 rounded">
           Pagamento preparado! Clique no botão abaixo para finalizar.
        </div>
        
        <a
          :href="paymentPreference.init_point"
          target="_blank"
          class="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded font-bold text-lg shadow-lg hover:shadow text-center transition-all"
        >
          🚀 Abrir Mercado Pago
        </a>

        <p class="text-center text-sm text-gray-600">
          Você será redirecionado para o site do Mercado Pago para concluir o pagamento com segurança.
        </p>

        <!-- Instruções -->
        <div class="bg-gray-50 border-2 border-gray-200 rounded p-4 text-sm text-gray-700">
          <p class="font-medium mb-2">📱 Opções de pagamento disponíveis:</p>
          <ul class="space-y-1 ml-4 list-disc">
            <li>💳 Cartão de crédito (até 12x)</li>
            <li> Cartão de débito</li>
            <li>🏦 Boleto bancário</li>
            <li> Pix (aprovação instantânea)</li>
          </ul>
        </div>
      </div>

      <div class="text-center">
        <router-link to="/projects" class="text-neutral-900 hover:text-neutral-900 text-sm">
          ← Voltar para projetos
        </router-link>
      </div>
    </div>

    <!-- Projeto não encontrado -->
    <div v-else class="bg-white rounded shadow-lg p-12 text-center">
      <div class="text-6xl mb-4">😕</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Projeto não encontrado</h2>
      <router-link to="/projects" class="text-neutral-900 hover:text-neutral-900">
        ← Voltar para projetos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id

const loading = ref(true)
const creatingPayment = ref(false)
const project = ref(null)
const amount = ref(0)
const platformFee = ref(10)
const paymentPreference = ref(null)
const error = ref('')

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const loadProject = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get(`/kadesh/api/projects/${projectId}`)
    project.value = response.data
    
    // Assumir que o valor vem do bid vencedor
    amount.value = project.value.winning_bid_amount || 0
    
    if (!amount.value) {
      error.value = 'Projeto sem valor definido ou sem lance vencedor'
    }
  } catch (err) {
    error.value = 'Erro ao carregar projeto: ' + (err.response?.data?.message || err.message)
  } finally {
    loading.value = false
  }
}

const createPayment = async () => {
  creatingPayment.value = true
  error.value = ''

  try {
    const response = await axios.post(`/kadesh/api/projects/${projectId}/payment`)
    paymentPreference.value = response.data
    
    // Opcional: abrir automaticamente
    // window.open(response.data.init_point, '_blank')
  } catch (err) {
    error.value = 'Erro ao criar pagamento: ' + (err.response?.data?.message || err.message)
  } finally {
    creatingPayment.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>




