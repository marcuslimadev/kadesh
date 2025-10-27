<template>
  <div class="min-h-screen bg-neutral-900 flex items-center justify-center p-3 sm:p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded shadow p-6 sm:p-8 border-2 border-neutral-300">
        <div class="text-center mb-6 sm:mb-8">
          <div class="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded flex items-center justify-center mb-4 shadow-lg hover:rotate-12 transition-transform">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            🔑 Recuperar Senha
          </h2>
          <p class="text-gray-600 mt-2 text-sm sm:text-base font-medium">
            Digite seu email para receber instruções
          </p>
        </div>

        <div v-if="!success" class="space-y-5">
          <form @submit.prevent="submit">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2"> Email Cadastrado</label>
              <input v-model="email" type="email" 
                     class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 font-medium" 
                     placeholder="seu@email.com" required />
            </div>

            <button :disabled="loading" 
                    class="w-full mt-5 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-bold py-3.5 px-4 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow">
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
              <span v-else>📨 Enviar Link de Recuperação</span>
            </button>

            <div v-if="error" class="mt-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-neutral-300 rounded p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-800 text-sm font-bold">{{ error }}</p>
              </div>
            </div>
          </form>
        </div>

        <!-- Success State -->
        <div v-else class="text-center py-4">
          <div class="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2"> Email Enviado!</h3>
          <p class="text-gray-600 text-sm mb-6">
            Verifique sua caixa de entrada em <span class="font-bold">{{ email }}</span>
          </p>
          <router-link to="/login" 
                       class="inline-block bg-neutral-900 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded font-bold text-sm transition-all shadow-lg hover:shadow hover:opacity-90">
            🔐 Voltar para Login
          </router-link>
        </div>

        <div class="mt-6 sm:mt-8 text-center space-y-2">
          <p class="text-gray-600 text-sm font-medium">
            Lembrou a senha? 
            <router-link to="/login" class="font-bold text-transparent bg-clip-text bg-neutral-900 hover:from-indigo-700 hover:to-purple-700 transition-all">
              Faça login 👉
            </router-link>
          </p>
          <p class="text-gray-500 text-xs">
            Não tem conta? 
            <router-link to="/register" class="font-bold text-orange-600 hover:text-orange-700 transition-all">
              Registre-se aqui
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

async function submit() {
  loading.value = true;
  error.value = '';
  
  try {
    await api.post('/api/forgot-password', { email: email.value });
    success.value = true;
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao enviar email. Tente novamente.';
  } finally {
    loading.value = false;
  }
}
</script>




