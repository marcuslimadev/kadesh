<template>
  <div v-if="hasErrors" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title || 'Erro de Validação' }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="(error, field) in errors" :key="field">
              <span v-if="Array.isArray(error)">
                <span v-for="(msg, index) in error" :key="index">
                  {{ msg }}<br v-if="index < error.length - 1">
                </span>
              </span>
              <span v-else>{{ error }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  errors: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  }
})

const hasErrors = computed(() => {
  return Object.keys(props.errors).length > 0
})
</script>