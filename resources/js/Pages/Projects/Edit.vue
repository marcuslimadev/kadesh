<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Editar Projeto</h1>
            <p class="mt-1 text-sm text-gray-600">Atualize as informações do seu projeto</p>
          </div>
          <button 
            @click="$inertia.visit(`/projects/${project.id}`)"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
        </div>

        <!-- Formulário -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <form @submit.prevent="updateProject" class="space-y-6 p-6">
            <ValidationErrors :errors="$page.props.errors" />

            <!-- Título -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Título do Projeto</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Digite o título do projeto"
              />
            </div>

            <!-- Categoria -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                id="category"
                v-model="form.category"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Selecione uma categoria</option>
                <option value="desenvolvimento-web">Desenvolvimento Web</option>
                <option value="design-grafico">Design Gráfico</option>
                <option value="marketing-digital">Marketing Digital</option>
                <option value="redacao">Redação</option>
                <option value="traducao">Tradução</option>
                <option value="consultoria">Consultoria</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <!-- Orçamento -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="min_budget" class="block text-sm font-medium text-gray-700">Orçamento Mínimo (R$)</label>
                <input
                  id="min_budget"
                  v-model.number="form.min_budget"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="max_budget" class="block text-sm font-medium text-gray-700">Orçamento Máximo (R$)</label>
                <input
                  id="max_budget"
                  v-model.number="form.max_budget"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Prazo para propostas -->
            <div>
              <label for="bidding_ends_at" class="block text-sm font-medium text-gray-700">Prazo para Recebimento de Propostas</label>
              <input
                id="bidding_ends_at"
                v-model="form.bidding_ends_at"
                type="datetime-local"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Descrição -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Descrição do Projeto</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Descreva detalhadamente o que você precisa..."
              ></textarea>
            </div>

            <!-- Requisitos -->
            <div>
              <label for="requirements" class="block text-sm font-medium text-gray-700">Requisitos Específicos</label>
              <textarea
                id="requirements"
                v-model="form.requirements"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Liste os requisitos técnicos, experiência necessária, etc..."
              ></textarea>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status do Projeto</label>
              <select
                id="status"
                v-model="form.status"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="open">Aberto</option>
                <option value="closed">Fechado</option>
                <option value="awarded">Adjudicado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <!-- Botões -->
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="$inertia.visit(`/projects/${project.id}`)"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="processing"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="processing">Salvando...</span>
                <span v-else>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../../Components/Layout.vue'
import ValidationErrors from '../../Components/ValidationErrors.vue'

export default {
  name: 'ProjectEdit',
  components: {
    Layout,
    ValidationErrors
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      processing: false,
      form: {
        title: this.project.title,
        category: this.project.category,
        description: this.project.description,
        requirements: this.project.requirements || '',
        min_budget: this.project.min_budget,
        max_budget: this.project.max_budget,
        bidding_ends_at: this.formatDateTimeLocal(this.project.bidding_ends_at),
        status: this.project.status
      }
    }
  },
  methods: {
    formatDateTimeLocal(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    },
    updateProject() {
      this.processing = true
      
      this.$inertia.put(`/projects/${this.project.id}`, this.form, {
        onSuccess: () => {
          this.$inertia.visit(`/projects/${this.project.id}`)
        },
        onError: () => {
          this.processing = false
        },
        onFinish: () => {
          this.processing = false
        }
      })
    }
  }
}
</script>