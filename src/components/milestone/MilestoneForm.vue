<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Adicionar Milestone</h3>
    
    <form @submit.prevent="createMilestone">
      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Design inicial aprovado"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Descreva o que deve ser entregue..."
          ></textarea>
        </div>

        <!-- Amount & Due Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$) *
            </label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
              Prazo
            </label>
            <input
              id="due_date"
              v-model="form.due_date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <!-- Submit -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {{ loading ? 'Criando...' : 'Criar Milestone' }}
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
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { useToast } from 'vue-toastification'
import api from '@/services/api'

const props = defineProps({
  contractId: {
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

// const toast = useToast()
const loading = ref(false)
const form = ref({
  title: '',
  description: '',
  amount: 0,
  due_date: ''
})

const createMilestone = async () => {
  loading.value = true
  try {
    await api.post('/api/milestones', {
      contract_id: props.contractId,
      ...form.value
    })

    // toast.success('Milestone criado com sucesso!')
    
    // Reset form
    form.value = {
      title: '',
      description: '',
      amount: 0,
      due_date: ''
    }

    if (props.onSuccess) {
      props.onSuccess()
    }
  } catch (error) {
    console.error('Error creating milestone:', error)
    // toast.error(error.response?.data?.error || 'Erro ao criar milestone')
  } finally {
    loading.value = false
  }
}
</script>
