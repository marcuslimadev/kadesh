<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-indigo-100">
        <div class="text-center mb-6 sm:mb-8">
          <div class="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform hover:rotate-12 transition-transform">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            👋 Bem-vindo de volta!
          </h2>
          <p class="text-gray-600 mt-2 text-sm sm:text-base font-medium">Acesse sua conta no Kadesh</p>
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
            <input v-model="form.email" type="email" 
                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium" 
                   placeholder="seu@email.com" required />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">🔒 Senha</label>
            <input v-model="form.password" type="password" 
                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium" 
                   placeholder="••••••••" required />
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-100">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" v-model="form.as_provider" 
                     class="w-5 h-5 text-indigo-600 bg-white border-2 border-gray-300 rounded focus:ring-indigo-500" />
              <div>
                <div class="text-sm font-bold text-gray-900">⚡ Entrar como Fornecedor</div>
                <div class="text-xs text-gray-600 font-medium">Acesso ao painel de lances e projetos</div>
              </div>
            </label>
          </div>

          <button :disabled="loading" 
                  class="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
            <span v-else>🚀 Entrar</span>
          </button>

          <div v-if="error" class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <p class="text-red-800 text-sm font-bold mb-2">{{ error }}</p>
                <router-link to="/forgot-password" 
                             class="text-xs font-bold text-orange-600 hover:text-orange-700 transition-all underline">
                  🔑 Esqueceu sua senha? Clique aqui
                </router-link>
              </div>
            </div>
          </div>
        </form>

        <div class="mt-6 sm:mt-8 text-center space-y-2">
          <p class="text-gray-600 text-sm font-medium">
            Não tem uma conta? 
            <router-link to="/register" class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all">
              Registre-se gratuitamente ✨
            </router-link>
          </p>
          <p class="text-gray-500 text-xs">
            <router-link to="/forgot-password" class="font-bold text-orange-600 hover:text-orange-700 transition-all">
              🔑 Esqueceu sua senha?
            </router-link>
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
const emit = defineEmits(['auth-change']);

const form = reactive({ email: '', password: '', as_provider: false });
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await api.post('/api/login', form);
    // Emite evento para atualizar usuário no App.vue
    emit('auth-change');
    // Sessão criada pelo backend automaticamente
    router.push('/projects');
  } catch (e) {
    error.value = e.response?.data?.message || 'Falha no login';
  } finally {
    loading.value = false;
  }
}
</script>
