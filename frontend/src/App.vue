<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Mobile-first Navigation -->
    <nav class="bg-white shadow-lg border-b-2 border-indigo-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo - Mobile Optimized -->
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-base sm:text-lg">K</span>
            </div>
            <span class="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Kadesh</span>
          </router-link>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link to="/" class="text-gray-700 hover:text-indigo-600 transition-all font-semibold hover:scale-105 transform">Home</router-link>
            <router-link to="/projects" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">Projetos</router-link>
          </div>

          <!-- Auth Buttons - Mobile Optimized -->
          <div class="flex items-center space-x-1 sm:space-x-3">
            <template v-if="!user">
              <router-link to="/login" 
                           class="text-indigo-600 hover:text-indigo-700 transition-colors font-semibold text-sm sm:text-base px-2 sm:px-3 py-2">
                Entrar
              </router-link>
              <router-link to="/register" 
                           class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl transition-all duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105">
                Registrar
              </router-link>
            </template>
            
            <template v-else>
              <div class="flex items-center space-x-1 sm:space-x-3">
                <!-- User Info - Hidden on Small Mobile -->
                <div class="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg">
                  <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span class="text-white text-sm font-bold">{{ user.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ user.name }}</p>
                    <p class="text-xs font-medium" :class="user.user_type === 'contractor' ? 'text-indigo-600' : 'text-purple-600'">
                      {{ user.user_type === 'contractor' ? '👔 Contratante' : '⚡ Prestador' }}
                    </p>
                  </div>
                </div>
                
                <!-- New Project Button -->
                <router-link to="/projects/create" 
                             class="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl transition-all duration-200 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105">
                  <span class="hidden sm:inline">+ Projeto</span>
                  <span class="sm:hidden">+</span>
                </router-link>
                
                <!-- Logout Button -->
                <button @click="logout" 
                        class="text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all p-2 rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </button>
              </div>
            </template>
          </div>
        </div>
        
        <!-- Mobile Bottom Navigation (when logged in) -->
        <div v-if="user" class="md:hidden border-t border-indigo-100 py-2 flex justify-around items-center">
          <router-link to="/" class="flex flex-col items-center space-y-1 text-gray-600 hover:text-indigo-600 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span class="text-xs font-semibold">Home</span>
          </router-link>
          <router-link to="/projects" class="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-600 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="text-xs font-semibold">Projetos</span>
          </router-link>
          <div class="flex flex-col items-center space-y-1 text-gray-600 px-3 py-1">
            <div class="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <span class="text-xs font-semibold">Perfil</span>
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
  // Só busca usuário se houver cookie de sessão
  if (!document.cookie.includes('PHPSESSID')) {
    user.value = null;
    return;
  }
  
  try {
    const { data } = await api.get('/api/user');
    user.value = data.user; // Backend retorna { user: {...} }
  } catch (e) {
    // Silenciosamente falha se não autenticado
    user.value = null;
  }
}

async function logout() {
  try {
    await api.post('/api/logout');
  } catch (e) {}
  user.value = null;
  window.location.href = '/kadesh/login';
}

onMounted(fetchUser);
</script>
