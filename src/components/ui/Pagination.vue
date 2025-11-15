<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    <div class="-mt-px w-0 flex-1 flex">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg class="mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>
    </div>
    <div class="hidden md:-mt-px md:flex">
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          page === currentPage
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
        ]"
      >
        {{ page }}
      </button>
    </div>
    <div class="-mt-px w-0 flex-1 flex justify-end">
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
        <svg class="ml-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['page-change'])

const displayedPages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisiblePages

  if (total <= max) {
    // Show all pages
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Calculate start and end
    const halfMax = Math.floor(max / 2)
    let start = Math.max(1, current - halfMax)
    let end = Math.min(total, current + halfMax)

    // Adjust if at the beginning or end
    if (current <= halfMax) {
      end = max
    } else if (current >= total - halfMax) {
      start = total - max + 1
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>
