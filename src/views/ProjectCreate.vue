<template>
  <div class="min-h-screen bg-neutral-50 py-8">
    <div class="container-responsive">
      <div class="max-w-2xl mx-auto">
        <div class="card card-elevated">
          <div class="card-body p-8">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">🚀</span>
              </div>
              <h1 class="text-3xl font-bold text-neutral-900 mb-2">Criar novo projeto</h1>
              <p class="text-neutral-600">Publique seu projeto e receba propostas de fornecedores qualificados</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="submit" class="space-y-6">
              <div>
                <label class="label">Título do projeto</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="input input-lg"
                  placeholder="Ex: Reforma completa da cozinha"
                  required
                />
              </div>

              <div>
                <label class="label">Descrição detalhada</label>
                <textarea
                  v-model="form.description"
                  rows="6"
                  class="textarea resize-none"
                  placeholder="Descreva detalhadamente o que precisa ser feito, incluindo especificações técnicas, materiais preferidos, etc."
                  required
                ></textarea>
              </div>

              <div class="grid grid-responsive-cols-2 gap-6">
                <div>
                  <label class="label">Orçamento máximo (R$)</label>
                  <input
                    v-model.number="form.max_budget"
                    type="number"
                    step="0.01"
                    class="input input-lg"
                    placeholder="Ex: 5000.00"
                    required
                  />
                </div>
                <div>
                  <label class="label">Fim dos lances</label>
                  <input
                    v-model="form.bidding_ends_at"
                    type="datetime-local"
                    class="input input-lg"
                    required
                  />
                </div>
              </div>

              <div class="grid grid-responsive-cols-2 gap-6">
                <div>
                  <label class="label">Prazo de entrega</label>
                  <input
                    v-model="form.project_deadline"
                    type="date"
                    class="input input-lg"
                  />
                </div>
                <div>
                  <label class="label">Habilidades necessárias</label>
                  <input
                    v-model="skillsInput"
                    @blur="applySkills"
                    type="text"
                    class="input input-lg"
                    placeholder="Ex: elétrica, hidráulica, pintura"
                  />
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span
                      v-for="(skill, i) in form.required_skills"
                      :key="i"
                      class="badge badge-primary"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">⚠️</span>
                  <p class="font-semibold">{{ error }}</p>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                :disabled="loading"
                type="submit"
                class="btn-primary btn-lg w-full group"
              >
                <span v-if="loading" class="flex items-center justify-center gap-3">
                  <span class="loading-spinner w-6 h-6"></span>
                  Criando projeto...
                </span>
                <span v-else class="flex items-center justify-center gap-3">
                  🚀 <span>Criar projeto</span>
                </span>
              </button>
            </form>
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
const form = reactive({
  title: '',
  description: '',
  max_budget: null,
  bidding_ends_at: '',
  project_deadline: '',
  required_skills: [],
});
const skillsInput = ref('');
const loading = ref(false);
const error = ref('');

function applySkills() {
  if (!skillsInput.value) return;
  form.required_skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
}

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await api.post('/api/projects', form);
    router.push('/projects');
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao criar projeto';
  } finally {
    loading.value = false;
  }
}
</script>




