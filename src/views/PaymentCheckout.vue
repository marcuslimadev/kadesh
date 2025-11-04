<template>
  <div class="min-h-screen bg-neutral-50 py-8">
    <div class="container-responsive">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="card card-elevated mb-8">
          <div class="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white rounded-t-xl">
            <h1 class="text-2xl md:text-3xl font-bold mb-2">💳 Pagamento do Projeto</h1>
            <p class="opacity-90">Finalize o pagamento via Mercado Pago</p>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="card card-elevated p-12 text-center">
          <div class="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p class="text-xl font-bold text-neutral-900">Preparando pagamento...</p>
        </div>

        <!-- Detalhes do Pagamento -->
        <div v-else-if="project" class="space-y-6">
          <div class="card card-elevated">
            <div class="card-body">
              <h2 class="text-xl font-bold text-neutral-900 mb-6">📋 Detalhes do Projeto</h2>

              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-neutral-200">
                  <span class="text-neutral-600 font-medium">Projeto:</span>
                  <span class="font-bold text-neutral-900">{{ project.title }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-neutral-200">
                  <span class="text-neutral-600 font-medium">Fornecedor:</span>
                  <span class="font-bold text-neutral-900">{{ project.provider_name }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b-2 border-primary-200 text-lg">
                  <span class="font-bold text-neutral-900">Valor Total:</span>
                  <span class="font-bold text-primary-600">R$ {{ formatMoney(amount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações importantes -->
          <div class="card card-elevated border-primary-200 bg-primary-50/50">
            <div class="card-body">
              <div class="flex items-start gap-3">
                <span class="text-2xl">ℹ️</span>
                <div>
                  <p class="font-bold text-neutral-900 mb-3">Informações importantes:</p>
                  <ul class="space-y-2 text-neutral-700">
                    <li class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      Pagamento seguro via Mercado Pago
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      O fornecedor só recebe após confirmação
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      Você pode pagar com cartão, boleto ou Pix
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      Taxa da plataforma: {{ platformFee }}% (já incluída)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Erro -->
          <div v-if="error" class="alert alert-error">
            <div class="flex items-center gap-3">
              <span class="text-2xl">⚠️</span>
              <p class="font-semibold">{{ error }}</p>
            </div>
          </div>

          <!-- Botão de Pagamento -->
          <div v-if="!paymentPreference">
            <button
              @click="createPayment"
              :disabled="creatingPayment"
              class="btn btn-primary w-full text-lg py-4"
            >
              {{ creatingPayment ? '⏳ Preparando...' : '💳 Ir para Pagamento' }}
            </button>
          </div>

          <!-- Link do Mercado Pago -->
          <div v-else class="space-y-4">
            <div class="alert alert-success">
               Pagamento preparado! Clique no botão abaixo para finalizar.
            </div>
            
            <a
              :href="paymentPreference.init_point"
              target="_blank"
              class="btn btn-primary w-full text-lg py-4 text-center block"
            >
              🚀 Abrir Mercado Pago
            </a>

            <p class="text-center text-sm text-neutral-600">
              Você será redirecionado para o site do Mercado Pago para concluir o pagamento com segurança.
            </p>

            <!-- Instruções -->
            <div class="bg-neutral-50 border-2 border-neutral-200 rounded-lg p-4 text-sm text-neutral-700">
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
            <router-link to="/projects" class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              ← Voltar para projetos
            </router-link>
          </div>
        </div>

        <!-- Projeto não encontrado -->
        <div v-else class="card card-elevated p-12 text-center">
          <div class="text-6xl mb-4">😕</div>
          <h2 class="text-2xl font-bold text-neutral-900 mb-2">Projeto não encontrado</h2>
          <router-link to="/projects" class="btn btn-outline-primary">
            ← Voltar para projetos
          </router-link>
        </div>
      </div>
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




