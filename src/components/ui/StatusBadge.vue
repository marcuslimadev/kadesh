<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="statusClasses"
  >
    {{ statusText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const statusConfig = {
  open: {
    text: 'Aberto',
    classes: 'bg-green-100 text-green-800'
  },
  in_progress: {
    text: 'Em Andamento',
    classes: 'bg-blue-100 text-blue-800'
  },
  completed: {
    text: 'Concluído',
    classes: 'bg-gray-100 text-gray-800'
  },
  cancelled: {
    text: 'Cancelado',
    classes: 'bg-red-100 text-red-800'
  },
  pending: {
    text: 'Pendente',
    classes: 'bg-yellow-100 text-yellow-800'
  },
  accepted: {
    text: 'Aceito',
    classes: 'bg-green-100 text-green-800'
  },
  rejected: {
    text: 'Rejeitado',
    classes: 'bg-red-100 text-red-800'
  },
  withdrawn: {
    text: 'Retirado',
    classes: 'bg-gray-100 text-gray-800'
  }
}

const statusText = computed(() => {
  return statusConfig[props.status]?.text || props.status
})

const statusClasses = computed(() => {
  return statusConfig[props.status]?.classes || 'bg-gray-100 text-gray-800'
})
</script>
