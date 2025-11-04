<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Criar uma conta</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Form fields from before -->
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
            <label for="document" class="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
            <input type="text" id="document" v-model="form.document" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
        </div>

        <!-- LGPD Consents -->
        <div class="space-y-4">
          <div class="flex items-start">
            <input id="terms" v-model="form.terms" type="checkbox" required class="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded">
            <label for="terms" class="ml-2 text-sm text-gray-700">Eu li e aceito os <a href="#" class="text-indigo-600 hover:underline">Termos de Uso</a>.</label>
          </div>
          <div class="flex items-start">
            <input id="privacy" v-model="form.privacy" type="checkbox" required class="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded">
            <label for="privacy" class="ml-2 text-sm text-gray-700">Eu li e aceito a <a href="#" class="text-indigo-600 hover:underline">Política de Privacidade</a>.</label>
          </div>
        </div>

        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Registrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  document: '',
  terms: false,
  privacy: false,
})

function handleRegister() {
  if (!form.terms || !form.privacy) {
    alert('Você deve aceitar os termos e a política de privacidade.')
    return
  }

  // Mock registration
  console.log('User registered:', form)
  router.push('/dashboard')
}
</script>
