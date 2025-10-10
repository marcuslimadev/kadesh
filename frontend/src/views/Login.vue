<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Bem-vindo de volta!</h2>
          <p class="text-gray-600 mt-2">Acesse sua conta no Kadesh</p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                   placeholder="seu@email.com" required />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <input v-model="form.password" type="password" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                   placeholder="••••••••" required />
          </div>

          <div class="bg-gray-50 rounded-xl p-4">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" v-model="form.as_provider" 
                     class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
              <div>
                <div class="text-sm font-medium text-gray-900">Entrar como Fornecedor</div>
                <div class="text-xs text-gray-500">Acesso ao painel de lances e projetos</div>
              </div>
            </label>
          </div>

          <button :disabled="loading" 
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
            <span v-else>Entrar</span>
          </button>

          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-800 text-sm font-medium">{{ error }}</p>
            </div>
          </div>
        </form>

        <div class="mt-8 text-center">
          <p class="text-gray-600 text-sm">
            Não tem uma conta? 
            <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Registre-se gratuitamente</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ email: '', password: '', as_provider: false });
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.post('/api/login', form);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    router.push('/projects');
  } catch (e) {
    error.value = e.response?.data?.message || 'Falha no login';
  } finally {
    loading.value = false;
  }
}
</script>
