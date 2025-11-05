<template>
  <div class="min-h-screen flex">
    <!-- Left Panel with Image -->
    <div class="hidden md:block w-1/2 bg-cover" style="background-image: url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop')">
      <div class="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white p-12">
        <h1 class="text-4xl font-bold">KADESH</h1>
        <p class="mt-4 text-lg text-center">Conectando profissionais e oportunidades no mundo da construção.</p>
      </div>
    </div>

    <!-- Right Panel with Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6">Acesse sua conta</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block font-medium">Email</label>
            <input type="email" id="email" v-model="email" required class="input-field mt-1">
          </div>
          <div>
            <label for="password" class="block font-medium">Senha</label>
            <input type="password" id="password" v-model="password" required class="input-field mt-1">
          </div>
          <div v-if="error" class="text-red-600">{{ error }}</div>
          <button type="submit" class="w-full btn-primary">Entrar</button>
        </form>
        <p class="mt-6 text-center">Não tem uma conta? <router-link to="/register" class="text-blue-600">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Script setup from before
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const error = ref(null)
const router = useRouter()

async function handleLogin() {
  error.value = null
  try {
    await api.post('/api/login', { email: email.value, password: password.value })
    window.location.href = '/dashboard' // Full page reload to refresh auth state
  } catch (err) {
    error.value = err.response?.data?.message || 'Credenciais inválidas.'
  }
}
</script>
