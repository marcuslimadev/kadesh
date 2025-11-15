<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <router-link
            :to="`/projects/${project.id}`"
            class="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
          >
            {{ project.title }}
          </router-link>
          <div class="flex items-center gap-2 mt-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {{ project.category }}
            </span>
            <StatusBadge :status="project.status" />
          </div>
        </div>
        <div v-if="project.featured" class="ml-4">
          <svg class="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-sm line-clamp-3 mb-4">
        {{ project.description }}
      </p>

      <!-- Skills -->
      <div v-if="project.skills_required && project.skills_required.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="skill in project.skills_required.slice(0, 5)"
          :key="skill"
          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
        >
          {{ skill }}
        </span>
        <span
          v-if="project.skills_required.length > 5"
          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
        >
          +{{ project.skills_required.length - 5 }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center gap-4">
          <div class="flex items-center text-sm text-gray-500">
            <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-semibold">{{ formatCurrency(project.budget) }}</span>
          </div>
          <div v-if="project.deadline" class="flex items-center text-sm text-gray-500">
            <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(project.deadline) }}
          </div>
        </div>
        <div v-if="showBidCount && project.bid_count !== undefined" class="flex items-center text-sm text-gray-500">
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          {{ project.bid_count }} {{ project.bid_count === 1 ? 'proposta' : 'propostas' }}
        </div>
      </div>
    </div>

    <!-- View Details Button -->
    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
      <router-link
        :to="`/projects/${project.id}`"
        class="block w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        Ver detalhes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({
  project: {
    type: Object,
    required: true
  },
  showBidCount: {
    type: Boolean,
    default: true
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
}
</script>
