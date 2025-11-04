<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="relative z-10 block p-2 text-gray-700 bg-white border border-transparent rounded-md focus:border-indigo-500 focus:ring-opacity-40 focus:ring-indigo-300 focus:ring focus:outline-none">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span v-if="notifications.length" class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
        {{ notifications.length }}
      </span>
    </button>
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-10 w-full h-full"></div>
    <div v-if="isOpen" class="absolute right-0 z-20 w-64 mt-2 overflow-hidden bg-white rounded-lg shadow-xl">
      <div v-for="n in notifications" :key="n.id" class="p-3 text-sm text-gray-600 border-b border-gray-100 hover:bg-gray-100">
        {{ n.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const notifications = ref([
  { id: 1, text: 'Novo lance no projeto "Reforma de Cozinha"' },
  { id: 2, text: 'Você foi superado no leilão "Pintura de Apartamento"' },
])
</script>
