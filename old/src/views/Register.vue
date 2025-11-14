<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-accent-500 mb-2">⚡ KADESH</h1>
        <p class="text-gray-300">Marketplace de Leilões Reversos</p>
      </div>

      <div class="card">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Cadastro</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Seu nome completo"
            />
          </div>

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
              minlength="6"
              class="input"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
            <select v-model="form.user_type" class="input">
              <option value="contractor">Contratante (Publica projetos)</option>
              <option value="provider">Fornecedor (Dá lances)</option>
            </select>
          </div>

          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-3 rounded">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn btn-primary py-3 text-lg"
          >
            {{ loading ? 'Criando conta...' : 'Registrar' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Já tem conta?
            <router-link to="/login" class="text-accent-600 hover:text-accent-700 font-semibold">
              Faça login
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
const { register, loading, error } = useAuth()

const form = ref({
  name: '',
  email: '',
  password: '',
  user_type: 'contractor'
})

const handleRegister = async () => {
  try {
    await register(form.value)
    router.push('/auctions')
  } catch (err) {
    // Error já está no composable
  }
}
</script>
