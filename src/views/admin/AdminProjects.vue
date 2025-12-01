<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Kaddesh Admin</h1>
            <div class="hidden md:ml-10 md:flex md:space-x-4">
              <router-link to="/admin/dashboard" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Dashboard</router-link>
              <router-link to="/admin/users" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Usuários</router-link>
              <router-link to="/admin/projects" class="px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100">Projetos</router-link>
              <router-link to="/admin/payments" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pagamentos</router-link>
              <router-link to="/admin/disputes" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Disputas</router-link>
              <router-link to="/admin/advertisements" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Anúncios</router-link>
              <router-link to="/admin/settings" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Configurações</router-link>
            </div>
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Sair</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6">Gerenciar Projetos</h2>
      <div class="bg-white rounded-xl shadow-md p-6">
        <p class="text-gray-600">Gerenciamento de projetos em desenvolvimento...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  toast.success('Logout realizado com sucesso')
  router.push('/admin/login')
}
</script>
