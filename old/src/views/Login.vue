<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-accent-500 mb-2">⚡ KADESH</h1>
        <p class="text-gray-300">Marketplace de Leilões Reversos</p>
      </div>

      <div class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Entrar</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="input"
              placeholder="Senha"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              id="rememberMe"
              class="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
            />
            <label for="rememberMe" class="ml-2 text-sm text-gray-700">
              Manter conectado por 7 dias
            </label>
          </div>

          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary py-3 text-lg"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Não tem conta?
            <router-link to="/register" class="text-accent-600 hover:text-accent-700 font-semibold">
              Registre-se
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, loading, error } = useAuth()

const form = ref({
  email: '',
  password: '',
  rememberMe: true // Marcado por padrão
})

const handleLogin = async () => {
  try {
    await login(form.value.email, form.value.password, form.value.rememberMe)
    await router.push('/auctions')
  } catch (err) {
    console.error('Erro no login:', err)
    // Error já está no composable
  }
}
</script>
