<template>
  <Layout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900">Fazer Login</h2>
            <p class="text-gray-600 mt-2">Entre na sua conta para continuar</p>
          </div>

          <ValidationErrors :errors="errors" />

          <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  v-model="form.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                />
                <div v-if="errors.email" class="mt-2 text-sm text-red-600">
                  {{ errors.email }}
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
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <div v-if="errors.password" class="mt-2 text-sm text-red-600">
                  {{ errors.password }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.remember"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <Link href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-500">
                  Esqueci a senha
                </Link>
              </div>

              <button
                type="submit"
                :disabled="processing"
                :class="[
                  'w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200',
                  processing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                ]"
              >
                <span v-if="processing">Entrando...</span>
                <span v-else>Entrar</span>
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
                Não tem uma conta?
                <Link href="/register" class="text-blue-600 hover:text-blue-500 font-semibold">
                  Cadastre-se gratuitamente
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
  email: '',
  password: '',
  remember: false
})

const handleSubmit = () => {
  processing.value = true
  
  router.post('/login', form, {
    onFinish: () => {
      processing.value = false
    },
    onError: () => {
      form.password = ''
    }
  })
}
</script>