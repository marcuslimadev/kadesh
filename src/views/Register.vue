<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Criar uma conta</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nome completo</label>
            <input type="text" id="name" v-model="form.name" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" v-model="form.email" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input type="password" id="password" v-model="form.password" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="userType" class="block text-sm font-medium text-gray-700">Eu sou um</label>
            <select id="userType" v-model="form.type" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="contractor">Contratante</option>
              <option value="provider">Contratado</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ error }}
        </div>

        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Registrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  type: 'contractor',
})
const error = ref(null)

async function handleRegister() {
  error.value = null
  try {
    await api.post('/api/register', form)
    // A sessão é criada pelo backend, então podemos redirecionar
    router.push('/dashboard')
  } catch (err) {
    if (err.response && err.response.data.errors) {
      error.value = Object.values(err.response.data.errors).flat().join(' ')
    } else {
      error.value = 'Ocorreu um erro. Tente novamente.'
    }
  }
}
</script>
