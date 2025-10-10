<template>
  <Layout>
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 class="text-3xl font-bold text-white">✨ Criar Novo Projeto</h1>
            <p class="text-indigo-100 mt-2">
              Publique seu projeto em {{ 4 - currentStep }} passos e receba propostas incríveis!
            </p>
          </div>

          <!-- Barra de Progresso -->
          <div class="bg-white px-8 py-6 border-b border-gray-200">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-6">
                <!-- Passo 1 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 1 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 1">✓</span>
                    <span v-else>1</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Informações</p>
                    <p class="text-xs text-gray-500">Básicas</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 2 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 2 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 2">✓</span>
                    <span v-else>2</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Descrição</p>
                    <p class="text-xs text-gray-500">Detalhada</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 3 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 3 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 3 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 3">✓</span>
                    <span v-else>3</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Orçamento</p>
                    <p class="text-xs text-gray-500">& Prazo</p>
                  </div>
                </div>
                <div class="hidden sm:block w-24 h-1 bg-gray-200 rounded-full">
                  <div :class="['h-full rounded-full transition-all duration-500', currentStep >= 4 ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200']"></div>
                </div>
                
                <!-- Passo 4 -->
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all duration-300', 
                              currentStep >= 4 ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 4">✓</span>
                    <span v-else>4</span>
                  </div>
                  <div class="ml-3 hidden sm:block">
                    <p class="text-sm font-medium text-gray-900">Publicar</p>
                    <p class="text-xs text-gray-500">Revisar</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ currentStep }}/4</p>
                <p class="text-xs text-gray-500">{{ Math.round((currentStep/4) * 100) }}% completo</p>
              </div>
            </div>
          </div>

          <ValidationErrors :errors="$page.props.errors" title="⚠️ Corrija os erros antes de continuar:" />

          <form @submit.prevent="handleStepSubmit" class="p-8">
            <!-- Passo 1: Informações Básicas -->
            <div v-show="currentStep === 1" class="space-y-8 animate-fadeIn">
              <div class="text-center mb-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-4">
                  <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">📝 Informações Básicas</h2>
                <p class="text-gray-600">Vamos começar com o essencial do seu projeto</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:col-span-2">
                  <label for="title" class="block text-sm font-bold text-gray-700 mb-3">
                    🎯 Título do Projeto *
                  </label>
                  <input
                    id="title"
                    type="text"
                    v-model="form.title"
                    required
                    maxlength="255"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    placeholder="Ex: Desenvolvimento de E-commerce completo"
                  />
                  <p class="mt-2 text-sm text-gray-500">{{ form.title.length }}/255 caracteres</p>
                </div>

                <div>
                  <label for="category" class="block text-sm font-bold text-gray-700 mb-3">
                    📂 Categoria *
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Escolha uma categoria</option>
                    <option value="desenvolvimento-web">🌐 Desenvolvimento Web</option>
                    <option value="design-grafico">🎨 Design Gráfico</option>
                    <option value="marketing-digital">📱 Marketing Digital</option>
                    <option value="redacao">✍️ Redação</option>
                    <option value="traducao">🌍 Tradução</option>
                    <option value="consultoria">💼 Consultoria</option>
                    <option value="outros">🔧 Outros</option>
                  </select>
                </div>

                <div>
                  <label for="urgency" class="block text-sm font-bold text-gray-700 mb-3">
                    ⚡ Urgência do Projeto
                  </label>
                  <select
                    id="urgency"
                    v-model="form.urgency"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                  >
                    <option value="low">🟢 Baixa - Tenho tempo</option>
                    <option value="medium">🟡 Média - Algumas semanas</option>
                    <option value="high">🟠 Alta - Preciso logo</option>
                    <option value="urgent">🔴 Urgente - Para ontem!</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Passo 2: Descrição Detalhada -->
            <div v-show="currentStep === 2" class="space-y-8 animate-fadeIn">
              <div class="text-center mb-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">📄 Descrição Detalhada</h2>
                <p class="text-gray-600">Quanto mais detalhes, melhores propostas você receberá</p>
              </div>

              <div class="space-y-8">
                <div>
                  <label for="description" class="block text-sm font-bold text-gray-700 mb-3">
                    📝 Descrição do Projeto *
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    required
                    rows="6"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all resize-none"
                    placeholder="Descreva em detalhes:
• O que você precisa que seja feito?
• Qual o objetivo do projeto?
• Quais funcionalidades são essenciais?
• Há alguma referência ou exemplo?
• Tecnologias preferidas?"
                  ></textarea>
                  <div class="mt-2 flex justify-between text-sm text-gray-500">
                    <span>Seja específico e detalhado</span>
                    <span>{{ form.description.length }}/2000 caracteres</span>
                  </div>
                </div>

                <div>
                  <label for="requirements" class="block text-sm font-bold text-gray-700 mb-3">
                    ⚙️ Requisitos Específicos
                  </label>
                  <textarea
                    id="requirements"
                    v-model="form.requirements"
                    rows="4"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all resize-none"
                    placeholder="Liste requisitos específicos:
