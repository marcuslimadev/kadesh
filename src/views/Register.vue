<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8">
    <div class="container-responsive">
      <div class="max-w-2xl mx-auto">
        <div class="card card-elevated">
          <div class="card-body p-8">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">👋</span>
              </div>
              <h1 class="text-3xl font-bold text-neutral-900 mb-2">Criar conta</h1>
              <p class="text-neutral-600">Junte-se ao marketplace de serviços</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-responsive-cols-2 gap-6">
                <div>
                  <label class="label">Nome completo</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="input input-lg"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
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
              </div>

              <!-- Password -->
              <div class="grid grid-responsive-cols-2 gap-6">
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
                <div>
                  <label class="label">Confirmar senha</label>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    class="input input-lg"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <!-- User Type Selection -->
              <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-6">
                <div class="mb-4">
                  <label class="label">Você é:</label>
                </div>
                <div class="grid grid-responsive-cols-2 gap-4">
                  <label class="flex items-center space-x-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
                    <input
                      class="checkbox"
                      type="checkbox"
                      v-model="form.is_contractor"
                    />
                    <div>
                      <div class="font-semibold text-neutral-900">🏢 Contratante</div>
                      <div class="text-sm text-neutral-600">Preciso contratar serviços</div>
                    </div>
                  </label>
                  <label class="flex items-center space-x-3 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
                    <input
                      class="checkbox"
                      type="checkbox"
                      v-model="form.is_provider"
                    />
                    <div>
                      <div class="font-semibold text-neutral-900">🔧 Fornecedor</div>
                      <div class="text-sm text-neutral-600">Ofereço serviços profissionais</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Provider Details -->
              <div v-if="form.is_provider" class="border border-primary-200 rounded-lg p-6 bg-primary-50/50">
                <h3 class="text-lg font-semibold text-neutral-900 mb-4">Informações do Profissional</h3>
                <div class="grid grid-responsive-cols-2 gap-6 mb-6">
                  <div>
                    <label class="label">Profissão</label>
                    <input
                      v-model="form.profession"
                      type="text"
                      class="input"
                      placeholder="Ex: Eletricista, Pintor..."
                    />
                  </div>
                  <div>
                    <label class="label">Taxa por hora (R$)</label>
                    <input
                      v-model.number="form.hourly_rate"
                      type="number"
                      step="0.01"
                      class="input"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                  <label class="label">Sobre você</label>
                  <textarea
                    v-model="form.bio"
                    rows="4"
                    class="textarea"
                    placeholder="Conte um pouco sobre sua experiência, especialidades e o que diferencia seus serviços..."
                  ></textarea>
                </div>
              </div>

              <!-- Submit Button -->
              <button :disabled="loading" class="btn-primary btn-lg w-full group">
                <span v-if="loading" class="loading-spinner mr-2"></span>
                <span>{{ loading ? 'Criando conta...' : 'Criar conta' }}</span>
                <span v-if="!loading" class="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </button>

              <!-- Alerts -->
              <div v-if="emailExists" class="alert alert-warning">
                <div class="flex items-center justify-between">
                  <span>O email <strong>{{ form.email }}</strong> já possui uma conta.</span>
                  <div class="flex gap-2">
                    <router-link to="/login" class="text-sm underline hover:no-underline">
                      Fazer login
                    </router-link>
                    <span class="text-neutral-400">•</span>
                    <router-link to="/forgot-password" class="text-sm underline hover:no-underline">
                      Esqueci a senha
                    </router-link>
                  </div>
                </div>
              </div>
              <div v-else-if="error" class="alert alert-danger">
                {{ error }}
              </div>
            </form>

            <!-- Footer Links -->
            <div class="text-center mt-8">
              <span class="text-neutral-600">Já tem uma conta?</span>
              <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-semibold ml-1">
                Faça login
              </router-link>
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




