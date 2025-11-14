<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-primary-900">➕ Criar Novo Projeto</h1>
        <p class="text-gray-600 mt-2">Publique seu projeto e receba propostas de prestadores qualificados</p>
      </div>

      <div class="card">
        <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <strong>Erro:</strong> {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <!-- Título -->
          <div>
            <label class="block text-sm font-bold text-primary-900 mb-2">
              Título do Projeto *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              minlength="10"
              maxlength="200"
              class="input w-full"
              placeholder="Ex: Desenvolvimento de aplicativo mobile para delivery"
            />
            <p class="text-xs text-gray-600 mt-1">
              Mínimo 10 caracteres. {{ form.title.length }}/200
            </p>
          </div>

          <!-- Descrição -->
          <div>
            <label class="block text-sm font-bold text-primary-900 mb-2">
              Descrição Detalhada *
            </label>
            <textarea
              v-model="form.description"
              rows="8"
              required
              minlength="50"
              maxlength="2000"
              class="input w-full"
              placeholder="Descreva em detalhes o que você precisa:&#10;- Objetivos do projeto&#10;- Funcionalidades esperadas&#10;- Requisitos técnicos&#10;- Prazo esperado&#10;- Qualquer outra informação relevante"
            ></textarea>
            <p class="text-xs text-gray-600 mt-1">
              Mínimo 50 caracteres. {{ form.description.length }}/2000
            </p>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-bold text-primary-900 mb-2">
              Categoria *
            </label>
            <select v-model="form.category" required class="input w-full">
              <option value="">Selecione uma categoria</option>
              <option value="web">Desenvolvimento Web</option>
              <option value="mobile">Desenvolvimento Mobile</option>
              <option value="design">Design Gráfico</option>
              <option value="marketing">Marketing Digital</option>
              <option value="copywriting">Copywriting</option>
              <option value="video">Edição de Vídeo</option>
              <option value="consulting">Consultoria</option>
              <option value="data">Ciência de Dados</option>
              <option value="other">Outros</option>
            </select>
          </div>

          <!-- Orçamento -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-primary-900 mb-2">
                Orçamento Mínimo (R$) *
              </label>
              <input
                v-model.number="form.min_budget"
                type="number"
                step="0.01"
                min="50"
                required
                class="input w-full"
                placeholder="500.00"
              />
              <p class="text-xs text-gray-600 mt-1">Valor mínimo: R$ 50,00</p>
            </div>
            
            <div>
              <label class="block text-sm font-bold text-primary-900 mb-2">
                Orçamento Máximo (R$) *
              </label>
              <input
                v-model.number="form.max_budget"
                type="number"
                step="0.01"
                min="50"
                required
                class="input w-full"
                placeholder="1000.00"
              />
              <p class="text-xs text-gray-600 mt-1">
                {{ budgetError || 'Deve ser maior que o mínimo' }}
              </p>
            </div>
          </div>

          <!-- Faixa de Orçamento -->
          <div v-if="budgetRange" class="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
            <strong>💰 Faixa de Orçamento:</strong> R$ {{ form.min_budget.toFixed(2) }} - R$ {{ form.max_budget.toFixed(2) }}
            <br />
            <span class="text-sm">Os prestadores poderão fazer lances dentro desta faixa.</span>
          </div>

          <!-- Duração do Leilão -->
          <div>
            <label class="block text-sm font-bold text-primary-900 mb-2">
              Duração do Leilão
            </label>
            <select v-model.number="form.auction_days" class="input w-full">
              <option :value="3">3 dias</option>
              <option :value="5">5 dias</option>
              <option :value="7">7 dias (Recomendado)</option>
              <option :value="10">10 dias</option>
              <option :value="14">14 dias</option>
            </select>
            <p class="text-xs text-gray-600 mt-1">
              O leilão ficará aberto para receber propostas por {{ form.auction_days }} dias
            </p>
          </div>

          <!-- Info Box -->
          <div class="p-4 bg-gradient-to-br from-primary-900 to-primary-700 text-white rounded-lg">
            <h4 class="font-bold mb-3">ℹ️ Como Funciona o Leilão Reverso</h4>
            <ul class="text-sm space-y-2 opacity-90">
              <li>✅ Os prestadores fazem lances cada vez menores</li>
              <li>⭐ Score = 70% do preço + 30% da reputação</li>
              <li>🏆 Melhor score vence quando o leilão encerrar</li>
              <li>💰 Você paga apenas o valor do lance vencedor</li>
              <li>🔒 Valor fica em garantia até entrega do trabalho</li>
            </ul>
          </div>

          <!-- Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="router.push('/dashboard')"
              class="btn btn-secondary flex-1"
            >
              ← Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="btn btn-primary flex-1"
            >
              {{ loading ? 'Criando...' : '🚀 Criar Projeto e Iniciar Leilão' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const error = ref(null)

const form = ref({
  title: '',
  description: '',
  category: '',
  min_budget: null,
  max_budget: null,
  auction_days: 7
})

const budgetError = computed(() => {
  if (!form.value.min_budget || !form.value.max_budget) return null
  if (form.value.max_budget <= form.value.min_budget) {
    return '❌ Deve ser maior que o orçamento mínimo'
  }
  return null
})

const budgetRange = computed(() => {
  return form.value.min_budget && form.value.max_budget && !budgetError.value
})

const isFormValid = computed(() => {
  return (
    form.value.title.length >= 10 &&
    form.value.description.length >= 50 &&
    form.value.category &&
    form.value.min_budget >= 50 &&
    form.value.max_budget > form.value.min_budget
  )
})

const handleSubmit = async () => {
  error.value = null

  // Validação final
  if (!isFormValid.value) {
    error.value = 'Por favor, preencha todos os campos corretamente'
    return
  }

  if (budgetError.value) {
    error.value = 'Orçamento máximo deve ser maior que o mínimo'
    return
  }

  loading.value = true

  try {
    const response = await axios.post('/api/projects', {
      title: form.value.title,
      description: form.value.description,
      category: form.value.category,
      min_budget: form.value.min_budget,
      max_budget: form.value.max_budget,
      auction_duration_days: form.value.auction_days
    }, {
      withCredentials: true
    })

    // Sucesso - redirecionar para dashboard
    alert(`✅ Projeto criado com sucesso! O leilão está ativo e receberá propostas por ${form.value.auction_days} dias.`)
    router.push('/dashboard')

  } catch (err) {
    console.error('Erro ao criar projeto:', err)
    error.value = err.response?.data?.error || 'Erro ao criar projeto. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
