<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Já tem uma conta?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Faça login
          </router-link>
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          <div 
            v-for="(stepItem, index) in steps" 
            :key="index"
            class="flex items-center"
          >
            <div class="flex flex-col items-center">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                :class="currentStep >= index + 1 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-500'"
              >
                <span v-if="currentStep > index + 1">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="mt-2 text-xs font-medium" :class="currentStep >= index + 1 ? 'text-primary-600' : 'text-gray-500'">
                {{ stepItem }}
              </span>
            </div>
            <div 
              v-if="index < steps.length - 1" 
              class="w-20 h-0.5 mx-2"
              :class="currentStep > index + 1 ? 'bg-primary-600' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit">
          <!-- Step 1: Dados Pessoais -->
          <div v-show="currentStep === 1" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
            
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.name }"
                placeholder="João Silva"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.email }"
                placeholder="joao@exemplo.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Senha *
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.password }"
                placeholder="Mínimo 6 caracteres"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha *
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                :disabled="isLoading"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.confirmPassword }"
                placeholder="Digite a senha novamente"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Step 2: Tipo de Conta -->
          <div v-show="currentStep === 2" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Tipo de Conta</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                class="border-2 rounded-lg p-6 cursor-pointer transition-all"
                :class="form.type === 'client' 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-300'"
                @click="form.type = 'client'"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-semibold text-gray-900">Cliente</h4>
                  <div 
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    :class="form.type === 'client' 
                      ? 'border-primary-600 bg-primary-600' 
                      : 'border-gray-300'"
                  >
                    <div v-if="form.type === 'client'" class="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p class="text-sm text-gray-600">
                  Contrate profissionais qualificados para seus projetos
                </p>
                <ul class="mt-4 space-y-2 text-sm text-gray-600">
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Publique projetos
                  </li>
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Receba propostas
                  </li>
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Gerencie pagamentos
                  </li>
                </ul>
              </div>

              <div 
                class="border-2 rounded-lg p-6 cursor-pointer transition-all"
                :class="form.type === 'provider' 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-300'"
                @click="form.type = 'provider'"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-lg font-semibold text-gray-900">Prestador</h4>
                  <div 
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    :class="form.type === 'provider' 
                      ? 'border-primary-600 bg-primary-600' 
                      : 'border-gray-300'"
                  >
                    <div v-if="form.type === 'provider'" class="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <p class="text-sm text-gray-600">
                  Ofereça seus serviços e conquiste novos clientes
                </p>
                <ul class="mt-4 space-y-2 text-sm text-gray-600">
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Envie propostas
                  </li>
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Mostre seu portfólio
                  </li>
                  <li class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Receba pagamentos
                  </li>
                </ul>
              </div>
            </div>
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
          </div>

          <!-- Step 3: Termos -->
          <div v-show="currentStep === 3" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Termos e Condições</h3>
            
            <div class="bg-gray-50 rounded-lg p-6 max-h-64 overflow-y-auto border border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-3">Termos de Uso - Kadesh</h4>
              <div class="space-y-3 text-sm text-gray-600">
                <p>Ao criar uma conta na plataforma Kadesh, você concorda com os seguintes termos:</p>
                <ul class="list-disc list-inside space-y-2">
                  <li>Você fornecerá informações verdadeiras e atualizadas</li>
                  <li>Você é responsável pela segurança da sua conta</li>
                  <li>Você não usará a plataforma para atividades ilegais</li>
                  <li>A plataforma cobra uma taxa de 1% sobre transações</li>
                  <li>Você concorda com nossa política de privacidade</li>
                  <li>Você pode encerrar sua conta a qualquer momento</li>
                </ul>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-start">
                <input
                  id="terms"
                  v-model="form.acceptTerms"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="terms" class="ml-2 text-sm text-gray-700">
                  Eu li e aceito os <a href="#" class="text-primary-600 hover:text-primary-500">Termos de Uso</a> e a 
                  <a href="#" class="text-primary-600 hover:text-primary-500">Política de Privacidade</a>
                </label>
              </div>
              <p v-if="errors.acceptTerms" class="text-sm text-red-600">{{ errors.acceptTerms }}</p>

              <div class="flex items-start">
                <input
                  id="newsletter"
                  v-model="form.acceptNewsletter"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="newsletter" class="ml-2 text-sm text-gray-700">
                  Quero receber novidades, dicas e ofertas exclusivas por email
                </label>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errors.general" class="mt-6 rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="mt-8 flex items-center justify-between">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="previousStep"
              :disabled="isLoading"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            <div v-else></div>

            <button
              v-if="currentStep < 3"
              type="button"
              @click="nextStep"
              :disabled="isLoading"
              class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>

            <button
              v-else
              type="submit"
              :disabled="isLoading || !form.acceptTerms"
              class="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!isLoading">Criar Conta</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const steps = ['Dados Pessoais', 'Tipo de Conta', 'Termos']
const currentStep = ref(1)

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: 'client',
  acceptTerms: false,
  acceptNewsletter: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: '',
  acceptTerms: '',
  general: ''
})

const isLoading = ref(false)

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validateStep1 = () => {
  clearErrors()
  let isValid = true

  if (!form.name || form.name.trim().length < 3) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
    isValid = false
  }

  return isValid
}

const validateStep2 = () => {
  clearErrors()
  
  if (!form.type) {
    errors.type = 'Selecione um tipo de conta'
    return false
  }

  return true
}

const validateStep3 = () => {
  clearErrors()
  
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Você deve aceitar os termos de uso'
    return false
  }

  return true
}

const nextStep = () => {
  let isValid = false

  if (currentStep.value === 1) {
    isValid = validateStep1()
  } else if (currentStep.value === 2) {
    isValid = validateStep2()
  }

  if (isValid && currentStep.value < 3) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    clearErrors()
    currentStep.value--
  }
}

const handleSubmit = async () => {
  if (!validateStep3()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register({
      name: form.name,
      email: form.email,
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
    console.error('Register error:', error)
    errors.general = 'Erro ao criar conta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>
