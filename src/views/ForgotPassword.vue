<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center py-8">
    <div class="container-responsive">
      <div class="max-w-md mx-auto">
        <div class="card card-elevated">
          <div class="card-body p-8">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">🔓</span>
              </div>
              <h1 class="text-3xl font-bold text-neutral-900 mb-2">Recuperar senha</h1>
              <p class="text-neutral-600">Digite seu email para receber instruções</p>
            </div>

            <!-- Form State -->
            <div v-if="!success">
              <form @submit.prevent="submit" class="space-y-6">
                <div>
                  <label class="label">Email cadastrado</label>
                  <input
                    v-model="email"
                    type="email"
                    class="input input-lg"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <button :disabled="loading" class="btn-primary btn-lg w-full group">
                  <span v-if="loading" class="loading-spinner mr-2"></span>
                  <span>{{ loading ? 'Enviando...' : 'Enviar link de recuperação' }}</span>
                  <span v-if="!loading" class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </button>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>
              </form>
            </div>

            <!-- Success State -->
            <div v-else class="text-center">
              <div class="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">✅</span>
              </div>
              <h2 class="text-2xl font-bold text-neutral-900 mb-4">Email enviado!</h2>
              <p class="text-neutral-600 mb-6">
                Verifique sua caixa de entrada em <strong class="text-neutral-900">{{ email }}</strong>
              </p>
              <router-link to="/login" class="btn-primary btn-lg group">
                <span>Voltar para login</span>
                <span class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </router-link>
            </div>

            <!-- Footer Links -->
            <div class="text-center mt-8 space-y-2">
              <div class="flex items-center justify-center gap-4 text-sm">
                <router-link to="/login" class="text-neutral-600 hover:text-neutral-800">
                  Já tem conta? Faça login
                </router-link>
                <span class="text-neutral-400">•</span>
                <router-link to="/register" class="text-neutral-600 hover:text-neutral-800">
                  Criar conta
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




