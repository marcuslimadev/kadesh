<template>
  <div class="container mx-auto p-4">
    <div v-if="user" class="p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="mb-4">Bem-vindo, {{ user.name }}!</p>

      <div class="space-y-4">
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">Seu perfil atual:</label>
          <select id="role" v-model="selectedRole" class="w-full max-w-xs px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="contractor">Contratante</option>
            <option value="provider">Contratado</option>
          </select>
        </div>
        <button @click="switchRole" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Mudar Perfil
        </button>
      </div>

      <div class="mt-6">
        <router-link :to="dashboardLink" class="text-indigo-600 hover:underline">Ir para o painel de {{ selectedRole === 'contractor' ? 'Contratante' : 'Contratado' }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const selectedRole = ref('')
const router = useRouter()

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    selectedRole.value = user.value.userType
  }
})

const dashboardLink = computed(() => {
  return selectedRole.value === 'contractor' ? '/contractor/dashboard' : '/provider/dashboard'
})

function switchRole() {
  if (user.value) {
    // Update user role in localStorage
    user.value.userType = selectedRole.value
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('userType', selectedRole.value)

    // Navigate to the corresponding dashboard
    router.push(dashboardLink.value)
  }
}
</script>
