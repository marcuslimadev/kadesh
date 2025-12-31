<template>
  <div class="min-h-screen bg-page flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <img :src="logoImg" alt="Kadesh" class="h-32 w-32 object-contain" />
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-heading">
        Redefinir senha
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-surface py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <!-- Success message -->
        <div v-if="success" class="text-center">
          <div class="rounded-md bg-green-50 p-4 mb-6">
            <div class="flex justify-center">
              <svg class="h-12 w-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="mt-4 text-lg font-medium text-green-800">Senha alterada com sucesso!</p>
            <p class="mt-2 text-sm text-green-700">Você já pode fazer login com sua nova senha.</p>
          </div>
          <router-link 
            to="/login" 
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Ir para o Login
          </router-link>
        </div>

        <!-- Invalid token message -->
        <div v-else-if="invalidToken" class="text-center">
          <div class="rounded-md bg-red-50 p-4 mb-6">
            <div class="flex justify-center">
              <svg class="h-12 w-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="mt-4 text-lg font-medium text-red-800">Link inválido ou expirado</p>
            <p class="mt-2 text-sm text-red-700">Solicite um novo link de recuperação de senha.</p>
          </div>
          <router-link 
            to="/forgot-password" 
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Solicitar novo link
          </router-link>
        </div>

        <!-- Reset form -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-body">
              Nova senha
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-body">
              Confirmar nova senha
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': confirmPassword && password !== confirmPassword }"
                placeholder="Repita a senha"
              />
              <p v-if="confirmPassword && password !== confirmPassword" class="mt-1 text-sm text-red-600">
                As senhas não coincidem
              </p>
            </div>
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
              :disabled="loading || password !== confirmPassword || password.length < 6"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Salvando...' : 'Redefinir senha' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logoImg from '@/assets/logo.png'
import { useRoute } from 'vue-router'
import api from '@/services/api'

const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const invalidToken = ref(false)
const token = ref('')

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    invalidToken.value = true
  }
})

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  loading.value = true
  error.value = null

  try {
    await api.post('/api/auth/reset-password', { 
      token: token.value, 
      newPassword: password.value 
    })
    success.value = true
  } catch (err) {
    const errorMsg = err.response?.data?.error || 'Erro ao redefinir senha'
    if (errorMsg.includes('expirado') || errorMsg.includes('inválido')) {
      invalidToken.value = true
    } else {
      error.value = errorMsg
    }
  } finally {
    loading.value = false
  }
}
</script>


