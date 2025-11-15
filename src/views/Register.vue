<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <h1 class="text-4xl font-bold text-primary-600">Kadesh</h1>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Crie sua conta
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Já tem uma conta?
        <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          Faça login
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- User Type Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Tipo de conta
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.type = 'client'"
                :class="[
                  'flex flex-col items-center p-4 border-2 rounded-lg transition-all',
                  form.type === 'client'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <svg class="w-8 h-8 mb-2" :class="form.type === 'client' ? 'text-primary-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span :class="['text-sm font-medium', form.type === 'client' ? 'text-primary-700' : 'text-gray-700']">
                  Cliente
                </span>
                <span class="text-xs text-gray-500 mt-1">Contratar serviços</span>
              </button>

              <button
                type="button"
                @click="form.type = 'provider'"
                :class="[
                  'flex flex-col items-center p-4 border-2 rounded-lg transition-all',
                  form.type === 'provider'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <svg class="w-8 h-8 mb-2" :class="form.type === 'provider' ? 'text-primary-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span :class="['text-sm font-medium', form.type === 'provider' ? 'text-primary-700' : 'text-gray-700']">
                  Prestador
                </span>
                <span class="text-xs text-gray-500 mt-1">Oferecer serviços</span>
              </button>
            </div>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.name }"
                placeholder="João Silva"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
                placeholder="seu@email.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm pr-10"
                :class="{ 'border-red-500': errors.password }"
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
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
            <!-- Password strength indicator -->
            <div v-if="form.password" class="mt-2">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="[
                      'h-full transition-all',
                      passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : '',
                      passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : '',
                      passwordStrength === 'strong' ? 'w-full bg-green-500' : ''
                    ]"
                  ></div>
                </div>
                <span :class="[
                  'text-xs font-medium',
                  passwordStrength === 'weak' ? 'text-red-600' : '',
                  passwordStrength === 'medium' ? 'text-yellow-600' : '',
                  passwordStrength === 'strong' ? 'text-green-600' : ''
                ]">
                  {{ passwordStrength === 'weak' ? 'Fraca' : passwordStrength === 'medium' ? 'Média' : 'Forte' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar senha
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-500': errors.confirmPassword }"
                placeholder="Digite a senha novamente"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>

          <!-- Terms acceptance -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.acceptTerms"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="font-medium text-gray-700">
                Aceito os
                <a href="#" class="text-primary-600 hover:text-primary-500">termos de uso</a>
                e a
                <a href="#" class="text-primary-600 hover:text-primary-500">política de privacidade</a>
              </label>
              <p v-if="errors.acceptTerms" class="mt-1 text-red-600">
                {{ errors.acceptTerms }}
              </p>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: 'client',
  acceptTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
  general: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const passwordStrength = computed(() => {
  const password = form.password
  if (password.length < 6) return 'weak'
  if (password.length < 10) return 'medium'
  
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const strength = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(Boolean).length
  
  if (strength >= 3) return 'strong'
  if (strength >= 2) return 'medium'
  return 'weak'
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
    isValid = false
  } else if (form.name.trim().length < 3) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  // Validate password
  if (!form.password) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirmação de senha é obrigatória'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
    isValid = false
  }

  // Validate terms
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Você deve aceitar os termos de uso'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      type: form.type
    })

    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      errors.general = result.error
    }
  } catch (error) {
    errors.general = 'Erro ao criar conta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>
