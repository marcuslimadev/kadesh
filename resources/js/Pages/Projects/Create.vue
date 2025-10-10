<template>
  <Layout>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 class="text-3xl font-bold text-white">✨ Criar Novo Projeto</h1>
            <p class="text-indigo-100 mt-2">
              Publique seu projeto em {{ 4 - currentStep }} passos e receba propostas incríveis!
            </p>
          </div>

          <!-- Barra de Progresso -->
          <div class="bg-white px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-6">
                <!-- Passo 1 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 1">✓</span>
                    <span v-else>1</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Informações</p>
                    <p class="text-xs text-gray-500">Básicas</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 2 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 2 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 2">✓</span>
                    <span v-else>2</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Descrição</p>
                    <p class="text-xs text-gray-500">Detalhada</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 3 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 3 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 3 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 3">✓</span>
                    <span v-else>3</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Orçamento</p>
                    <p class="text-xs text-gray-500">& Prazo</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 4 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 4 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 4 ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 4">✓</span>
                    <span v-else>4</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Publicar</p>
                    <p class="text-xs text-gray-500">Revisar</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ currentStep }}/4</p>
                <p class="text-xs text-gray-500">{{ Math.round((currentStep/4) * 100) }}% completo</p>
              </div>
            </div>
          </div>

          <ValidationErrors :errors="errors" title="⚠️ Corrija os erros antes de continuar:" />

          <form @submit.prevent="handleSubmit">
            <div class="space-y-8">
              <!-- Informações Básicas -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Informações Básicas
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                      Título do Projeto *
                    </label>
                    <input
                      id="title"
                      type="text"
                      v-model="form.title"
                      required
                      maxlength="255"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Ex: Desenvolvimento de E-commerce em Laravel"
                    />
                    <div v-if="errors.title" class="mt-2 text-sm text-red-600">
                      {{ errors.title }}
                    </div>
                  </div>

                  <div>
                    <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      id="category"
                      v-model="form.category"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="development">Desenvolvimento</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="writing">Redação</option>
                      <option value="other">Outros</option>
                    </select>
                    <div v-if="errors.category" class="mt-2 text-sm text-red-600">
                      {{ errors.category }}
                    </div>
                  </div>

                  <div>
                    <label for="max_budget" class="block text-sm font-medium text-gray-700 mb-2">
                      Orçamento Máximo (R$) *
                    </label>
                    <input
                      id="max_budget"
                      type="number"
                      v-model="form.max_budget"
                      required
                      min="1"
                      step="0.01"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="5000.00"
                    />
                    <div v-if="errors.max_budget" class="mt-2 text-sm text-red-600">
                      {{ errors.max_budget }}
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                    Descrição do Projeto *
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    required
                    rows="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Descreva detalhadamente seu projeto, objetivos, requisitos técnicos e expectativas..."
                  ></textarea>
                  <div v-if="errors.description" class="mt-2 text-sm text-red-600">
                    {{ errors.description }}
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Seja específico sobre seus requisitos para receber propostas mais precisas.
                  </p>
                </div>
              </div>

              <!-- Prazos -->
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Prazos
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="bidding_ends_at" class="block text-sm font-medium text-gray-700 mb-2">
                      Fim das Propostas *
                    </label>
                    <input
                      id="bidding_ends_at"
                      type="datetime-local"
                      v-model="form.bidding_ends_at"
                      required
                      :min="tomorrow"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    <div v-if="errors.bidding_ends_at" class="mt-2 text-sm text-red-600">
                      {{ errors.bidding_ends_at }}
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      Data limite para recebimento de propostas
                    </p>
                  </div>

                  <div>
                    <label for="project_deadline" class="block text-sm font-medium text-gray-700 mb-2">
                      Prazo de Entrega
                    </label>
                    <input
                      id="project_deadline"
                      type="date"
                      v-model="form.project_deadline"
                      :min="minProjectDeadline"
                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    <div v-if="errors.project_deadline" class="mt-2 text-sm text-red-600">
                      {{ errors.project_deadline }}
                    </div>
                    <p class="mt-2 text-sm text-gray-500">
                      Data desejada para conclusão do projeto (opcional)
                    </p>
                  </div>
                </div>
              </div>

              <!-- Habilidades Requeridas -->
              <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg class="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  Habilidades Requeridas
                </h2>

                <div>
                  <label for="skills_input" class="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Habilidades
                  </label>
                  <input
                    id="skills_input"
                    type="text"
                    v-model="skillInput"
                    @keypress.enter.prevent="addSkill"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Ex: Laravel, Vue.js, MySQL - Pressione Enter para adicionar"
                  />
                  <button
                    type="button"
                    @click="addSkill"
                    class="mt-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Adicionar Habilidade
                  </button>
                </div>

                <div v-if="form.required_skills.length > 0" class="mt-4">
                  <p class="text-sm font-medium text-gray-700 mb-3">Habilidades Selecionadas:</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(skill, index) in form.required_skills"
                      :key="index"
                      class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      {{ skill }}
                      <button
                        type="button"
                        @click="removeSkill(index)"
                        class="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Botões de Ação -->
              <div class="flex flex-col sm:flex-row sm:justify-end gap-4 pt-6 border-t border-gray-200">
                <Link href="/projects" 
                      class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors text-center">
                  Cancelar
                </Link>
                <button
                  type="submit"
                  :disabled="processing"
                  :class="[
                    'px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center',
                    processing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                  ]"
                >
                  <svg v-if="processing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="processing">Publicando...</span>
                  <span v-else>Publicar Projeto</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import Layout from '../../Components/Layout.vue'
import ValidationErrors from '../../Components/ValidationErrors.vue'
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  }
})

const processing = ref(false)
const skillInput = ref('')

const form = reactive({
  title: '',
  category: '',
  description: '',
  max_budget: '',
  bidding_ends_at: '',
  project_deadline: '',
  required_skills: []
})

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 16)
})

const minProjectDeadline = computed(() => {
  if (form.bidding_ends_at) {
    const date = new Date(form.bidding_ends_at)
    date.setDate(date.getDate() + 1)
    return date.toISOString().slice(0, 10)
  }
  return tomorrow.value.slice(0, 10)
})

const addSkill = () => {
  const skill = skillInput.value.trim()
  if (skill && !form.required_skills.includes(skill)) {
    form.required_skills.push(skill)
    skillInput.value = ''
  }
}

const removeSkill = (index) => {
  form.required_skills.splice(index, 1)
}

const handleSubmit = () => {
  if (processing.value) {
    return // Evita múltiplas submissões
  }

  // Validação básica no frontend
  if (!form.title || !form.description || !form.category || !form.max_budget || !form.bidding_ends_at) {
    alert('Por favor, preencha todos os campos obrigatórios.')
    return
  }

  if (form.description.length < 50) {
    alert('A descrição deve ter pelo menos 50 caracteres.')
    return
  }

  if (form.max_budget < 100) {
    alert('O orçamento mínimo é R$ 100,00.')
    return
  }
  
  processing.value = true
  
  router.post('/projects', form, {
    onFinish: () => {
      processing.value = false
    },
    onError: () => {
      processing.value = false
      // Manter os dados do formulário em caso de erro
    }
  })
}
</script>