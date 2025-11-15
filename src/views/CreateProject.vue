<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Criar Novo Projeto</h1>
        <p class="text-gray-600">Preencha os detalhes do seu projeto para receber propostas</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
              Título do Projeto *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Ex: Desenvolvimento de site institucional"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="6"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Descreva detalhadamente o que precisa ser feito..."
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">{{ form.description.length }} / 2000 caracteres</p>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.category }"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Desenvolvimento Web">Desenvolvimento Web</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Redação">Redação</option>
              <option value="Mobile">Mobile</option>
              <option value="Consultoria">Consultoria</option>
              <option value="Outros">Outros</option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
          </div>

          <!-- Budget and Deadline -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Budget -->
            <div>
              <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">
                Orçamento (R$) *
              </label>
              <input
                id="budget"
                v-model.number="form.budget"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.budget }"
                placeholder="0,00"
              />
              <p v-if="errors.budget" class="mt-1 text-sm text-red-600">{{ errors.budget }}</p>
            </div>

            <!-- Deadline -->
            <div>
              <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">
                Prazo
              </label>
              <input
                id="deadline"
                v-model="form.deadline"
                type="date"
                :min="minDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.deadline }"
              />
              <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">{{ errors.deadline }}</p>
            </div>
          </div>

          <!-- Skills Required -->
          <div>
            <label for="skills" class="block text-sm font-medium text-gray-700 mb-1">
              Habilidades Necessárias
            </label>
            <div class="flex gap-2 mb-2">
              <input
                v-model="skillInput"
                type="text"
                placeholder="Ex: React, Node.js, Design..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                @keypress.enter.prevent="addSkill"
              />
              <button
                type="button"
                @click="addSkill"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Adicionar
              </button>
            </div>
            <div v-if="form.skills_required.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in form.skills_required"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- Requirements -->
          <div>
            <label for="requirements" class="block text-sm font-medium text-gray-700 mb-1">
              Requisitos Adicionais
            </label>
            <textarea
              id="requirements"
              v-model="form.requirements"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Informe requisitos específicos, critérios de aceitação, etc..."
            ></textarea>
          </div>

          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Prioridade
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                v-for="priority in priorities"
                :key="priority.value"
                type="button"
                @click="form.priority = priority.value"
                :class="[
                  'flex flex-col items-center p-3 border-2 rounded-lg transition-all',
                  form.priority === priority.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <span :class="['text-2xl mb-1', priority.color]">{{ priority.icon }}</span>
                <span class="text-sm font-medium">{{ priority.label }}</span>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="$router.push('/dashboard')"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Criando...' : 'Criar Projeto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import projectService from '@/services/projectService'

const router = useRouter()
const toast = useToast()

const form = reactive({
  title: '',
  description: '',
  category: '',
  budget: '',
  deadline: '',
  requirements: '',
  skills_required: [],
  priority: 3
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  budget: '',
  deadline: '',
  general: ''
})

const skillInput = ref('')
const isSubmitting = ref(false)

const priorities = [
  { value: 1, label: 'Urgente', icon: '🔥', color: 'text-red-500' },
  { value: 2, label: 'Alta', icon: '⚡', color: 'text-orange-500' },
  { value: 3, label: 'Normal', icon: '📌', color: 'text-blue-500' },
  { value: 4, label: 'Baixa', icon: '📋', color: 'text-gray-500' }
]

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const addSkill = () => {
  const skill = skillInput.value.trim()
  if (skill && !form.skills_required.includes(skill)) {
    form.skills_required.push(skill)
    skillInput.value = ''
  }
}

const removeSkill = (index) => {
  form.skills_required.splice(index, 1)
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate title
  if (!form.title.trim()) {
    errors.title = 'Título é obrigatório'
    isValid = false
  } else if (form.title.length < 10) {
    errors.title = 'Título deve ter pelo menos 10 caracteres'
    isValid = false
  }

  // Validate description
  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória'
    isValid = false
  } else if (form.description.length < 50) {
    errors.description = 'Descrição deve ter pelo menos 50 caracteres'
    isValid = false
  }

  // Validate category
  if (!form.category) {
    errors.category = 'Categoria é obrigatória'
    isValid = false
  }

  // Validate budget
  if (!form.budget || form.budget <= 0) {
    errors.budget = 'Orçamento deve ser maior que zero'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      budget: parseFloat(form.budget),
      deadline: form.deadline || null,
      requirements: form.requirements.trim() || null,
      skills_required: form.skills_required,
      priority: form.priority
    }

    const result = await projectService.createProject(projectData)

    if (result.success) {
      toast.success('Projeto criado com sucesso!')
      router.push(`/projects/${result.data.project.id}`)
    } else {
      errors.general = result.error
    }
  } catch (error) {
    errors.general = 'Erro ao criar projeto. Tente novamente.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
