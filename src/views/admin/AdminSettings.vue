<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Kadesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/disputes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Disputas</router-link>
              <router-link to="/admin/advertisements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Anúncios</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Configurações do Sistema</h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <button @click="error = null" class="ml-auto text-red-400 hover:text-red-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">{{ successMessage }}</p>
          </div>
          <button @click="successMessage = null" class="ml-auto text-green-400 hover:text-green-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="!loading">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'mercadopago'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'mercadopago'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Mercado Pago
            </button>
            <button
              @click="activeTab = 'system'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'system'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Sistema
            </button>
          </nav>
        </div>

        <!-- Mercado Pago Tab -->
        <div v-if="activeTab === 'mercadopago'" class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Configurações do Mercado Pago</h3>
          <p class="text-sm text-gray-600 mb-6">Configure as chaves de API do Mercado Pago para processar pagamentos.</p>

          <div class="space-y-6">
            <!-- Public Key -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Public Key *
                <span class="text-xs text-gray-500 ml-2">(Chave pública para frontend)</span>
              </label>
              <input
                v-model="mpPublicKey"
                type="text"
                placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="mt-1 text-xs text-gray-500">Encontre em: Dashboard do Mercado Pago → Suas integrações → Credenciais</p>
            </div>

            <!-- Access Token -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Access Token *
                <span class="text-xs text-gray-500 ml-2">(Chave privada para backend)</span>
              </label>
              <div class="relative">
                <input
                  v-model="mpAccessToken"
                  :type="showToken ? 'text' : 'password'"
                  placeholder="APP_USR-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx"
                  class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  @click="showToken = !showToken"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg v-if="!showToken" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">⚠️ Nunca compartilhe este token! Ele dá acesso total à sua conta MP.</p>
            </div>

            <!-- Environment -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ambiente
              </label>
              <select
                v-model="mpEnvironment"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sandbox">Sandbox (Testes)</option>
                <option value="production">Produção (Real)</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Use Sandbox para testes. Mude para Produção quando estiver pronto.</p>
            </div>

            <!-- Save Button -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                @click="testMercadoPago"
                :disabled="saving || !mpPublicKey || !mpAccessToken"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Testar Conexão
              </button>
              <button
                @click="saveMercadoPago"
                :disabled="saving || !mpPublicKey || !mpAccessToken"
                class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Salvando...' : 'Salvar Configurações' }}
              </button>
            </div>
          </div>
        </div>

        <!-- System Tab -->
        <div v-if="activeTab === 'system'" class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Configurações do Sistema</h3>
          
          <div class="space-y-6">
            <div v-for="setting in settings" :key="setting.key" class="border-b border-gray-200 pb-6 last:border-0">
              <div class="flex items-start justify-between">
                <div class="flex-1 mr-4">
                  <h4 class="text-base font-medium text-gray-900">{{ setting.key }}</h4>
                  <p class="text-sm text-gray-500 mt-1">{{ setting.description }}</p>
                  <div class="mt-3">
                    <input
                      v-model="setting.value"
                      @blur="updateSetting(setting)"
                      type="text"
                      class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="setting.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ setting.is_public ? 'Público' : 'Privado' }}
                </span>
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
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const error = ref(null)
const successMessage = ref(null)
const settings = ref([])
const activeTab = ref('mercadopago')
const showToken = ref(false)

// Mercado Pago
const mpPublicKey = ref('')
const mpAccessToken = ref('')
const mpEnvironment = ref('sandbox')

const fetchSettings = async () => {
  try {
    error.value = null
    const token = localStorage.getItem('adminToken')
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.success) {
      settings.value = response.data.data
      
      // Carregar configs do MP
      const mpPubKey = settings.value.find(s => s.key === 'mercadopago_public_key')
      const mpAccToken = settings.value.find(s => s.key === 'mercadopago_access_token')
      const mpEnv = settings.value.find(s => s.key === 'mercadopago_environment')
      
      if (mpPubKey) mpPublicKey.value = mpPubKey.value
      if (mpAccToken) mpAccessToken.value = mpAccToken.value
      if (mpEnv) mpEnvironment.value = mpEnv.value
    }
  } catch (err) {
    console.error('Error fetching settings:', err)
    if (err.response?.status === 401) {
      router.push('/admin/login')
    } else {
      error.value = 'Não foi possível carregar as configurações. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}

const saveMercadoPago = async () => {
  try {
    saving.value = true
    error.value = null
    successMessage.value = null

    const token = localStorage.getItem('adminToken')
    
    // Salvar as 3 configurações
    const updates = [
      { key: 'mercadopago_public_key', value: mpPublicKey.value, description: 'Chave pública do Mercado Pago', is_public: false },
      { key: 'mercadopago_access_token', value: mpAccessToken.value, description: 'Access Token do Mercado Pago', is_public: false },
      { key: 'mercadopago_environment', value: mpEnvironment.value, description: 'Ambiente do Mercado Pago (sandbox/production)', is_public: false }
    ]

    for (const update of updates) {
      // Tentar atualizar primeiro
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/settings/${update.key}`,
          update,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        // Se não existe, criar
        if (err.response?.status === 404) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/settings`,
            update,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } else {
          throw err
        }
      }
    }

    successMessage.value = 'Configurações do Mercado Pago salvas com sucesso!'
    await fetchSettings()
  } catch (err) {
    console.error('Error saving MP config:', err)
    error.value = 'Erro ao salvar configurações do Mercado Pago: ' + (err.response?.data?.error || err.message)
  } finally {
    saving.value = false
  }
}

const testMercadoPago = async () => {
  try {
    saving.value = true
    error.value = null
    successMessage.value = null

    // Testar se as credenciais são válidas
    const response = await axios.get('https://api.mercadopago.com/v1/payment_methods', {
      headers: { Authorization: `Bearer ${mpAccessToken.value}` }
    })

    if (response.data) {
      successMessage.value = '✅ Conexão com Mercado Pago testada com sucesso! Credenciais válidas.'
    }
  } catch (err) {
    console.error('Error testing MP:', err)
    if (err.response?.status === 401) {
      error.value = '❌ Access Token inválido. Verifique suas credenciais no Mercado Pago.'
    } else {
      error.value = '❌ Erro ao testar conexão: ' + (err.message || 'Verifique suas credenciais.')
    }
  } finally {
    saving.value = false
  }
}

const updateSetting = async (setting) => {
  try {
    error.value = null
    const token = localStorage.getItem('adminToken')
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/settings/${setting.key}`,
      { value: setting.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    successMessage.value = 'Configuração atualizada!'
    setTimeout(() => { successMessage.value = null }, 3000)
  } catch (err) {
    console.error('Error updating setting:', err)
    error.value = 'Erro ao atualizar configuração: ' + (err.response?.data?.error || err.message)
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/admin/login')
}

onMounted(() => {
  fetchSettings()
})
</script>
