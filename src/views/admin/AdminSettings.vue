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

      <div v-else class="bg-white rounded-xl shadow-md p-6">
        <div class="space-y-6">
          <div v-for="setting in settings" :key="setting.key" class="border-b border-gray-200 pb-6 last:border-0">
            <div class="flex items-start justify-between">
              <div class="flex-1 mr-4">
                <h3 class="text-lg font-medium text-gray-900">{{ setting.key }}</h3>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const settings = ref([])

const fetchSettings = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (response.data.success) {
      settings.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    } else {
      toast.error('Erro ao carregar configurações')
    }
  } finally {
    loading.value = false
  }
}

const updateSetting = async (setting) => {
  try {
    const token = localStorage.getItem('adminToken')
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/settings/${setting.key}`,
      { value: setting.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    toast.success('Configuração atualizada com sucesso')
  } catch (error) {
    console.error('Error updating setting:', error)
    toast.error('Erro ao atualizar configuração')
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}

onMounted(() => {
  fetchSettings()
})
</script>
