<template>
  <div class="bg-[#161821] border border-[rgba(212,175,55,0.24)] rounded-lg p-4 hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:border-[#D4AF37] transition-all">
    <!-- Provider Info and Amount -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-3">
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.15)] text-[#D4AF37] flex items-center justify-center text-sm font-semibold border border-[#D4AF37]">
          {{ getInitials(bid.provider_name) }}
        </div>
        <div>
          <p class="font-medium text-heading">{{ bid.provider_name }}</p>
          <div class="flex items-center text-xs text-body">
            <svg class="w-3 h-3 mr-1 text-[#D4AF37] fill-current" viewBox="0 0 20 20">
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
        <p class="text-2xl font-bold text-[#D4AF37]">{{ formatCurrency(bid.amount) }}</p>
        <p class="text-xs text-muted">{{ formatDeliveryTime(bid.delivery_time ?? bid.delivery_time_days) }}</p>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-3">
      <p class="text-sm text-body">{{ bid.proposal || bid.description }}</p>
    </div>

    <!-- Bid Stats -->
    <div class="flex items-center justify-between text-xs text-muted mb-3">
      <div class="flex items-center space-x-4">
        <span class="flex items-center">
          <svg class="w-3 h-3 mr-1 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formatDate(bid.created_at) }}
        </span>
        <span v-if="bid.score" class="flex items-center">
          <svg class="w-3 h-3 mr-1 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        class="flex-1 px-4 py-2 bg-[#22c55e] text-white rounded-md hover:bg-[#16a34a] transition-colors text-sm font-medium"
      >
        Aceitar Proposta
      </button>
      <button
        @click="$emit('reject', bid.id)"
        class="px-4 py-2 border border-[rgba(212,175,55,0.24)] text-body rounded-md hover:bg-[#1A1A1A] transition-colors text-sm font-medium"
      >
        Rejeitar
      </button>
    </div>

    <!-- Status Message (for accepted/rejected) -->
    <div v-if="bid.status === 'accepted'" class="mt-2 p-2 bg-[rgba(34,197,94,0.15)] border border-[#22c55e] rounded text-sm text-[#22c55e]">
      ✓ Proposta aceita
    </div>
    <div v-if="bid.status === 'rejected'" class="mt-2 p-2 bg-[rgba(239,68,68,0.15)] border border-[#ef4444] rounded text-sm text-[#ef4444]">
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



