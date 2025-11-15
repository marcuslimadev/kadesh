<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Criar Novo Projeto</h1>
        <p class="text-gray-600">Preencha os detalhes do seu projeto para começar a receber propostas</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-8">
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
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Ex: Desenvolvimento de aplicativo mobile"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
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
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.category }"
            >
              <option value="">Selecione uma categoria</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
            <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
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
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Descreva detalhadamente o que você precisa..."
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">{{ form.description.length }} / 2000 caracteres</p>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>

          <!-- Budget and Deadline Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Budget -->
            <div>
              <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">
                Orçamento (R$) *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">R$</span>
                <input
                  id="budget"
                  v-model.number="form.budget"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  :disabled="isLoading"
                  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  :class="{ 'border-red-500': errors.budget }"
                  placeholder="0.00"
                />
              </div>
              <p v-if="errors.budget" class="mt-1 text-sm text-red-600">{{ errors.budget }}</p>
            </div>

            <!-- Deadline -->
            <div>
              <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">
                Prazo de Entrega *
              </label>
              <input
                id="deadline"
                v-model="form.deadline"
                type="date"
                required
                :disabled="isLoading"
                :min="minDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                :class="{ 'border-red-500': errors.deadline }"
              />
              <p v-if="errors.deadline" class="mt-1 text-sm text-red-600">{{ errors.deadline }}</p>
            </div>
          </div>

          <!-- Requirements (Optional) -->
          <div>
            <label for="requirements" class="block text-sm font-medium text-gray-700 mb-1">
              Requisitos Específicos (Opcional)
            </label>
            <textarea
              id="requirements"
              v-model="form.requirements"
              rows="4"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Liste requisitos técnicos, habilidades necessárias, ferramentas, etc."
            ></textarea>
          </div>

          <!-- Skills Required (Optional) -->
          <div>
            <label for="skills" class="block text-sm font-medium text-gray-700 mb-1">
              Habilidades Necessárias (Opcional)
            </label>
            <input
              id="skills"
              v-model="skillInput"
              type="text"
              :disabled="isLoading"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Digite uma habilidade e pressione Enter"
              @keydown.enter.prevent="addSkill"
            />
            <div v-if="form.skills.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in form.skills"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
          </div>

          <!-- Auction Settings -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Configurações do Leilão</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Auction Duration -->
              <div>
                <label for="auction_duration_hours" class="block text-sm font-medium text-gray-700 mb-1">
                  Duração do Leilão (horas)
                </label>
                <input
                  id="auction_duration_hours"
                  v-model.number="form.auction_duration_hours"
                  type="number"
                  min="1"
                  max="168"
                  :disabled="isLoading"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="48"
                />
                <p class="mt-1 text-sm text-gray-500">Tempo que prestadores têm para enviar propostas (padrão: 48h)</p>
              </div>

              <!-- Min Bids -->
              <div>
                <label for="min_bids" class="block text-sm font-medium text-gray-700 mb-1">
                  Mínimo de Propostas
                </label>
                <input
                  id="min_bids"
                  v-model.number="form.min_bids"
                  type="number"
                  min="1"
                  max="50"
                  :disabled="isLoading"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="3"
                />
                <p class="mt-1 text-sm text-gray-500">Número mínimo de propostas antes de aceitar (padrão: 3)</p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleCancel"
              :disabled="isLoading"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="!isLoading">Criar Projeto</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
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
import { useProjectsStore } from '@/stores/projects'
import { useAuthStore } from '@/stores/auth'
import projectService from '@/services/projectService'
import { useToast } from 'vue-toastification'

const router = useRouter()
const projectsStore = useProjectsStore()
const authStore = useAuthStore()
const toast = useToast()

const categories = projectService.getCategories()

const form = reactive({
  title: '',
  category: '',
  description: '',
  budget: null,
  deadline: '',
  requirements: '',
  skills: [],
  auction_duration_hours: 48,
  min_bids: 3
})

const errors = reactive({
  title: '',
  category: '',
  description: '',
  budget: '',
  deadline: '',
  general: ''
})

const isLoading = ref(false)
const skillInput = ref('')

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.title || form.title.trim().length < 10) {
    errors.title = 'Título deve ter pelo menos 10 caracteres'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'Selecione uma categoria'
    isValid = false
  }

  if (!form.description || form.description.trim().length < 50) {
    errors.description = 'Descrição deve ter pelo menos 50 caracteres'
    isValid = false
  }

  if (form.description.length > 2000) {
    errors.description = 'Descrição não pode ter mais de 2000 caracteres'
    isValid = false
  }

  if (!form.budget || form.budget <= 0) {
    errors.budget = 'Orçamento deve ser maior que zero'
    isValid = false
  }

  if (!form.deadline) {
    errors.deadline = 'Selecione uma data de entrega'
    isValid = false
  } else {
    const deadlineDate = new Date(form.deadline)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    if (deadlineDate < tomorrow) {
      errors.deadline = 'Data de entrega deve ser no mínimo amanhã'
      isValid = false
    }
  }

  return isValid
}

const addSkill = () => {
  const skill = skillInput.value.trim()
  
  if (skill && !form.skills.includes(skill)) {
    form.skills.push(skill)
    skillInput.value = ''
  }
}

const removeSkill = (index) => {
  form.skills.splice(index, 1)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa fazer login para criar um projeto')
    router.push('/login')
    return
  }

  // Check if user is a client
  if (!authStore.isClient) {
    toast.error('Apenas clientes podem criar projetos')
    return
  }

  isLoading.value = true

  try {
    const projectData = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      budget: parseFloat(form.budget),
      deadline: form.deadline,
      requirements: form.requirements.trim() || null,
      skills: form.skills.length > 0 ? form.skills.join(',') : null,
      auction_duration_hours: form.auction_duration_hours || 48,
      min_bids: form.min_bids || 3
    }

    const result = await projectsStore.createProject(projectData)

    if (result.success) {
      toast.success('Projeto criado com sucesso!')
      router.push(`/projects/${result.project.id}`)
    } else {
      errors.general = result.error
    }
  } catch (error) {
    console.error('Create project error:', error)
    errors.general = 'Erro ao criar projeto. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  router.push('/projects')
}
</script>
