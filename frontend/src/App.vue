<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">K</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Kadesh</span>
            </router-link>
            
            <div class="hidden md:flex items-center space-x-6">
              <router-link to="/" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</router-link>
              <router-link to="/projects" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">Projetos</router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="!user">
              <router-link to="/login" 
                           class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Entrar
              </router-link>
              <router-link to="/register" 
                           class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                Registrar
              </router-link>
            </template>
            
            <template v-else>
              <div class="flex items-center space-x-4">
                <div class="hidden sm:block">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-semibold">{{ user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.is_contractor ? 'Contratante' : user.is_provider ? 'Fornecedor' : 'Usuário' }}</p>
                    </div>
                  </div>
                </div>
                
                <router-link to="/projects/create" 
                             class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
                  + Projeto
                </router-link>
                
                <button @click="logout" 
                        class="text-gray-500 hover:text-red-600 transition-colors p-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view @auth-change="fetchUser" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

const user = ref(null);

async function fetchUser() {
  try {
    const { data } = await api.get('/api/user');
    user.value = data;
  } catch (e) {
    user.value = null;
  }
}

async function logout() {
  try {
    await api.post('/api/logout');
  } catch (e) {}
  localStorage.removeItem('token');
  api.defaults.headers.common['Authorization'] = '';
  user.value = null;
}

onMounted(fetchUser);
</script>
