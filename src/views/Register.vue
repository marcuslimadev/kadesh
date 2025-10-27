<template>
  <div class="min-h-screen bg-neutral-900 flex items-center justify-center p-3 sm:p-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-neutral-300">
        <div class="text-center mb-6 sm:mb-8">
          <div class="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transform hover:rotate-12 transition-transform">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold bg-neutral-900 bg-clip-text text-transparent">
            ✨ Criar Conta
          </h2>
          <p class="text-gray-600 mt-2 text-sm sm:text-base font-medium">Junte-se ao melhor marketplace de projetos</p>
        </div>

        <form @submit.prevent="submit" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">👤 Nome Completo</label>
            <input v-model="form.name" type="text" 
                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-neutral-300 transition-all duration-200 font-medium" 
                   placeholder="Seu nome completo" required />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">📧 Email</label>
            <input v-model="form.email" type="email" 
                   class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-neutral-300 transition-all duration-200 font-medium" 
                   placeholder="seu@email.com" required />
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">🔒 Senha</label>
              <input v-model="form.password" type="password" 
                     class="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-neutral-300 transition-all duration-200 font-medium text-sm sm:text-base" 
                     placeholder="••••••••" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">✅ Confirmar</label>
              <input v-model="form.password_confirmation" type="password" 
                     class="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-neutral-300 transition-all duration-200 font-medium text-sm sm:text-base" 
                     placeholder="••••••••" required />
            </div>
          </div>

          <div class="bg-neutral-900 rounded-xl p-4 border-2 border-neutral-300">
            <p class="text-sm font-bold text-gray-700 mb-3">🎯 Você é:</p>
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" v-model="form.is_contractor" 
                       class="w-5 h-5 text-neutral-900 bg-white border-2 border-gray-300 rounded focus:ring-indigo-500" />
                <div class="flex-1">
                  <div class="text-sm font-bold text-gray-900 group-hover:text-neutral-900 transition-colors">👔 Contratante</div>
                  <div class="text-xs text-gray-600 font-medium">Publico projetos e contrato fornecedores</div>
                </div>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" v-model="form.is_provider" 
                       class="w-5 h-5 text-neutral-900 bg-white border-2 border-gray-300 rounded focus:ring-purple-500" />
                <div class="flex-1">
                  <div class="text-sm font-bold text-gray-900 group-hover:text-neutral-900 transition-colors">⚡ Fornecedor</div>
                  <div class="text-xs text-gray-600 font-medium">Participo de leilões e executo projetos</div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="form.is_provider" class="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl p-4 border-2 border-neutral-300 space-y-4">
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">💼 Profissão</label>
                <input v-model="form.profession" 
                       class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-neutral-300 text-sm font-medium" 
                       placeholder="Ex: Designer" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">💵 Taxa/Hora</label>
                <div class="relative">
                  <span class="absolute left-3 top-2 text-gray-600 text-sm font-bold">R$</span>
                  <input v-model.number="form.hourly_rate" type="number" step="0.01" 
                         class="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-neutral-300 text-sm font-medium" 
                         placeholder="0,00" />
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📝 Sobre você</label>
              <textarea v-model="form.bio" rows="3" 
                        class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-neutral-300 text-sm resize-none font-medium" 
                        placeholder="Conte um pouco sobre sua experiência..."></textarea>
            </div>
          </div>

          <button :disabled="loading" 
                  class="w-full bg-neutral-900 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </span>
            <span v-else>🚀 Criar Conta</span>
          </button>

          <!-- Erro quando email já existe -->
          <div v-if="emailExists" class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-neutral-300 rounded-xl p-4 space-y-3">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div class="flex-1">
                <p class="text-amber-900 font-bold text-sm mb-2">⚠️ Email já cadastrado!</p>
                <p class="text-amber-800 text-xs sm:text-sm font-medium mb-3">
                  O email <span class="font-bold">{{ form.email }}</span> já possui uma conta.
                </p>
                <div class="flex flex-col sm:flex-row gap-2">
                  <router-link to="/login" 
                               class="flex-1 bg-neutral-900 hover:from-indigo-700 hover:to-purple-700 text-white text-center px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                    🔐 Fazer Login
                  </router-link>
                  <router-link to="/forgot-password" 
                               class="flex-1 bg-white hover:bg-gray-50 text-amber-700 border-2 border-neutral-300 text-center px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md transform hover:scale-105">
                    🔑 Esqueci a Senha
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Outros erros -->
          <div v-else-if="error" class="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-neutral-300 rounded-xl p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-800 text-sm font-bold">{{ error }}</p>
            </div>
          </div>
        </form>

        <div class="mt-6 sm:mt-8 text-center">
          <p class="text-gray-600 text-sm font-medium">
            Já tem uma conta? 
            <router-link to="/login" class="font-bold text-transparent bg-clip-text bg-neutral-900 hover:from-indigo-700 hover:to-purple-700 transition-all">
              Faça login 👉
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
const emailExists = ref(false);

async function submit() {
  loading.value = true;
  error.value = '';
  emailExists.value = false;
  
  try {
    // Determinar type baseado nas checkboxes
    let type = 'contractor'; // padrão
    if (form.is_provider && !form.is_contractor) {
      type = 'provider';
    } else if (form.is_contractor && form.is_provider) {
      type = 'both';
    }
    
    // Preparar payload para o backend
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      type: type, // Backend espera 'type', não 'role'
      bio: form.bio || null
    };
    
    await api.post('/api/register', payload);
    // Emite evento para atualizar usuário no App.vue
    emit('auth-change');
    // Sessão criada pelo backend automaticamente
    router.push('/projects');
  } catch (e) {
    // Verificar se é erro de email duplicado
    const errorMsg = e.response?.data?.message || '';
    const emailError = e.response?.data?.errors?.email?.[0] || '';
    
    if (emailError.includes('already exists') || emailError.includes('já existe')) {
      emailExists.value = true;
      error.value = 'Este email já está cadastrado';
    } else {
      error.value = errorMsg || 'Erro no registro';
    }
  } finally {
    loading.value = false;
  }
}
</script>


