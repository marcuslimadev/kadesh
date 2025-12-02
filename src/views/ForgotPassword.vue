<template>
  <div class="min-h-screen bg-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <h1 class="text-4xl font-bold text-primary-600">Kaddesh</h1>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-heading">
        Recuperar senha
      </h2>
      <p class="mt-2 text-center text-sm text-body">
        Lembrou a senha?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Voltar ao login
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Success message -->
        <div v-if="success" class="rounded-md bg-green-50 p-4 mb-6">
          <div class="flex">
            <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-body">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Digite o email associado à sua conta. Enviaremos instruções para redefinir sua senha.
            </p>
          </div>

          <!-- Error message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Enviando...' : 'Enviar instruções' }}
            </button>
          </div>
        </form>

        <!-- Dev link (only shown in development) -->
        <div v-if="devResetLink" class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-sm text-yellow-800 font-medium mb-2">🔧 Link de desenvolvimento:</p>
          <a :href="devResetLink" class="text-sm text-blue-600 hover:underline break-all">
            {{ devResetLink }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const email = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const successMessage = ref('')
const devResetLink = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  devResetLink.value = null

  try {
    const response = await api.post('/api/auth/forgot-password', { email: email.value })
    
    success.value = true
    successMessage.value = response.data.message
    
    // Show dev link if available
    if (response.data.devResetLink) {
      devResetLink.value = response.data.devResetLink
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao enviar solicitação'
  } finally {
    loading.value = false
  }
}
</script>
