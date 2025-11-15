<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Carregando projeto...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Erro ao carregar projeto</h3>
        <p class="mt-2 text-sm text-gray-600">{{ error }}</p>
        <div class="mt-6">
          <router-link
            to="/projects"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Voltar para Projetos
          </router-link>
        </div>
      </div>

      <!-- Project Content -->
      <div v-else-if="project" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Project Header -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ project.title }}</h1>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ getCategoryLabel(project.category) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatDate(project.created_at) }}
                  </span>
                </div>
              </div>
              <StatusBadge :status="project.status" />
            </div>

            <!-- Budget and Deadline -->
            <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <p class="text-sm text-gray-600 mb-1">Orçamento</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(project.budget) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Prazo de Entrega</p>
                <p class="text-lg font-semibold text-gray-900">{{ formatDeadline(project.deadline) }}</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
              <p class="text-gray-700 whitespace-pre-line">{{ project.description }}</p>
            </div>

            <!-- Requirements -->
            <div v-if="project.requirements" class="mt-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Requisitos</h2>
              <p class="text-gray-700 whitespace-pre-line">{{ project.requirements }}</p>
            </div>

            <!-- Skills -->
            <div v-if="project.skills" class="mt-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Habilidades Necessárias</h2>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in skillsArray"
                  :key="skill"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bids Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900">
                Propostas ({{ project.bid_count || 0 }})
              </h2>
              <button
                v-if="authStore.isProvider && project.status === 'open'"
                @click="showBidForm = !showBidForm"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                {{ showBidForm ? 'Cancelar' : 'Enviar Proposta' }}
              </button>
            </div>

            <!-- Bid Form -->
            <div v-if="showBidForm && authStore.isProvider" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-4">Nova Proposta</h3>
              <form @submit.prevent="submitBid" class="space-y-4">
                <div>
                  <label for="bidAmount" class="block text-sm font-medium text-gray-700 mb-1">
                    Valor da Proposta (R$) *
                  </label>
                  <input
                    id="bidAmount"
                    v-model.number="bidForm.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label for="bidDescription" class="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da Proposta *
                  </label>
                  <textarea
                    id="bidDescription"
                    v-model="bidForm.description"
                    rows="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Descreva como você pretende realizar o projeto..."
                  ></textarea>
                </div>
                <div>
                  <label for="bidDeliveryTime" class="block text-sm font-medium text-gray-700 mb-1">
                    Tempo de Entrega (dias) *
                  </label>
                  <input
                    id="bidDeliveryTime"
                    v-model.number="bidForm.delivery_time_days"
                    type="number"
                    min="1"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="7"
                  />
                </div>
                <button
                  type="submit"
                  :disabled="isBidSubmitting"
                  class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                >
                  {{ isBidSubmitting ? 'Enviando...' : 'Enviar Proposta' }}
                </button>
              </form>
            </div>

            <!-- Bids List Placeholder -->
            <div class="text-center py-8 text-gray-500">
              <p>Sistema de propostas será implementado na Fase 1 - Semana 2</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Client Info -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Cliente</h3>
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-semibold mr-3">
                {{ getInitials(project.client_name) }}
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ project.client_name }}</p>
                <p class="text-sm text-gray-500">Cliente</p>
              </div>
            </div>
          </div>

          <!-- Project Stats -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Propostas</span>
                <span class="text-sm font-medium text-gray-900">{{ project.bid_count || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Orçamento Médio</span>
                <span class="text-sm font-medium text-gray-900">{{ formatCurrency(project.budget) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Status</span>
                <StatusBadge :status="project.status" />
              </div>
            </div>
          </div>

          <!-- Actions (for project owner) -->
          <div v-if="authStore.user?.id === project.client_id" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
            <div class="space-y-3">
              <button
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Editar Projeto
              </button>
              <button
                v-if="project.status === 'open'"
                class="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
              >
                Cancelar Projeto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import projectService from '@/services/projectService'
import { useToast } from 'vue-toastification'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const toast = useToast()

const project = ref(null)
const isLoading = ref(false)
const error = ref(null)
const showBidForm = ref(false)
const isBidSubmitting = ref(false)

const bidForm = ref({
  amount: null,
  description: '',
  delivery_time_days: null
})

const skillsArray = computed(() => {
  if (!project.value?.skills) return []
  return project.value.skills.split(',').map(s => s.trim()).filter(Boolean)
})

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ptBR 
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const formatDeadline = (date) => {
  if (!date) return 'Não especificado'
  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    return 'Data inválida'
  }
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getCategoryLabel = (value) => {
  const categories = projectService.getCategories()
  const cat = categories.find(c => c.value === value)
  return cat ? cat.label : value
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const loadProject = async () => {
  isLoading.value = true
  error.value = null

  try {
    const projectId = route.params.id
    const result = await projectService.getProject(projectId)

    if (result.success) {
      project.value = result.data.project
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error loading project:', err)
    error.value = 'Erro ao carregar projeto'
  } finally {
    isLoading.value = false
  }
}

const submitBid = async () => {
  if (!authStore.isAuthenticated) {
    toast.error('Você precisa fazer login para enviar uma proposta')
    router.push('/login')
    return
  }

  if (!authStore.isProvider) {
    toast.error('Apenas prestadores podem enviar propostas')
    return
  }

  isBidSubmitting.value = true

  try {
    // TODO: Implement bid submission with backend
    toast.success('Proposta enviada com sucesso!')
    showBidForm.value = false
    bidForm.value = {
      amount: null,
      description: '',
      delivery_time_days: null
    }
  } catch (err) {
    console.error('Error submitting bid:', err)
    toast.error('Erro ao enviar proposta')
  } finally {
    isBidSubmitting.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>
