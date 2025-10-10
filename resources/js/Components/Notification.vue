<template>
  <div
    v-if="show"
    :class="[
      'fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-xl shadow-lg border-l-4 transform transition-all duration-300',
      type === 'success' ? 'border-green-500' : 'border-red-500',
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    ]"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg
            v-if="type === 'success'"
            class="h-6 w-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <svg
            v-else
            class="h-6 w-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1">
          <p :class="['text-sm font-medium', type === 'success' ? 'text-green-800' : 'text-red-800']">
            {{ title }}
          </p>
          <p v-if="message" :class="['mt-1 text-sm', type === 'success' ? 'text-green-700' : 'text-red-700']">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="close"
            :class="[
              'rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
              type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
            ]"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['success', 'error'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const show = ref(false)

onMounted(() => {
  show.value = true
  
  if (props.autoClose) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

const close = () => {
  show.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}
</script>