<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="inline-block bg-white p-4 rounded shadow mb-4">
          <div class="text-5xl">🔐</div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
        <p class="text-neutral-900">Kadesh - Gerenciamento da Plataforma</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded shadow p-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email do Administrador</label>
          <input
            v-model="email"
            @keyup.enter="handleLogin"
            type="email"
            placeholder="admin@kadesh.com"
            autocomplete="username"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <input
            v-model="password"
            @keyup.enter="handleLogin"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-neutral-300 focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>

        <button
          @click="handleLogin"
          :disabled="loading || !email || !password"
          class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded font-bold text-lg shadow-lg hover:shadow hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ loading ? '⏳ Entrando...' : '🚀 Entrar no Painel' }}
        </button>

        <div v-if="error" class="bg-neutral-600 border-2 border-neutral-300 text-red-800 p-4 rounded text-sm">
           {{ error }}
        </div>

        <div class="text-center pt-4 border-t-2 border-gray-100">
          <router-link to="/" class="text-neutral-900 hover:text-neutral-900 text-sm font-medium">
            ← Voltar para o site
          </router-link>
        </div>
      </div>

      <!-- Info -->
      <div class="mt-6 text-center text-neutral-900 text-sm">
        <p>⚠️ Área restrita para administradores</p>
        <p class="mt-1 text-xs opacity-75">Credencial padrão: admin@kadesh.com / Kadesh@2025</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await axios.post('/kadesh/api/admin/login', {
      email: email.value,
      password: password.value
    })

    // Salvar estado de admin
    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('adminName', response.data.admin.name)

    // Redirecionar para dashboard
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>




