<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Novo Projeto</h2>
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Título</label>
        <input v-model="form.title" class="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Descrição</label>
        <textarea v-model="form.description" rows="4" class="w-full border rounded px-3 py-2" required></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Budget Máximo (R$)</label>
          <input type="number" step="0.01" v-model.number="form.max_budget" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Fim dos Lances</label>
          <input type="datetime-local" v-model="form.bidding_ends_at" class="w-full border rounded px-3 py-2" required />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Deadline do Projeto</label>
          <input type="date" v-model="form.project_deadline" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Skills (separadas por vírgula)</label>
          <input v-model="skillsInput" @blur="applySkills" class="w-full border rounded px-3 py-2" />
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="(s,i) in form.required_skills" :key="i" class="bg-gray-200 text-xs px-2 py-1 rounded">{{ s }}</span>
          </div>
        </div>
      </div>
      <button :disabled="loading" class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">Criar</button>
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </form>
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
