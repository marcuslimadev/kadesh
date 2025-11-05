<template>
  <div class="min-h-screen flex text-neutral-800">
    <!-- Left Panel with Image -->
    <div class="hidden md:block w-1/2 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')">
      <div class="bg-black bg-opacity-60 h-full flex flex-col justify-end items-start text-white p-12">
        <h1 class="text-5xl font-bold">Construa o Futuro.</h1>
        <p class="mt-4 text-xl">A plataforma definitiva para seus projetos e serviços.</p>
      </div>
    </div>

    <!-- Right Panel with Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
      <div class="w-full max-w-sm">
        <h2 class="text-4xl font-bold mb-8">Acesse sua conta</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block font-semibold">Email</label>
            <input type="email" id="email" v-model="email" required class="input-field mt-2">
          </div>
          <div>
            <label for="password" class="block font-semibold">Senha</label>
            <input type="password" id="password" v-model="password" required class="input-field mt-2">
          </div>
          <div v-if="error" class="text-red-600 font-medium">{{ error }}</div>
          <button type="submit" class="w-full btn-primary text-lg">Entrar</button>
        </form>
        <p class="mt-8 text-center text-gray-600">Não tem uma conta? <router-link to="/register" class="font-semibold text-blue-600">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
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
    window.location.href = router.resolve('/dashboard').href; // Use router to resolve correct base path
  } catch (err) {
    error.value = err.response?.data?.message || 'Credenciais inválidas.'
  }
}
</script>
