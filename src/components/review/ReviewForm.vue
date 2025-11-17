<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Avaliar {{ reviewedName }}</h3>
    
    <form @submit.prevent="submitReview">
      <!-- Rating -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nota
        </label>
        <div class="flex gap-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="rating = star"
            class="focus:outline-none transition-transform hover:scale-110"
          >
            <StarIcon
              :class="[
                'w-8 h-8',
                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              ]"
            />
          </button>
        </div>
        <p v-if="rating" class="text-sm text-gray-600 mt-1">
          {{ ratingLabels[rating - 1] }}
        </p>
      </div>

      <!-- Comment -->
      <div class="mb-4">
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
          Comentário (opcional)
        </label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Compartilhe sua experiência..."
        ></textarea>
      </div>

      <!-- Submit -->
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="!rating || loading"
          class="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? 'Enviando...' : 'Enviar Avaliação' }}
        </button>
        <button
          v-if="onCancel"
          type="button"
          @click="onCancel"
          class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { StarIcon } from '@heroicons/vue/24/solid'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const props = defineProps({
  contractId: {
    type: String,
    required: true
  },
  reviewedUserId: {
    type: [String, Number],
    required: true
  },
  reviewedName: {
    type: String,
    required: true
  },
  onSuccess: {
    type: Function,
    default: null
  },
  onCancel: {
    type: Function,
    default: null
  }
})

const toast = useToast()
const rating = ref(0)
const comment = ref('')
const loading = ref(false)

const ratingLabels = [
  'Muito Ruim',
  'Ruim',
  'Regular',
  'Bom',
  'Excelente'
]

const submitReview = async () => {
  if (!rating.value) {
    toast.warning('Selecione uma nota')
    return
  }

  loading.value = true
  try {
    await api.post('/reviews', {
      contract_id: props.contractId,
      reviewed_user_id: props.reviewedUserId,
      rating: rating.value,
      comment: comment.value || null
    })

    toast.success('Avaliação enviada com sucesso!')
    
    if (props.onSuccess) {
      props.onSuccess()
    }

    // Reset form
    rating.value = 0
    comment.value = ''
  } catch (error) {
    console.error('Error submitting review:', error)
    toast.error(error.response?.data?.message || 'Erro ao enviar avaliação')
  } finally {
    loading.value = false
  }
}
</script>
