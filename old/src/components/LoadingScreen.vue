<template>
  <div v-if="show" class="fixed inset-0 bg-primary-900 bg-opacity-95 z-50 flex items-center justify-center">
    <div class="text-center text-accent-500">
      <div class="text-6xl mb-4">{{ icon }}</div>
      <div class="text-2xl font-semibold">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'Carregando...'
  },
  icon: {
    type: String,
    default: '⚡'
  }
})
</script>
