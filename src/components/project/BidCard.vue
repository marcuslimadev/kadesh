<template>
  <div class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
    <!-- Provider Info and Amount -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-3">
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
          {{ getInitials(bid.provider_name) }}
        </div>
        <div>
          <p class="font-medium text-gray-900">{{ bid.provider_name }}</p>
          <div class="flex items-center text-xs text-gray-500">
            <svg class="w-3 h-3 mr-1 text-yellow-500 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span>{{ formatRating(bid.rating) }}</span>
            <span class="mx-1">•</span>
            <span>{{ bid.total_projects || 0 }} projetos</span>
          </div>
        </div>
      </div>
      
      <!-- Bid Amount -->
      <div class="text-right">
        <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(bid.amount) }}</p>
        <p class="text-xs text-gray-500">{{ formatDeliveryTime(bid.delivery_time ?? bid.delivery_time_days) }}</p>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-3">
      <p class="text-sm text-gray-700">{{ bid.proposal || bid.description }}</p>
    </div>

    <!-- Bid Stats -->
    <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
      <div class="flex items-center space-x-4">
        <span class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formatDate(bid.created_at) }}
        </span>
        <span v-if="bid.score" class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Score: {{ bid.score.toFixed(1) }}
        </span>
      </div>
      
      <StatusBadge :status="bid.status" />
    </div>

    <!-- Actions (for project owner) -->
    <div v-if="showActions && bid.status === 'pending'" class="flex gap-2">
      <button
        @click="$emit('accept', bid.id)"
        class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Aceitar Proposta
      </button>
      <button
        @click="$emit('reject', bid.id)"
        class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        Rejeitar
      </button>
    </div>

    <!-- Status Message (for accepted/rejected) -->
    <div v-if="bid.status === 'accepted'" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
      ✓ Proposta aceita
    </div>
    <div v-if="bid.status === 'rejected'" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
      ✗ Proposta rejeitada
    </div>
  </div>
</template>

<script setup>
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const props = defineProps({
  bid: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['accept', 'reject'])

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Novo'
  const parsed = Number(rating)
  if (Number.isNaN(parsed)) return 'Novo'
  return parsed.toFixed(1)
}

const formatDeliveryTime = (days) => {
  if (!days) return ''
  return `${days} ${days === 1 ? 'dia' : 'dias'}`
}

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
</script>
