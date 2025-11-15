<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <!-- Project Image/Category Icon -->
    <div class="h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
      <div class="text-center text-white">
        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-medium">{{ project.category || 'Geral' }}</span>
      </div>
    </div>

    <div class="p-6">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 cursor-pointer">
        <router-link :to="`/projects/${project.id}`">
          {{ project.title }}
        </router-link>
      </h3>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ project.description }}
      </p>

      <!-- Meta Info -->
      <div class="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatDate(project.created_at) }}</span>
        </div>
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <span>{{ project.bid_count || 0 }} propostas</span>
        </div>
      </div>

      <!-- Budget and Status -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs text-gray-500">Orçamento</span>
          <p class="text-lg font-bold text-gray-900">
            {{ formatCurrency(project.budget) }}
          </p>
        </div>
        <StatusBadge :status="project.status" />
      </div>

      <!-- Client Info (if available) -->
      <div v-if="project.client_name" class="mt-4 pt-4 border-t border-gray-100 flex items-center">
        <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold mr-2">
          {{ getInitials(project.client_name) }}
        </div>
        <div class="text-sm">
          <p class="font-medium text-gray-900">{{ project.client_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
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

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'A combinar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
