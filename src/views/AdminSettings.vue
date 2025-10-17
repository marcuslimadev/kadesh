<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <router-link to="/admin/dashboard" class="text-purple-100 hover:text-white text-sm mb-2 inline-block">
              ← Voltar ao Dashboard
            </router-link>
            <h1 class="text-3xl font-bold">⚙️ Configurações do Sistema</h1>
          </div>
          <button
            @click="saveSettings"
            :disabled="saving"
            class="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition-all disabled:opacity-50"
          >
            {{ saving ? '⏳ Salvando...' : '💾 Salvar Alterações' }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Carregando configurações...</p>
      </div>

      <template v-else>
        <!-- MERCADO PAGO -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-4xl">💳</div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Mercado Pago</h2>
              <p class="text-gray-600 text-sm">Configurações de integração de pagamento</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ambiente</label>
              <select
                v-model="settings.payment.mp_environment.value"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              >
                <option value="test">🧪 Teste (Sandbox)</option>
                <option value="prod">🚀 Produção (Live)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Use "Teste" durante desenvolvimento</p>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Public Key (TEST)</label>
                <input
                  v-model="settings.payment.mp_public_key_test.value"
                  type="text"
                  placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Access Token (TEST)</label>
                <input
                  v-model="settings.payment.mp_access_token_test.value"
                  type="password"
                  placeholder="TEST-xxxxxxxxxxxx-xxxxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Public Key (PRODUÇÃO)</label>
                <input
                  v-model="settings.payment.mp_public_key_prod.value"
                  type="text"
                  placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all font-mono text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Access Token (PRODUÇÃO)</label>
                <input
                  v-model="settings.payment.mp_access_token_prod.value"
                  type="password"
                  placeholder="APP_USR-xxxxxxxxxxxx-xxxxxxxxxxxx"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Taxa da Plataforma (%)</label>
              <div class="flex items-center gap-4">
                <input
                  v-model.number="settings.payment.platform_fee_percentage.value"
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  class="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
                />
                <span class="text-2xl font-bold text-purple-600">{{ settings.payment.platform_fee_percentage.value }}%</span>
                <span class="text-sm text-gray-600">
                  Exemplo: Em R$ 100,00 → Plataforma recebe R$ {{ calculateFee(100) }}
                </span>
              </div>
            </div>

            <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p class="text-sm text-blue-900 font-medium mb-2">📘 Como obter suas credenciais:</p>
              <ol class="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Acesse <a href="https://www.mercadopago.com.br/developers/panel/app" target="_blank" class="underline font-medium">https://www.mercadopago.com.br/developers/panel/app</a></li>
                <li>Crie uma aplicação ou selecione uma existente</li>
                <li>Copie as credenciais de TEST e PRODUÇÃO</li>
                <li>Cole aqui e salve</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- GERAL -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-4xl">🏢</div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Configurações Gerais</h2>
              <p class="text-gray-600 text-sm">Informações básicas do site</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Site</label>
              <input
                v-model="settings.general.site_name.value"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
              <input
                v-model="settings.general.site_email.value"
                type="email"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
              <input
                v-model="settings.general.site_phone.value"
                type="tel"
                placeholder="(11) 98765-4321"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div class="flex items-center gap-3 pt-8">
              <input
                v-model="maintenanceMode"
                type="checkbox"
                id="maintenance"
                class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label for="maintenance" class="text-sm font-medium text-gray-700 cursor-pointer">
                🚧 Modo Manutenção (site offline)
              </label>
            </div>
          </div>
        </div>

        <!-- LIMITES -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-4xl">📊</div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Limites do Sistema</h2>
              <p class="text-gray-600 text-sm">Restrições e quotas</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Máx. Projetos por Usuário</label>
              <input
                v-model.number="settings.limits.max_projects_per_user.value"
                type="number"
                min="1"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Máx. Propostas por Projeto</label>
              <input
                v-model.number="settings.limits.max_bids_per_project.value"
                type="number"
                min="1"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Máx. Imagens no Portfólio</label>
              <input
                v-model.number="settings.limits.max_portfolio_images.value"
                type="number"
                min="1"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tamanho Máx. Imagem (MB)</label>
              <input
                v-model.number="settings.limits.max_image_size_mb.value"
                type="number"
                min="1"
                max="50"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Botão Salvar -->
        <div class="flex gap-4">
          <button
            @click="saveSettings"
            :disabled="saving"
            class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ saving ? '⏳ Salvando...' : '💾 Salvar Todas as Configurações' }}
          </button>
        </div>

        <!-- Mensagem -->
        <div v-if="message" class="p-4 rounded-xl" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
          {{ message }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const settings = ref({
  payment: {},
  general: {},
  email: {},
  limits: {}
})
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref('')

const maintenanceMode = computed({
  get() {
    return settings.value.general.maintenance_mode?.value === 'true'
  },
  set(value) {
    if (settings.value.general.maintenance_mode) {
      settings.value.general.maintenance_mode.value = value ? 'true' : 'false'
    }
  }
})

const calculateFee = (amount) => {
  const fee = settings.value.payment.platform_fee_percentage?.value || 10
  return ((amount * fee) / 100).toFixed(2)
}

const loadSettings = async () => {
  loading.value = true
  try {
    const response = await axios.get('/kadesh/api/admin/settings')
    settings.value = response.data
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  message.value = ''

  try {
    // Preparar dados para envio
    const data = {}
    
    Object.keys(settings.value).forEach(category => {
      Object.keys(settings.value[category]).forEach(key => {
        data[key] = settings.value[category][key].value
      })
    })

    await axios.put('/kadesh/api/admin/settings', data)
    
    message.value = '✅ Configurações salvas com sucesso! Arquivo .env.mp atualizado.'
    messageType.value = 'success'
  } catch (error) {
    message.value = '❌ Erro ao salvar configurações: ' + (error.response?.data?.message || error.message)
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (!localStorage.getItem('isAdmin')) {
    router.push('/admin/login')
    return
  }
  loadSettings()
})
</script>
