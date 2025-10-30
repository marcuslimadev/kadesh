<template>
  <div class="min-vh-100 bg-light d-flex align-items-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-7">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle rounded-circle mb-3" style="width:56px;height:56px;">
                  <i class="bi bi-person-plus fs-4 text-primary"></i>
                </div>
                <h2 class="h3 fw-semibold mb-1">Criar conta</h2>
                <p class="text-muted mb-0">Junte-se ao marketplace de serviços</p>
              </div>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label class="form-label">Nome completo</label>
                  <input v-model="form.name" type="text" class="form-control form-control-lg" placeholder="Seu nome completo" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="form.email" type="email" class="form-control form-control-lg" placeholder="seu@email.com" required />
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Senha</label>
                    <input v-model="form.password" type="password" class="form-control form-control-lg" placeholder="••••••••" required />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Confirmar</label>
                    <input v-model="form.password_confirmation" type="password" class="form-control form-control-lg" placeholder="••••••••" required />
                  </div>
                </div>

                <div class="bg-light rounded p-3 mt-3">
                  <div class="form-label fw-semibold mb-2">Você é:</div>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" v-model="form.is_contractor" id="chkContractor">
                        <label class="form-check-label" for="chkContractor">Contratante</label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" v-model="form.is_provider" id="chkProvider">
                        <label class="form-check-label" for="chkProvider">Fornecedor</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="form.is_provider" class="rounded p-3 mt-3 border">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Profissão</label>
                      <input v-model="form.profession" class="form-control" placeholder="Ex: Eletricista" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Taxa/Hora (R$)</label>
                      <input v-model.number="form.hourly_rate" type="number" step="0.01" class="form-control" placeholder="0,00" />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Sobre você</label>
                      <textarea v-model="form.bio" rows="3" class="form-control" placeholder="Conte um pouco sobre sua experiência..."></textarea>
                    </div>
                  </div>
                </div>

                <button :disabled="loading" class="btn btn-primary btn-lg w-100 mt-3">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <span>{{ loading ? 'Criando conta...' : 'Criar conta' }}</span>
                </button>

                <div v-if="emailExists" class="alert alert-warning mt-3" role="alert">
                  O email <strong>{{ form.email }}</strong> já possui uma conta.
                  <router-link to="/login" class="ms-1">Fazer login</router-link>
                  <span class="mx-1">•</span>
                  <router-link to="/forgot-password">Esqueci a senha</router-link>
                </div>
                <div v-else-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</div>
              </form>

              <div class="text-center mt-4">
                <span class="text-muted">Já tem uma conta?</span>
                <router-link to="/login" class="ms-1">Faça login</router-link>
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




