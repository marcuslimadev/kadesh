<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center py-8">
    <div class="container-responsive">
      <div class="max-w-md mx-auto">
        <div class="card card-elevated">
          <div class="card-body p-8">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">🔐</span>
              </div>
              <h1 class="text-3xl font-bold text-neutral-900 mb-2">Bem-vindo de volta</h1>
              <p class="text-neutral-600">Acesse sua conta no Kadesh</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-6">
              <div>
                <label class="label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="input input-lg"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label class="label">Senha</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="input input-lg"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button :disabled="loading" class="btn-primary btn-lg w-full group">
                <span v-if="loading" class="loading-spinner mr-2"></span>
                <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
                <span v-if="!loading" class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger">
                <span class="text-sm">{{ error }}</span>
                <router-link to="/forgot-password" class="text-sm underline hover:no-underline ml-2">
                  Esqueceu a senha?
                </router-link>
              </div>
            </form>

            <!-- Links -->
            <div class="text-center mt-8 space-y-2">
              <div>
                <span class="text-neutral-600">Não tem uma conta?</span>
                <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-semibold ml-1">
                  Registre-se gratuitamente
                </router-link>
              </div>
              <div>
                <router-link to="/forgot-password" class="text-neutral-500 hover:text-neutral-700 text-sm">
                  Esqueceu sua senha?
                </router-link>
              </div>
            </div>
          </div>
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

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const response = await api.post('/api/login', {
      email: form.email,
      password: form.password
    });
    
    console.log(' Login response:', response.data);
    console.log('🔍 user_type recebido:', response.data.user_type, typeof response.data.user_type);
    console.log('🔍 response.data completo:', JSON.stringify(response.data, null, 2));
    console.log('🔍 É admin?', response.data.user_type === 'admin');
    console.log('🔍 Comparação:', {
      recebido: response.data.user_type,
      esperado: 'admin',
      iguais: response.data.user_type === 'admin',
      tipoRecebido: typeof response.data.user_type
    });
    
    //  Detectar tipo de usuário e redirecionar
    if (response.data.user_type === 'admin') {
      console.log(' ENTRANDO NA ROTA DE ADMIN');
      // Admin detectado automaticamente
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('adminName', response.data.admin?.name || 'Admin');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminName', response.data.admin?.name || 'Admin');
      
      // Emite evento ANTES de redirecionar
      emit('auth-change');
      
      // Pequeno delay para garantir que o evento foi processado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/admin/dashboard');
    } else {
      console.log(' ENTRANDO NA ROTA DE USUÁRIO COMUM');
      // Usuário comum
      sessionStorage.removeItem('isAdmin');
      localStorage.removeItem('isAdmin');
      
      // Persistir informações mínimas para o header
      try {
        const userName = response.data.user?.name || response.data.name || form.email.split('@')[0];
        const userType = response.data.user?.user_type || response.data.user_type || '';
        
        console.log('💾 Salvando no storage:', { userName, userType });
        
        // Session
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', userName);
        if (userType) sessionStorage.setItem('userType', userType);
        
        // Local (persistência)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', userName);
        if (userType) localStorage.setItem('userType', userType);
      } catch (err) {
        console.error(' Erro ao salvar no storage:', err);
      }
      
      // Emite evento ANTES de redirecionar
      emit('auth-change');
      
      // Pequeno delay para garantir que o evento foi processado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/projects');
    }
  } catch (e) {
    console.error(' Erro no login:', e);
    error.value = e.response?.data?.message || 'Falha no login';
  } finally {
    loading.value = false;
  }
}
</script>




