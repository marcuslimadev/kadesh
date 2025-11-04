<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Entrar na sua conta</h2>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>

        <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {{ error }}
        </div>

        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

async function handleLogin() {
  error.value = null
  try {
    await api.post('/api/login', { email: email.value, password: password.value })
    // A sessão é criada pelo backend, redirecionar para o dashboard
    router.push('/dashboard')
  } catch (err) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || 'Credenciais inválidas.'
    } else {
      error.value = 'Ocorreu um erro. Tente novamente.'
    }
  }
}
</script>
