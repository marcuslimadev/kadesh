<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusClasses
    ]"
  >
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusConfig = {
  open: {
    text: 'Aberto',
    classes: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[#22c55e]'
  },
  in_progress: {
    text: 'Em andamento',
    classes: 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[#D4AF37]'
  },
  completed: {
    text: 'Concluído',
    classes: 'bg-[rgba(138,138,138,0.15)] text-[#C7C7C7] border border-[#8A8A8A]'
  },
  cancelled: {
    text: 'Cancelado',
    classes: 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444]'
  },
  pending: {
    text: 'Pendente',
    classes: 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37] border border-[#D4AF37]'
  },
  accepted: {
    text: 'Aceita',
    classes: 'bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[#22c55e]'
  },
  rejected: {
    text: 'Rejeitada',
    classes: 'bg-[rgba(239,68,68,0.15)] text-[#ef4444] border border-[#ef4444]'
  },
  withdrawn: {
    text: 'Retirada',
    classes: 'bg-[rgba(138,138,138,0.15)] text-[#8A8A8A] border border-[#8A8A8A]'
  }
}

const statusText = computed(() => {
  return statusConfig[props.status]?.text || props.status
})

const statusClasses = computed(() => {
  return statusConfig[props.status]?.classes || 'bg-gray-100 text-gray-800'
})
</script>

