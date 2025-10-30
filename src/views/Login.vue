<template>
  <div class="min-vh-100 bg-light d-flex align-items-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle rounded-circle mb-3" style="width:56px;height:56px;">
                  <i class="bi bi-person fs-4 text-primary"></i>
                </div>
                <h2 class="h3 fw-semibold mb-1">Bem-vindo de volta</h2>
                <p class="text-muted mb-0">Acesse sua conta no Kadesh</p>
              </div>

              <form @submit.prevent="submit" class="">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control form-control-lg" placeholder="seu@email.com" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Senha</label>
                  <input v-model="form.password" type="password" class="form-control form-control-lg" placeholder="••••••••" required />
                </div>

                <button :disabled="loading" class="btn btn-primary btn-lg w-100">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
                </button>

                <div v-if="error" class="alert alert-danger mt-3" role="alert">
                  {{ error }}
                  <router-link to="/forgot-password" class="ms-2 small">Esqueceu a senha?</router-link>
                </div>
              </form>

              <div class="text-center mt-4">
                <span class="text-muted">Não tem uma conta?</span>
                <router-link to="/register" class="ms-1">Registre-se gratuitamente</router-link>
              </div>
              <div class="text-center mt-2">
                <router-link to="/forgot-password" class="small">Esqueceu sua senha?</router-link>
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




