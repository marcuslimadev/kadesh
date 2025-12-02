<template>
  <div class="min-h-screen bg-page py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-body">Carregando projeto...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-surface rounded-lg shadow-md p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-heading">Erro ao carregar projeto</h3>
        <p class="mt-2 text-sm text-body">{{ error }}</p>
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
          <div class="bg-surface rounded-lg shadow-md p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-heading mb-2">{{ project.title }}</h1>
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
                <p class="text-sm text-body mb-1">Orçamento</p>
                <p class="text-2xl font-bold text-heading">{{ formatCurrency(project.budget) }}</p>
              </div>
              <div>
                <p class="text-sm text-body mb-1">Prazo de Entrega</p>
                <p class="text-lg font-semibold text-heading">{{ formatDeadline(project.deadline) }}</p>
                <!-- Countdown Timer -->
                <div v-if="project.status === 'open' && formattedTimeRemaining" class="mt-2">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4" :class="formattedTimeRemaining.class" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium" :class="formattedTimeRemaining.class">
                      {{ formattedTimeRemaining.text }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h2 class="text-lg font-semibold text-heading mb-3">Descrição</h2>
              <p class="text-body whitespace-pre-line">{{ project.description }}</p>
            </div>

            <!-- Requirements -->
            <div v-if="project.requirements" class="mt-6">
              <h2 class="text-lg font-semibold text-heading mb-3">Requisitos</h2>
              <p class="text-body whitespace-pre-line">{{ project.requirements }}</p>
            </div>

            <!-- Attachments -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-semibold text-heading">Arquivos Anexados</h2>
                <div v-if="isProjectOwner" class="flex items-center gap-2">
                  <input
                    id="detailAttachmentUpload"
                    type="file"
                    class="hidden"
                    multiple
                    accept="image/*,video/*,.pdf"
                    @change="handleAttachmentUpload"
                  />
                  <label
                    for="detailAttachmentUpload"
                    class="inline-flex items-center px-3 py-2 rounded-lg border border-blue-200 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer disabled:opacity-50"
                    :class="{ 'pointer-events-none opacity-60': isUploadingAttachment }"
                  >
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ isUploadingAttachment ? 'Enviando...' : 'Adicionar Anexos' }}
                  </label>
                  <p class="text-xs text-gray-500">Máx. 5MB por arquivo</p>
                </div>
              </div>

              <div v-if="attachmentsList.length" class="grid gap-4 md:grid-cols-2">
                <div
                  v-for="attachment in attachmentsList"
                  :key="attachment.id"
                  class="flex items-center gap-4 p-4 border rounded-xl hover:border-primary-300 hover:bg-primary-50 transition"
                >
                  <div class="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="isImageAttachment(attachment)"
                      :src="attachment.file_url"
                      :alt="attachment.original_name"
                      class="object-cover w-full h-full"
                    />
                    <svg v-else class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10M7 11h10M7 15h7" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-heading truncate">{{ attachment.original_name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ attachment.mime_type || 'Arquivo' }}
                      <span v-if="attachment.file_size">
                        · {{ formatAttachmentSize(attachment.file_size) }}
                      </span>
                    </p>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <a
                        :href="attachment.file_url"
                        target="_blank"
                        rel="noopener"
                        class="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Baixar / Abrir
                      </a>
                      <button
                        v-if="isProjectOwner"
                        type="button"
                        class="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                        :disabled="deletingAttachmentId === attachment.id"
                        @click="removeAttachment(attachment.id)"
                      >
                        {{ deletingAttachmentId === attachment.id ? 'Removendo...' : 'Remover' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="p-4 border border-dashed rounded-xl text-sm text-gray-500 bg-gray-50">
                Nenhum anexo enviado até o momento.
                <span v-if="isProjectOwner" class="text-body font-medium">Use o botão acima para subir arquivos de referência.</span>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="project.skills" class="mt-6">
              <h2 class="text-lg font-semibold text-heading mb-3">Habilidades Necessárias</h2>
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
          <div class="bg-surface rounded-lg shadow-md p-6">
            <!-- Auction Timer Banner -->
            <div v-if="project.status === 'open' && formattedTimeRemaining && !formattedTimeRemaining.expired" 
                 class="mb-4 p-4 rounded-lg border-2"
                 :class="{
                   'bg-green-50 border-green-300': timeRemaining?.days > 2,
                   'bg-yellow-50 border-yellow-300': timeRemaining?.days <= 2 && timeRemaining?.hours > 6,
                   'bg-orange-50 border-orange-300': timeRemaining?.hours <= 6 && timeRemaining?.hours > 0,
                   'bg-red-50 border-red-300': timeRemaining?.hours === 0
                 }">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full" 
                       :class="{
                         'bg-green-100': timeRemaining?.days > 2,
                         'bg-yellow-100': timeRemaining?.days <= 2 && timeRemaining?.hours > 6,
                         'bg-orange-100': timeRemaining?.hours <= 6 && timeRemaining?.hours > 0,
                         'bg-red-100': timeRemaining?.hours === 0
                       }">
                    <svg class="w-6 h-6" :class="formattedTimeRemaining.class" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-heading">Leilão Ativo</p>
                    <p class="text-sm text-body">Envie sua proposta antes do prazo</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-body">Tempo restante</p>
                  <p class="text-2xl font-bold" :class="formattedTimeRemaining.class">
                    {{ formattedTimeRemaining.text }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-heading">
                Propostas ({{ bids.length }})
              </h2>
              <div class="flex items-center gap-3">
                <!-- Sort Dropdown -->
                <div v-if="bids.length > 1" class="relative">
                  <label for="bidSort" class="sr-only">Ordenar propostas</label>
                  <select
                    id="bidSort"
                    v-model="bidSortBy"
                    class="block pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                  >
                    <option value="score">Melhor Score</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="date-new">Mais Recentes</option>
                    <option value="date-old">Mais Antigas</option>
                  </select>
                </div>
                
                <button
                  v-if="canSubmitBid"
                  @click="showBidForm = !showBidForm"
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  {{ showBidForm ? 'Cancelar' : 'Enviar Proposta' }}
                </button>
              </div>
            </div>

            <!-- Bid Form -->
            <div v-if="showBidForm && canSubmitBid" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="font-medium text-heading mb-4">Nova Proposta</h3>
              <form @submit.prevent="submitBid" class="space-y-4">
                <div>
                  <label for="bidAmount" class="block text-sm font-medium text-body mb-1">
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
                  <label for="bidDescription" class="block text-sm font-medium text-body mb-1">
                    Descrição da Proposta *
                  </label>
                  <textarea
                    id="bidDescription"
                    v-model="bidForm.proposal"
                    rows="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Descreva como você pretende realizar o projeto..."
                  ></textarea>
                </div>
                <div>
                  <label for="bidDeliveryTime" class="block text-sm font-medium text-body mb-1">
                    Tempo de Entrega (dias) *
                  </label>
                  <input
                    id="bidDeliveryTime"
                    v-model.number="bidForm.delivery_time"
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

            <!-- Bids Loading State -->
            <div v-if="isBidsLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p class="mt-2 text-body text-sm">Carregando propostas...</p>
            </div>

            <!-- Bids List -->
            <div v-else-if="bids.length > 0" class="space-y-4">
              <BidCard
                v-for="bid in sortedBids"
                :key="bid.id"
                :bid="bid"
                :show-actions="isProjectOwner"
                @accept="acceptBid"
                @reject="rejectBid"
              />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2">Nenhuma proposta enviada ainda</p>
              <p v-if="canSubmitBid" class="text-sm mt-1">Seja o primeiro a enviar uma proposta!</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Client Info -->
          <div class="bg-surface rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-heading mb-4">Contratante</h3>
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-semibold mr-3">
                {{ getInitials(project.client_name) }}
              </div>
              <div>
                <p class="font-medium text-heading">{{ project.client_name }}</p>
                <p class="text-sm text-gray-500">Contratante</p>
              </div>
            </div>
          </div>

          <!-- Project Stats -->
          <div class="bg-surface rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-heading mb-4">Estatísticas</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-body">Propostas</span>
                <span class="text-sm font-medium text-heading">{{ project.bid_count || 0 }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-body">Orçamento Médio</span>
                <span class="text-sm font-medium text-heading">{{ formatCurrency(project.budget) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-body">Status</span>
                <StatusBadge :status="project.status" />
              </div>
            </div>
          </div>

          <!-- Actions (for project owner) -->
          <div v-if="authStore.user?.id === project.client_id" class="bg-surface rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-heading mb-4">Ações</h3>
            <div class="space-y-3">
              <button
                class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-body bg-surface hover:bg-gray-50 transition-colors"
              >
                Editar Projeto
              </button>
              <button
                v-if="project.status === 'open' && bids.length > 0"
                @click="closeAuction"
                :disabled="isClosingAuction"
                class="w-full px-4 py-2 border border-green-500 rounded-md text-sm font-medium text-green-700 bg-surface hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isClosingAuction ? 'Encerrando...' : '🏁 Encerrar Leilão e Selecionar Vencedor' }}
              </button>
              <p v-if="project.status === 'open' && bids.length > 0" class="text-xs text-gray-500 text-center">
                O vencedor será o lance de menor valor
              </p>
              <button
                v-if="project.status === 'open'"
                class="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-surface hover:bg-red-50 transition-colors"
              >
                Cancelar Projeto
              </button>
            </div>
          </div>

          <!-- Auction Winner Banner -->
          <div v-if="project.status === 'in_progress' && acceptedBid" class="bg-surface rounded-lg shadow-md p-6 border-2 border-green-500">
            <div class="flex items-center space-x-2 mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-semibold text-green-800">Vencedor do Leilão</h3>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                {{ getInitials(acceptedBid.provider_name) }}
              </div>
              <div>
                <p class="font-medium text-heading">{{ acceptedBid.provider_name }}</p>
                <p class="text-sm text-green-600 font-semibold">{{ formatCurrency(acceptedBid.amount) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProjectsStore } from '@/stores/projects'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import BidCard from '@/components/project/BidCard.vue'
import projectService from '@/services/projectService'
import bidService from '@/services/bidService'
// import { useToast } from 'vue-toastification'
import { formatDistanceToNow, differenceInSeconds } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const projectsStore = useProjectsStore()
// const toast = useToast()

const project = ref(null)
const bids = ref([])
const isLoading = ref(false)
const isBidsLoading = ref(false)
const error = ref(null)
const showBidForm = ref(false)
const isBidSubmitting = ref(false)
const timeRemaining = ref(null)
const countdownInterval = ref(null)
const bidSortBy = ref('score') // score, price-low, price-high, date-new, date-old
const isClosingAuction = ref(false)
const deletingAttachmentId = ref(null)
const isUploadingAttachment = ref(false)

const bidForm = ref({
  amount: null,
  proposal: '',
  delivery_time: null
})

const skillsArray = computed(() => {
  if (!project.value?.skills) return []
  return project.value.skills.split(',').map(s => s.trim()).filter(Boolean)
})

const isProjectOwner = computed(() => {
  return authStore.user?.id === project.value?.client_id
})

const canSubmitBid = computed(() => {
  return authStore.isProvider && project.value?.status === 'open' && !isProjectOwner.value
})

const hasDeadlinePassed = computed(() => {
  if (!project.value?.deadline) return false
  return new Date(project.value.deadline) < new Date()
})

const formattedTimeRemaining = computed(() => {
  if (!timeRemaining.value) return null
  
  const { days, hours, minutes, seconds, expired } = timeRemaining.value
  
  if (expired) {
    return { text: 'Prazo encerrado', class: 'text-red-600' }
  }
  
  if (days > 0) {
    return { 
      text: `${days}d ${hours}h ${minutes}m`, 
      class: days > 2 ? 'text-green-600' : 'text-yellow-600' 
    }
  }
  
  if (hours > 0) {
    return { 
      text: `${hours}h ${minutes}m ${seconds}s`, 
      class: hours > 6 ? 'text-yellow-600' : 'text-orange-600' 
    }
  }
  
  return { 
    text: `${minutes}m ${seconds}s`, 
    class: 'text-red-600 font-bold' 
  }
})

const sortedBids = computed(() => {
  if (!bids.value || bids.value.length === 0) return []
  
  const sorted = [...bids.value]
  
  switch (bidSortBy.value) {
    case 'price-low':
      return sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0))
    case 'price-high':
      return sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0))
    case 'date-new':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'date-old':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    case 'score':
    default:
      // Sort by score (highest first), then by amount (lowest first)
      return sorted.sort((a, b) => {
        const scoreA = a.score || 0
        const scoreB = b.score || 0
        if (scoreB !== scoreA) {
          return scoreB - scoreA
        }
        return (a.amount || 0) - (b.amount || 0)
      })
  }
})

const attachmentsList = computed(() => {
  if (!project.value?.attachments) return []
  return Array.isArray(project.value.attachments) ? project.value.attachments : []
})

const acceptedBid = computed(() => {
  if (!bids.value || bids.value.length === 0) return null
  return bids.value.find(bid => bid.status === 'accepted')
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
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  const cat = categories.find(c => c.value === value || c.label === value)
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

const isImageAttachment = (attachment) => {
  return Boolean(attachment?.mime_type && attachment.mime_type.startsWith('image/'))
}

const formatAttachmentSize = (bytes) => {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const removeAttachment = async (attachmentId) => {
  if (!project.value?.id || !attachmentId) return
  const confirmed = window.confirm('Remover este anexo? Essa ação não pode ser desfeita.')
  if (!confirmed) return

  deletingAttachmentId.value = attachmentId
  try {
    const result = await projectService.deleteAttachment(project.value.id, attachmentId)
    if (result.success) {
      const filtered = attachmentsList.value.filter(item => item.id !== attachmentId)
      project.value.attachments = filtered
    // toast.success('Anexo removido com sucesso')
    } else {
    // toast.error(result.error || 'Erro ao remover anexo')
    }
  } catch (error) {
    console.error('Erro ao remover anexo:', error)
    // toast.error('Erro ao remover anexo')
  } finally {
    deletingAttachmentId.value = null
  }
}

const handleAttachmentUpload = async (event) => {
  if (!project.value?.id) return
  const files = Array.from(event.target?.files || [])
  if (!files.length) return

  isUploadingAttachment.value = true
  try {
    let uploaded = 0
    let failed = 0
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        failed++
    // toast.error(`${file.name} excede 5MB`)
        continue
      }

      try {
        const response = await projectService.uploadAttachment(project.value.id, file)
        if (response.success) {
          uploaded++
          const current = attachmentsList.value
          project.value.attachments = [...current, response.data.attachment]
        } else {
          failed++
    // toast.error(response.error || `Erro ao enviar ${file.name}`)
        }
      } catch (error) {
        failed++
        console.error('Erro ao enviar anexo:', error)
    // toast.error(`Erro ao enviar ${file.name}`)
      }
    }

    if (uploaded) {
    // toast.success(`${uploaded} anexo(s) enviado(s) com sucesso`)
    }
    if (failed) {
    // toast.error(`${failed} anexo(s) falharam. Tente novamente.`)
    }
  } finally {
    isUploadingAttachment.value = false
    if (event.target) {
      event.target.value = ''
    }
  }
}

const updateCountdown = () => {
  if (!project.value?.deadline) {
    timeRemaining.value = null
    return
  }
  
  const deadline = new Date(project.value.deadline)
  const now = new Date()
  const secondsLeft = differenceInSeconds(deadline, now)
  
  if (secondsLeft <= 0) {
    timeRemaining.value = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    }
    // Stop the countdown
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
    return
  }
  
  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const minutes = Math.floor((secondsLeft % 3600) / 60)
  const seconds = secondsLeft % 60
  
  timeRemaining.value = {
    days,
    hours,
    minutes,
    seconds,
    expired: false
  }
}

const startCountdown = () => {
  // Clear any existing interval
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  // Update immediately
  updateCountdown()
  
  // Update every second
  countdownInterval.value = setInterval(updateCountdown, 1000)
}

const loadProject = async () => {
  isLoading.value = true
  error.value = null

  try {
    const projectId = route.params.id
    const result = await projectService.getProject(projectId)

    if (result.success) {
      project.value = result.data.project
      // Start countdown if project is open and has a deadline
      if (project.value.status === 'open' && project.value.deadline) {
        startCountdown()
      }
      // Load bids after project is loaded
      await loadBids()
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

const loadBids = async () => {
  if (!project.value?.id) return
  
  isBidsLoading.value = true
  
  try {
    const result = await projectService.getProjectBids(project.value.id)
    
    if (result.success) {
      bids.value = result.data.bids || []
      // Update bid count in project
      if (project.value) {
        project.value.bid_count = bids.value.length
      }
    } else {
      console.error('Error loading bids:', result.error)
    }
  } catch (err) {
    console.error('Error loading bids:', err)
  } finally {
    isBidsLoading.value = false
  }
}

const submitBid = async () => {
  if (!authStore.isAuthenticated) {
    // toast.error('Você precisa fazer login para enviar uma proposta')
    router.push('/login')
    return
  }

  if (!authStore.isProvider) {
    // toast.error('Apenas prestadores podem enviar propostas')
    return
  }

  if (!bidForm.value.amount || !bidForm.value.proposal || !bidForm.value.delivery_time) {
    // toast.error('Por favor, preencha todos os campos')
    return
  }

  if (!bidForm.value.proposal.trim()) {
    // toast.error('Descrição da proposta é obrigatória')
    return
  }

  isBidSubmitting.value = true

  try {
    const bidData = {
      project_id: project.value.id,
      amount: bidForm.value.amount,
      proposal: bidForm.value.proposal,
      delivery_time: bidForm.value.delivery_time
    }

    const result = await bidService.createBid(bidData)
    
    if (result.success) {
    // toast.success('Proposta enviada com sucesso!')
      showBidForm.value = false
      bidForm.value = {
        amount: null,
        proposal: '',
        delivery_time: null
      }
      // Reload bids to show the new one
      await loadBids()
    } else {
    // toast.error(result.error || 'Erro ao enviar proposta')
    }
  } catch (err) {
    console.error('Error submitting bid:', err)
    // toast.error('Erro ao enviar proposta')
  } finally {
    isBidSubmitting.value = false
  }
}

const acceptBid = async (bidId) => {
  if (!confirm('Tem certeza que deseja aceitar esta proposta? Isso encerrará o leilão.')) {
    return
  }

  try {
    const result = await bidService.acceptBid(project.value.id, bidId)
    
    if (result.success) {
    // toast.success('Proposta aceita com sucesso!')
      // Reload project and bids
      await loadProject()
    } else {
    // toast.error(result.error || 'Erro ao aceitar proposta')
    }
  } catch (err) {
    console.error('Error accepting bid:', err)
    // toast.error('Erro ao aceitar proposta')
  }
}

const rejectBid = async (bidId) => {
  if (!confirm('Tem certeza que deseja rejeitar esta proposta?')) {
    return
  }

  try {
    const result = await bidService.rejectBid(bidId)
    
    if (result.success) {
    // toast.success('Proposta rejeitada')
      // Reload bids
      await loadBids()
    } else {
    // toast.error(result.error || 'Erro ao rejeitar proposta')
    }
  } catch (err) {
    console.error('Error rejecting bid:', err)
    // toast.error('Erro ao rejeitar proposta')
  }
}

const closeAuction = async () => {
  if (bids.value.length === 0) {
    // toast.error('Não há propostas para selecionar um vencedor')
    return
  }

  const lowestBid = [...bids.value].sort((a, b) => (a.amount || 0) - (b.amount || 0))[0]
  
  const confirmMessage = `Encerrar o leilão agora?\n\nO vencedor será: ${lowestBid.provider_name}\nValor: R$ ${new Intl.NumberFormat('pt-BR').format(lowestBid.amount)}\n\nEsta ação não pode ser desfeita.`
  
  if (!confirm(confirmMessage)) {
    return
  }

  isClosingAuction.value = true

  try {
    const result = await projectService.closeAuction(project.value.id)
    
    if (result.success) {
    // toast.success('🎉 Leilão encerrado com sucesso! O vencedor foi notificado.')
      // Reload project and bids to show updated status
      await loadProject()
    } else {
    // toast.error(result.error || 'Erro ao encerrar leilão')
    }
  } catch (err) {
    console.error('Error closing auction:', err)
    // toast.error('Erro ao encerrar leilão')
  } finally {
    isClosingAuction.value = false
  }
}

onMounted(() => {
  loadProject()
})

onUnmounted(() => {
  // Clean up countdown interval
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>
