<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Criar Conta</h2>
          <p class="text-gray-600 mt-2">Junte-se ao melhor marketplace de projetos</p>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
            <input v-model="form.name" type="text" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                   placeholder="Seu nome completo" required />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" 
                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                   placeholder="seu@email.com" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
              <input v-model="form.password" type="password" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                     placeholder="••••••••" required />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Confirmar</label>
              <input v-model="form.password_confirmation" type="password" 
                     class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                     placeholder="••••••••" required />
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">Você é:</p>
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" v-model="form.is_contractor" 
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 group-hover:text-blue-600">Contratante</div>
                  <div class="text-xs text-gray-500">Publico projetos e contrato fornecedores</div>
                </div>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" v-model="form.is_provider" 
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-900 group-hover:text-blue-600">Fornecedor</div>
                  <div class="text-xs text-gray-500">Participo de leilões e executo projetos</div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="form.is_provider" class="bg-blue-50 rounded-xl p-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Profissão</label>
                <input v-model="form.profession" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                       placeholder="Ex: Designer" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Taxa/Hora</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-500 text-sm">R$</span>
                  <input v-model.number="form.hourly_rate" type="number" step="0.01" 
                         class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                         placeholder="0,00" />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Sobre você</label>
              <textarea v-model="form.bio" rows="3" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none" 
                        placeholder="Conte um pouco sobre sua experiência..."></textarea>
            </div>
          </div>

          <button :disabled="loading" 
                  class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </span>
            <span v-else>Criar Conta</span>
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
            Já tem uma conta? 
            <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Faça login</router-link>
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
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  is_contractor: false,
  is_provider: false,
  profession: '',
  hourly_rate: null,
  bio: ''
});
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.post('/api/register', form);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    router.push('/projects');
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro no registro';
  } finally {
    loading.value = false;
  }
}
</script>
