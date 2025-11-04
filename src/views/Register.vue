<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-900">Criar uma conta</h2>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Nome completo</label>
          <input type="text" id="name" v-model="name" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="userType" class="block text-sm font-medium text-gray-700">Eu sou um</label>
          <select id="userType" v-model="userType" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="contractor">Contratante</option>
            <option value="provider">Contratado</option>
          </select>
        </div>
        <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Registrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const userType = ref('contractor')
const router = useRouter()

function handleRegister() {
  // Mock registration logic
  const user = {
    name: name.value,
    email: email.value,
    userType: userType.value,
  }

  // Store user data and login state in localStorage
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('userName', user.name)
  localStorage.setItem('userType', user.userType)


  // Redirect to dashboard
  router.push('/dashboard')
}
</script>
