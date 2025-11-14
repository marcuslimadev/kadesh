<template>
  <div class="min-h-screen bg-gray-50">
    <AdminNavbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
        <p class="text-gray-600 mt-2">Configure taxas, credenciais e parâmetros gerais</p>
      </div>

      <LoadingScreen :show="loading" message="Carregando configurações..." icon="⚙️" />

      <div v-if="!loading" class="space-y-6">
        <!-- Configurações de Taxas -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fas fa-percentage text-yellow-500"></i>
              Taxas do Sistema
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Taxa da Plataforma (%)
                </label>
                <input 
                  v-model="settings.platform_fee"
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Percentual cobrado em cada transação (padrão: 10%)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Valor Mínimo de Projeto (R$)
                </label>
                <input 
                  v-model="settings.min_project_amount"
                  type="number" 
                  step="10"
                  min="10"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Valor mínimo para criar um projeto (padrão: R$ 50)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mercado Pago -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fab fa-cc-mastercard text-blue-500"></i>
              Mercado Pago
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div class="flex items-start gap-3">
                <i class="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
                <div>
                  <p class="text-sm font-medium text-yellow-800">Credenciais Sensíveis</p>
                  <p class="text-xs text-yellow-700 mt-1">Estas credenciais são salvas em .env.mp e nunca expostas publicamente.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Access Token (Produção)
                </label>
                <input 
                  v-model="settings.mp_access_token"
                  type="password" 
                  placeholder="APP_USR-xxxxxxxxxxxxxxxxxxxxxxxx"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                >
                <a href="https://www.mercadopago.com.br/developers/panel/credentials" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 block">
                  <i class="fas fa-external-link-alt mr-1"></i>Obter credenciais no Mercado Pago
                </a>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Public Key
                </label>
                <input 
                  v-model="settings.mp_public_key"
                  type="text" 
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <div class="flex gap-2">
                  <input 
                    :value="`${siteUrl}/api/webhooks/mercadopago`"
                    type="text" 
                    readonly
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  >
                  <button @click="copyWebhookUrl" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                <p class="text-xs text-gray-500 mt-1">Configure esta URL no painel do Mercado Pago</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Parâmetros de Leilão -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fas fa-gavel text-purple-500"></i>
              Parâmetros de Leilão
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Duração Padrão (dias)
                </label>
                <input 
                  v-model="settings.default_auction_duration"
                  type="number" 
                  min="1"
                  max="30"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Duração padrão de novos leilões (padrão: 7 dias)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Soft Close (minutos)
                </label>
                <input 
                  v-model="settings.soft_close_minutes"
                  type="number" 
                  min="1"
                  max="60"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Extensão automática quando houver lance próximo ao fim (padrão: 2 min)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Score - Peso Preço (%)
                </label>
                <input 
                  v-model="settings.score_price_weight"
                  type="number" 
                  min="0"
                  max="100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Peso do preço no cálculo de score (padrão: 70%)</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Score - Peso Reputação (%)
                </label>
                <input 
                  v-model="settings.score_reputation_weight"
                  type="number" 
                  min="0"
                  max="100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Peso da reputação no cálculo de score (padrão: 30%)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notificações -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i class="fas fa-bell text-red-500"></i>
              Notificações
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email do Admin
                </label>
                <input 
                  v-model="settings.admin_email"
                  type="email" 
                  placeholder="admin@kadesh.com.br"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Email para receber alertas do sistema</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp (Suporte)
                </label>
                <input 
                  v-model="settings.support_whatsapp"
                  type="tel" 
                  placeholder="+55 31 99999-9999"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">Número de WhatsApp para suporte</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input 
                v-model="settings.email_notifications_enabled"
                type="checkbox" 
                id="email_notifications"
                class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              >
              <label for="email_notifications" class="text-sm font-medium text-gray-700">
                Ativar notificações por email
              </label>
            </div>
          </div>
        </div>

        <!-- Botão Salvar -->
        <div class="flex justify-end gap-4">
          <button @click="resetToDefaults" class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
            <i class="fas fa-undo mr-2"></i>Restaurar Padrões
          </button>
          <button @click="saveSettings" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            <i class="fas fa-save mr-2"></i>Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AdminNavbar from '@/components/admin/AdminNavbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const loading = ref(false)
const siteUrl = window.location.origin

const settings = ref({
  platform_fee: 10,
  min_project_amount: 50,
  mp_access_token: '',
  mp_public_key: '',
  default_auction_duration: 7,
  soft_close_minutes: 2,
  score_price_weight: 70,
  score_reputation_weight: 30,
  admin_email: '',
  support_whatsapp: '',
  email_notifications_enabled: true
})

const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/admin/settings', { withCredentials: true })
    if (res.data.settings) {
      settings.value = { ...settings.value, ...res.data.settings }
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    await axios.post('/api/admin/settings', settings.value, { withCredentials: true })
    alert('✅ Configurações salvas com sucesso!')
  } catch (error) {
    alert('❌ Erro ao salvar configurações: ' + (error.response?.data?.error || error.message))
  }
}

const resetToDefaults = () => {
  if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
    settings.value = {
      platform_fee: 10,
      min_project_amount: 50,
      mp_access_token: '',
      mp_public_key: '',
      default_auction_duration: 7,
      soft_close_minutes: 2,
      score_price_weight: 70,
      score_reputation_weight: 30,
      admin_email: '',
      support_whatsapp: '',
      email_notifications_enabled: true
    }
  }
}

const copyWebhookUrl = () => {
  const url = `${siteUrl}/api/webhooks/mercadopago`
  navigator.clipboard.writeText(url)
  alert('✅ URL do webhook copiada!')
}

onMounted(() => {
  fetchSettings()
})
</script>
