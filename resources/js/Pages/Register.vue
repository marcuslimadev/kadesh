<template>
  <Layout>
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Criar Conta</h2>
            <p class="text-gray-600 mt-2">Junte-se à nossa plataforma gratuitamente</p>
          </div>

          <ValidationErrors :errors="errors" title="Por favor, corrija os seguintes erros:" />

          <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  v-model="form.name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Seu nome completo"
                />
                <div v-if="errors.name" class="mt-2 text-sm text-red-600">
                  {{ errors.name }}
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  v-model="form.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="seu@email.com"
                />
                <div v-if="errors.email" class="mt-2 text-sm text-red-600">
                  {{ errors.email }}
                </div>
              </div>

              <div>
                <label for="user_type" class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuário
                </label>
                <select
                  id="user_type"
                  v-model="form.user_type"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="contractor">Cliente (Contratar serviços)</option>
                  <option value="provider">Fornecedor (Oferecer serviços)</option>
                </select>
                <div v-if="errors.user_type" class="mt-2 text-sm text-red-600">
                  {{ errors.user_type }}
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
                <div v-if="errors.password" class="mt-2 text-sm text-red-600">
                  <div v-if="Array.isArray(errors.password)">
                    <div v-for="error in errors.password" :key="error" class="mb-1">
                      {{ error }}
                    </div>
                  </div>
                  <div v-else>
                    {{ errors.password }}
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  A senha deve ter pelo menos 8 caracteres
                </div>
              </div>

              <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  id="password_confirmation"
                  type="password"
                  v-model="form.password_confirmation"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="••••••••"
                />
                <div v-if="errors.password_confirmation" class="mt-2 text-sm text-red-600">
                  {{ errors.password_confirmation }}
                </div>
              </div>

              <div class="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  v-model="form.terms"
                  required
                  class="mt-1 rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500"
                />
                <label for="terms" class="ml-3 text-sm text-gray-600">
                  Eu concordo com os 
                  <Link href="/terms" class="text-purple-600 hover:text-purple-500">
                    Termos de Uso
                  </Link>
                  e 
                  <Link href="/privacy" class="text-purple-600 hover:text-purple-500">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              <div v-if="errors.terms" class="text-sm text-red-600">
                {{ errors.terms }}
              </div>

              <button
                type="submit"
                :disabled="processing"
                :class="[
                  'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200',
                  processing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                ]"
              >
                <span v-if="processing">Criando conta...</span>
                <span v-else>Criar Conta</span>
              </button>
            </div>
          </form>

          <div class="mt-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div class="mt-6 text-center">
              <p class="text-gray-600">
                Já tem uma conta?
                <Link href="/login" class="text-purple-600 hover:text-purple-500 font-semibold">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { router } from '@inertiajs/vue3'
import Layout from '../Components/Layout.vue'
import ValidationErrors from '../Components/ValidationErrors.vue'
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  }
})

const processing = ref(false)

const form = reactive({
  name: '',
  email: '',
  user_type: '',
  password: '',
  password_confirmation: '',
  terms: false
})

const handleSubmit = () => {
  processing.value = true
  
  router.post('/register', form, {
    onFinish: () => {
      processing.value = false
    },
    onError: () => {
      form.password = ''
      form.password_confirmation = ''
    }
  })
}
</script>