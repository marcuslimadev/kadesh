<template>
  <div class="min-h-screen flex">
    <!-- Left Panel with Image -->
    <div class="hidden md:block w-1/2 bg-cover" style="background-image: url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop')">
      <div class="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-white p-12">
        <h1 class="text-4xl font-bold">Junte-se à KADESH</h1>
        <p class="mt-4 text-lg text-center">Comece a transformar seus projetos em realidade ou ofereça seus serviços para uma vasta rede de oportunidades.</p>
      </div>
    </div>

    <!-- Right Panel with Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6">Crie sua conta</h2>
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block font-medium">Nome</label>
            <input type="text" id="name" v-model="form.name" required class="input-field mt-1">
          </div>
          <div>
            <label for="email" class="block font-medium">Email</label>
            <input type="email" id="email" v-model="form.email" required class="input-field mt-1">
          </div>
          <div>
            <label for="password" class="block font-medium">Senha</label>
            <input type="password" id="password" v-model="form.password" required class="input-field mt-1">
          </div>
          <div v-if="error" class="text-red-600">{{ error }}</div>
          <button type="submit" class="w-full btn-primary">Registrar</button>
        </form>
        <p class="mt-6 text-center">Já tem uma conta? <router-link to="/login" class="text-blue-600">Acesse</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const form = reactive({
  name: '',
  email: '',
  password: '',
  type: 'contractor', // Default type
})
const error = ref(null)

async function handleRegister() {
  error.value = null
  try {
    await api.post('/api/register', form)
    // After registration, log the user in to create the session
    await api.post('/api/login', { email: form.email, password: form.password })
    window.location.href = '/dashboard' // Full page reload to refresh auth state
  } catch (err) {
    error.value = err.response?.data?.message || 'Ocorreu um erro no registro.'
  }
}
</script>
