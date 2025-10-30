<template>
  <div class="min-vh-100 bg-light d-flex align-items-center py-4">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-sm border-0">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center bg-warning-subtle rounded-circle mb-3" style="width:56px;height:56px;">
                  <i class="bi bi-unlock fs-4 text-warning"></i>
                </div>
                <h2 class="h3 fw-semibold mb-1">Recuperar senha</h2>
                <p class="text-muted mb-0">Digite seu email para receber instruções</p>
              </div>

              <div v-if="!success">
                <form @submit.prevent="submit">
                  <div class="mb-3">
                    <label class="form-label">Email cadastrado</label>
                    <input v-model="email" type="email" class="form-control form-control-lg" placeholder="seu@email.com" required />
                  </div>
                  <button :disabled="loading" class="btn btn-primary btn-lg w-100">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <span>{{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}</span>
                  </button>
                  <div v-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</div>
                </form>
              </div>

              <div v-else class="text-center py-2">
                <div class="d-inline-flex align-items-center justify-content-center bg-success-subtle rounded-circle mb-3" style="width:64px;height:64px;">
                  <i class="bi bi-check2 fs-3 text-success"></i>
                </div>
                <h3 class="h4 fw-semibold mb-2">Email enviado!</h3>
                <p class="text-muted mb-4">Verifique sua caixa de entrada em <strong>{{ email }}</strong></p>
                <router-link to="/login" class="btn btn-primary">Voltar para login</router-link>
              </div>

              <div class="text-center mt-4">
                <router-link to="/login" class="small me-2">Já tem conta? Faça login</router-link>
                <span class="text-muted small">•</span>
                <router-link to="/register" class="small ms-2">Criar conta</router-link>
              </div>
            </div>
          </div>
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