• Experiência mínima necessária
• Certificações ou habilidades técnicas
• Ferramentas ou tecnologias obrigatórias
• Disponibilidade de horários
• Localização geográfica (se relevante)"
                  ></textarea>
                  <p class="mt-2 text-sm text-gray-500">{{ form.requirements.length }}/1000 caracteres</p>
                </div>

                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 class="font-bold text-blue-900 mb-3">💡 Dicas para uma descrição eficaz:</h3>
                  <ul class="text-blue-800 space-y-2 text-sm">
                    <li>• Seja específico sobre funcionalidades e objetivos</li>
                    <li>• Mencione referências, sites ou apps similares</li>
                    <li>• Indique se há materiais (logos, textos, imagens) prontos</li>
                    <li>• Deixe claro o que está incluído e o que não está</li>
                    <li>• Mencione integrações necessárias (APIs, sistemas, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Passo 3: Orçamento e Prazo -->
            <div v-show="currentStep === 3" class="space-y-8 animate-fadeIn">
              <div class="text-center mb-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 mb-4">
                  <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">💰 Orçamento e Prazo</h2>
                <p class="text-gray-600">Defina suas expectativas financeiras e temporais</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label for="min_budget" class="block text-sm font-bold text-gray-700 mb-3">
                    💵 Orçamento Mínimo (R$) *
                  </label>
                  <input
                    id="min_budget"
                    type="number"
                    v-model.number="form.min_budget"
                    required
                    min="1"
                    step="0.01"
                    class="w-full px-4 py-4 text-xl font-bold border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    placeholder="1.000"
                  />
                  <p class="mt-2 text-sm text-gray-500">Valor mínimo que você aceita pagar</p>
                </div>

                <div>
                  <label for="max_budget" class="block text-sm font-bold text-gray-700 mb-3">
                    💸 Orçamento Máximo (R$) *
                  </label>
                  <input
                    id="max_budget"
                    type="number"
                    v-model.number="form.max_budget"
                    required
                    min="1"
                    step="0.01"
                    class="w-full px-4 py-4 text-xl font-bold border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                    placeholder="5.000"
                  />
                  <p class="mt-2 text-sm text-gray-500">Valor máximo do seu orçamento</p>
                </div>

                <div class="md:col-span-2">
                  <label for="bidding_ends_at" class="block text-sm font-bold text-gray-700 mb-3">
                    📅 Prazo para Recebimento de Propostas *
                  </label>
                  <input
                    id="bidding_ends_at"
                    type="datetime-local"
                    v-model="form.bidding_ends_at"
                    required
                    :min="minDate"
                    class="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  />
                  <p class="mt-2 text-sm text-gray-500">Até quando você aceita receber propostas?</p>
                </div>
              </div>

              <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                <h3 class="font-bold text-orange-900 mb-3">💡 Dicas sobre orçamento:</h3>
                <ul class="text-orange-800 space-y-2 text-sm">
                  <li>• Pesquise preços médios para projetos similares</li>
                  <li>• Considere a qualidade vs. preço</li>
                  <li>• Orçamentos muito baixos podem afastar bons profissionais</li>
                  <li>• Orçamentos realistas atraem propostas de qualidade</li>
                  <li>• Deixe uma margem para possíveis ajustes</li>
                </ul>
              </div>
            </div>

            <!-- Passo 4: Revisão e Publicação -->
            <div v-show="currentStep === 4" class="space-y-8 animate-fadeIn">
              <div class="text-center mb-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">🎉 Quase lá!</h2>
                <p class="text-gray-600">Revise tudo e publique seu projeto</p>
              </div>

              <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                <h3 class="text-xl font-bold text-gray-900 mb-6">📋 Resumo do seu projeto:</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div class="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 class="font-bold text-gray-700 mb-2">🎯 Título</h4>
                    <p class="text-gray-900">{{ form.title || 'Não informado' }}</p>
                  </div>
                  <div class="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 class="font-bold text-gray-700 mb-2">📂 Categoria</h4>
                    <p class="text-gray-900">{{ getCategoryName(form.category) }}</p>
                  </div>
                  <div class="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 class="font-bold text-gray-700 mb-2">💰 Orçamento</h4>
                    <p class="text-gray-900 font-bold text-green-600">
                      R$ {{ formatCurrency(form.min_budget || 0) }} - R$ {{ formatCurrency(form.max_budget || 0) }}
                    </p>
                  </div>
                  <div class="bg-white rounded-xl p-4 border border-gray-200">
                    <h4 class="font-bold text-gray-700 mb-2">📅 Prazo para Propostas</h4>
                    <p class="text-gray-900">{{ formatDate(form.bidding_ends_at) || 'Não informado' }}</p>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                  <h4 class="font-bold text-gray-700 mb-2">📝 Descrição</h4>
                  <p class="text-gray-900 whitespace-pre-wrap">{{ form.description || 'Não informado' }}</p>
                </div>

                <div v-if="form.requirements" class="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 class="font-bold text-gray-700 mb-2">⚙️ Requisitos</h4>
                  <p class="text-gray-900 whitespace-pre-wrap">{{ form.requirements }}</p>
                </div>
              </div>

              <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 class="font-bold text-green-900 mb-3">🚀 O que acontece depois da publicação:</h3>
                <ul class="text-green-800 space-y-2 text-sm">
                  <li>• Seu projeto ficará visível para todos os fornecedores</li>
                  <li>• Você começará a receber propostas qualificadas</li>
                  <li>• Poderá avaliar perfis e histórico dos candidatos</li>
                  <li>• Escolherá a melhor proposta para seu projeto</li>
                  <li>• Acompanhará o desenvolvimento até a entrega</li>
                </ul>
              </div>
            </div>

            <!-- Botões de Navegação -->
            <div class="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
              <button
                v-if="currentStep > 1"
                @click="currentStep--"
                type="button"
                class="inline-flex items-center px-6 py-3 border-2 border-gray-300 rounded-2xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Voltar
              </button>
              <div v-else></div>

              <div class="flex space-x-4">
                <button
                  type="button"
                  @click="resetForm"
                  class="px-6 py-3 border-2 border-gray-300 rounded-2xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
                >
                  🗑️ Limpar
                </button>
                
                <button
                  v-if="currentStep < 4"
                  @click="nextStep"
                  type="button"
                  class="inline-flex items-center px-8 py-3 border border-transparent rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transform hover:scale-105 transition-all"
                >
                  Próximo
                  <svg class="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button
                  v-if="currentStep === 4"
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex items-center px-8 py-3 border border-transparent rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="isSubmitting">Publicando...</span>
                  <span v-else>🚀 Publicar Projeto</span>
                </button>
              </div>
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
  name: 'ProjectCreate',
  components: {
    Layout,
    ValidationErrors
  },
  data() {
    return {
      currentStep: 1,
      isSubmitting: false,
      form: {
        title: '',
        category: '',
        urgency: 'medium',
        description: '',
        requirements: '',
        min_budget: null,
        max_budget: null,
        bidding_ends_at: ''
      }
    }
  },
  computed: {
    minDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().slice(0, 16)
    }
  },
  mounted() {
    // Definir data padrão para 7 dias a partir de hoje
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    this.form.bidding_ends_at = nextWeek.toISOString().slice(0, 16)
  },
  methods: {
    nextStep() {
      // Validação antes de avançar
      if (this.currentStep === 1) {
        if (!this.form.title || !this.form.category) {
          this.$page.props.errors = {
            title: !this.form.title ? 'O título é obrigatório' : null,
            category: !this.form.category ? 'A categoria é obrigatória' : null
          }
          return
        }
      }
      
      if (this.currentStep === 2) {
        if (!this.form.description || this.form.description.length < 20) {
          this.$page.props.errors = {
            description: 'A descrição deve ter pelo menos 20 caracteres'
          }
          return
        }
      }
      
      if (this.currentStep === 3) {
        if (!this.form.min_budget || !this.form.max_budget || !this.form.bidding_ends_at) {
          this.$page.props.errors = {
            min_budget: !this.form.min_budget ? 'O orçamento mínimo é obrigatório' : null,
            max_budget: !this.form.max_budget ? 'O orçamento máximo é obrigatório' : null,
            bidding_ends_at: !this.form.bidding_ends_at ? 'O prazo é obrigatório' : null
          }
          return
        }
        if (parseFloat(this.form.max_budget) <= parseFloat(this.form.min_budget)) {
          this.$page.props.errors = {
            max_budget: 'O orçamento máximo deve ser maior que o mínimo'
          }
          return
        }
      }
      
      // Limpar erros e avançar
      this.$page.props.errors = {}
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },
    handleStepSubmit() {
      if (this.currentStep === 4) {
        this.submitForm()
      } else {
        this.nextStep()
      }
    },
    submitForm() {
      this.isSubmitting = true
      
      this.$inertia.post('/projects', this.form, {
        onSuccess: () => {
          // Redirecionar será feito pelo controller
        },
        onError: () => {
          this.isSubmitting = false
        },
        onFinish: () => {
          this.isSubmitting = false
        }
      })
    },
    resetForm() {
      this.currentStep = 1
      this.form = {
        title: '',
        category: '',
        urgency: 'medium',
        description: '',
        requirements: '',
        min_budget: null,
        max_budget: null,
        bidding_ends_at: ''
      }
      
      // Redefinir data padrão
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      this.form.bidding_ends_at = nextWeek.toISOString().slice(0, 16)
    },
    formatCurrency(value) {
      if (value === null || value === undefined || isNaN(value)) {
        return '0'
      }
      return new Intl.NumberFormat('pt-BR').format(value)
    },
    formatDate(dateString) {
      if (!dateString) return 'Não informado'
      return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getCategoryName(category) {
      const categories = {
        'desenvolvimento-web': '🌐 Desenvolvimento Web',
        'design-grafico': '🎨 Design Gráfico',
        'marketing-digital': '📱 Marketing Digital',
        'redacao': '✍️ Redação',
        'traducao': '🌍 Tradução',
        'consultoria': '💼 Consultoria',
        'outros': '🔧 Outros'
      }
      return categories[category] || category
    }
  }
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>