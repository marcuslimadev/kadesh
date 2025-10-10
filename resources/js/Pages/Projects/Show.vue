<template>
  <Layout>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header com navegação -->
        <div class="flex justify-between items-center mb-8">
          <button 
            @click="$inertia.visit('/projects')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Voltar aos Projetos
          </button>
          
          <div class="flex space-x-4" v-if="canManageProject">
            <button
              @click="editProject"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Editar
            </button>
            
            <button
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Excluir
            </button>
          </div>
        </div>

        <!-- Card principal do projeto -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ project.title }}</h1>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  Criado por {{ project.contractor?.name }} em {{ formatDate(project.created_at) }}
                </p>
              </div>
              <span :class="statusClass" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {{ statusText }}
              </span>
            </div>
          </div>
          
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Categoria</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ project.category }}</dd>
              </div>
              
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Orçamento</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  R$ {{ formatCurrency(project.min_budget) }} - R$ {{ formatCurrency(project.max_budget) }}
                </dd>
              </div>
              
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Prazo para propostas</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {{ formatDate(project.bidding_ends_at) }}
                  <span v-if="isExpired" class="ml-2 text-red-600 font-medium">(Expirado)</span>
                  <span v-else class="ml-2 text-green-600 font-medium">({{ timeRemaining }})</span>
                </dd>
              </div>
              
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Descrição</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{{ project.description }}</dd>
              </div>
              
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="project.requirements">
                <dt class="text-sm font-medium text-gray-500">Requisitos</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{{ project.requirements }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Estatísticas das propostas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total de Propostas</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ bids.length }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg" v-if="lowest">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Menor Proposta</dt>
                    <dd class="text-lg font-medium text-gray-900">R$ {{ formatCurrency(lowest) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg" v-if="winnerCandidate">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Candidato a Vencedor</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ winnerCandidate.name }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Status</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ statusText }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de propostas -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md" v-if="bids.length > 0">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Propostas Recebidas</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ bids.length }} propostas ordenadas por valor</p>
          </div>
          <ul class="divide-y divide-gray-200">
            <li v-for="bid in bids" :key="bid.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ bid.provider?.name?.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ bid.provider?.name }}</div>
                    <div class="text-sm text-gray-500">Enviado em {{ formatDate(bid.submitted_at) }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-right mr-4">
                    <div class="text-sm font-medium text-gray-900">R$ {{ formatCurrency(bid.amount) }}</div>
                    <div class="text-sm text-gray-500">{{ bid.delivery_time }} dias</div>
                  </div>
                  <span v-if="bid.amount === lowest" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Menor valor
                  </span>
                </div>
              </div>
              <div v-if="bid.proposal" class="mt-2 text-sm text-gray-700">
                {{ bid.proposal }}
              </div>
            </li>
          </ul>
        </div>

        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta ainda</h3>
          <p class="mt-1 text-sm text-gray-500">Este projeto ainda não recebeu propostas.</p>
        </div>

        <!-- Mensagem informativa se não puder enviar propostas -->
        <div v-if="!canSendProposal && $page.props.auth.user" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                {{ proposalStatusMessage }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Call to action para usuários não logados -->
        <div v-if="!$page.props.auth.user" class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mt-8">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Interessado neste projeto?</h3>
            <p class="mt-1 text-sm text-gray-600">
              Faça login ou cadastre-se como <strong>Fornecedor</strong> para enviar sua proposta e começar a trabalhar!
            </p>
            <div class="mt-4 flex justify-center space-x-4">
              <button
                @click="$inertia.visit('/login')"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Fazer Login
              </button>
              <button
                @click="$inertia.visit('/register')"
                class="inline-flex items-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cadastrar-se
              </button>
            </div>
          </div>
        </div>

        <!-- Debug simples -->
        <div v-if="$page.props.auth.user && $page.props.auth.user.user_type === 'provider'" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>✅ Você é um fornecedor! O formulário deve aparecer abaixo.</strong>
        </div>

        <!-- Formulário para enviar propostas (apenas se for fornecedor e projeto ainda aberto) -->
        <div v-if="$page.props.auth.user && $page.props.auth.user.user_type === 'provider' && project.status === 'open' && !isExpired" class="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Enviar Proposta</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Faça sua proposta para este projeto. Seja detalhado e competitivo!
            </p>
          </div>
          
          <!-- Barra de Progresso -->
          <div class="px-6 pt-6">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium', 
                              currentStep >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 1">✓</span>
                    <span v-else>1</span>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900">Valor & Prazo</span>
                </div>
                <div class="hidden sm:block w-20 h-0.5 bg-gray-200">
                  <div :class="['h-full transition-all duration-300', currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200']"></div>
                </div>
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium', 
                              currentStep >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 2">✓</span>
                    <span v-else>2</span>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900">Proposta</span>
                </div>
                <div class="hidden sm:block w-20 h-0.5 bg-gray-200">
                  <div :class="['h-full transition-all duration-300', currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200']"></div>
                </div>
                <div class="flex items-center">
                  <div :class="['flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium', 
                              currentStep >= 3 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-500']">
                    <span v-if="currentStep > 3">✓</span>
                    <span v-else>3</span>
                  </div>
                  <span class="ml-2 text-sm font-medium text-gray-900">Revisão</span>
                </div>
              </div>
              <div class="text-sm text-gray-500">{{ currentStep }}/3</div>
            </div>
          </div>

          <form @submit.prevent="handleStepSubmit" class="p-6 space-y-6">
            <ValidationErrors :errors="$page.props.errors" />
            
            <!-- Passo 1: Valor e Prazo -->
            <div v-show="currentStep === 1" class="space-y-6">
              <div class="text-center mb-6">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Defina seu valor e prazo</h3>
                <p class="text-sm text-gray-600">Seja competitivo mas justo com seus preços</p>
              </div>

              <!-- Valor da proposta -->
              <div>
                <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
                  💰 Valor da Proposta (R$)
                </label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">R$</span>
                  </div>
                  <input
                    id="amount"
                    v-model.number="proposalForm.amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    :max="project.max_budget"
                    required
                    class="block w-full pl-12 pr-12 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-lg font-medium"
                    :placeholder="`Entre R$ ${formatCurrency(project.min_budget)} e R$ ${formatCurrency(project.max_budget)}`"
                  />
                </div>
                <p class="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  📊 <strong>Orçamento do projeto:</strong> R$ {{ formatCurrency(project.min_budget) }} - R$ {{ formatCurrency(project.max_budget) }}
                </p>
              </div>

              <!-- Prazo de entrega -->
              <div>
                <label for="delivery_time" class="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ Prazo de Entrega (dias)
                </label>
                <input
                  id="delivery_time"
                  v-model.number="proposalForm.delivery_time"
                  type="number"
                  min="1"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-lg font-medium"
                  placeholder="Ex: 30"
                />
                <p class="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  📅 <strong>Dica:</strong> Seja realista com o prazo. Considere revisões e ajustes.
                </p>
              </div>
            </div>

            <!-- Passo 2: Descrição da Proposta -->
            <div v-show="currentStep === 2" class="space-y-6">
              <div class="text-center mb-6">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Descreva sua proposta</h3>
                <p class="text-sm text-gray-600">Convença o cliente de que você é a melhor opção</p>
              </div>

              <div>
                <label for="proposal" class="block text-sm font-medium text-gray-700 mb-2">
                  📝 Descrição Detalhada da Proposta
                </label>
                <textarea
                  id="proposal"
                  v-model="proposalForm.proposal"
                  rows="8"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Exemplo:

🎯 COMO VOU EXECUTAR:
- Análise detalhada dos requisitos
- Desenvolvimento em etapas com entregas parciais
- Testes rigorosos antes da entrega final

💡 MINHA EXPERIÊNCIA:
- 5 anos desenvolvendo sistemas similares
- Especialista em [tecnologias relevantes]

📦 ENTREGÁVEIS:
- Código fonte completo
- Documentação técnica
- Suporte pós-entrega por 30 dias

Por que me escolher?
[Destaque seus diferenciais únicos]"
                ></textarea>
                <div class="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Mínimo 50 caracteres</span>
                  <span>{{ proposalForm.proposal.length }}/1000 caracteres</span>
                </div>
                
                <div class="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 class="text-sm font-medium text-blue-900 mb-2">💡 Dicas para uma proposta vencedora:</h4>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Demonstre entendimento claro do projeto</li>
                    <li>• Cite experiências relevantes</li>
                    <li>• Detalhe sua metodologia de trabalho</li>
                    <li>• Ofereça algo além do básico (bônus, garantias)</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Passo 3: Revisão Final -->
            <div v-show="currentStep === 3" class="space-y-6">
              <div class="text-center mb-6">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Revise sua proposta</h3>
                <p class="text-sm text-gray-600">Confirme todos os dados antes de enviar</p>
              </div>

              <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h4 class="font-medium text-gray-900 mb-4">📋 Resumo da sua proposta:</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="text-2xl">💰</span>
                      <div>
                        <p class="text-sm text-gray-600">Valor</p>
                        <p class="text-xl font-bold text-green-600">R$ {{ formatCurrency(proposalForm.amount || 0) }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="text-2xl">⏰</span>
                      <div>
                        <p class="text-sm text-gray-600">Prazo</p>
                        <p class="text-xl font-bold text-blue-600">{{ proposalForm.delivery_time || 0 }} dias</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <p class="text-sm text-gray-600 mb-2">Descrição da proposta:</p>
                  <p class="text-sm text-gray-800 whitespace-pre-wrap">{{ proposalForm.proposal || 'Nenhuma descrição ainda...' }}</p>
                </div>
              </div>

              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">⚠️ Importante</h3>
                    <p class="mt-1 text-sm text-yellow-700">
                      Após enviar, você não poderá mais editar esta proposta. Certifique-se de que todos os dados estão corretos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botões de Navegação -->
            <div class="flex justify-between pt-6 border-t border-gray-200">
              <button
                v-if="currentStep > 1"
                @click="currentStep--"
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Voltar
              </button>
              <div v-else></div>

              <div class="flex space-x-3">
                <button
                  type="button"
                  @click="resetProposalForm"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  🗑️ Limpar
                </button>
                
                <button
                  v-if="currentStep < 3"
                  @click="nextStep"
                  type="button"
                  class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Próximo
                  <svg class="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <button
                  v-if="currentStep === 3"
                  type="submit"
                  :disabled="submittingProposal"
                  class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="submittingProposal" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="submittingProposal">Enviando...</span>
                  <span v-else>🚀 Enviar Proposta</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Como funciona - Seção informativa -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            <svg class="inline-block w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Como funciona o processo de propostas
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
                <span class="text-indigo-600 font-bold">1</span>
              </div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Envie sua proposta</h4>
              <p class="text-xs text-gray-600">
                Fornecedores podem enviar propostas com valor, prazo e descrição detalhada do trabalho.
              </p>
            </div>
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
                <span class="text-indigo-600 font-bold">2</span>
              </div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Avaliação</h4>
              <p class="text-xs text-gray-600">
                O contratante analisa todas as propostas recebidas e escolhe a que melhor atende suas necessidades.
              </p>
            </div>
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-3">
                <span class="text-indigo-600 font-bold">3</span>
              </div>
              <h4 class="text-sm font-medium text-gray-900 mb-2">Execução</h4>
              <p class="text-xs text-gray-600">
                Após a aprovação, o fornecedor executa o projeto conforme acordado e entrega no prazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-2">Confirmar Exclusão</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteProject"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Excluir
            </button>
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../../Components/Layout.vue'
import ValidationErrors from '../../Components/ValidationErrors.vue'

export default {
  name: 'ProjectShow',
  components: {
    Layout,
    ValidationErrors
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    bids: {
      type: Array,
      default: () => []
    },
    lowest: {
      type: [Number, String],
      default: null
    },
    winnerCandidate: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showDeleteModal: false,
      submittingProposal: false,
      currentStep: 1,
      proposalForm: {
        project_id: this.project.id,
        amount: null,
        delivery_time: null,
        proposal: ''
      }
    }
  },
  computed: {
    canManageProject() {
      return this.$page.props.auth.user && this.$page.props.auth.user.id === this.project.contractor_id
    },
    canSendProposal() {
      const user = this.$page.props.auth.user
      if (!user) return false
      
      // Não pode ser o dono do projeto
      if (user.id === this.project.contractor_id) return false
      
      // Projeto deve estar aberto
      if (this.project.status !== 'open') return false
      
      // Prazo não deve ter expirado
      if (this.isExpired) return false
      
      // Não deve ter proposta já enviada
      const existingBid = this.bids.find(bid => bid.provider_id === user.id)
      if (existingBid) return false
      
      // Deve ser fornecedor
      return user.user_type === 'provider'
    },
    proposalStatusMessage() {
      const user = this.$page.props.auth.user
      if (!user) return ''
      
      if (user.id === this.project.contractor_id) {
        return 'Você é o dono deste projeto e não pode enviar propostas para si mesmo.'
      }
      
      if (this.project.status !== 'open') {
        return 'Este projeto não está mais aceitando propostas. Status atual: ' + this.statusText
      }
      
      if (this.isExpired) {
        return 'O prazo para envio de propostas já expirou em ' + this.formatDate(this.project.bidding_ends_at)
      }
      
      const existingBid = this.bids.find(bid => bid.provider_id === user.id)
      if (existingBid) {
        return 'Você já enviou uma proposta para este projeto. Aguarde a avaliação do contratante.'
      }
      
      if (user.user_type !== 'provider') {
        return 'Apenas fornecedores podem enviar propostas. Você está logado como "Contratante". Para oferecer serviços, atualize seu perfil para "Fornecedor".'
      }
      
      return ''
    },
    statusText() {
      const statusMap = {
        'open': 'Aberto',
        'closed': 'Fechado',
        'awarded': 'Adjudicado',
        'in_progress': 'Em Andamento',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
      }
      return statusMap[this.project.status] || this.project.status
    },
    statusClass() {
      const classMap = {
        'open': 'bg-green-100 text-green-800',
        'closed': 'bg-gray-100 text-gray-800',
        'awarded': 'bg-blue-100 text-blue-800',
        'in_progress': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-purple-100 text-purple-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classMap[this.project.status] || 'bg-gray-100 text-gray-800'
    },
    isExpired() {
      return new Date(this.project.bidding_ends_at) < new Date()
    },
    timeRemaining() {
      const now = new Date()
      const endDate = new Date(this.project.bidding_ends_at)
      const diff = endDate - now
      
      if (diff <= 0) return 'Expirado'
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      
      if (days > 0) {
        return `${days} dia${days > 1 ? 's' : ''} restante${days > 1 ? 's' : ''}`
      } else {
        return `${hours} hora${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}`
      }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatCurrency(value) {
      if (value === null || value === undefined || isNaN(value)) {
        return '0'
      }
      return new Intl.NumberFormat('pt-BR').format(value)
    },
    editProject() {
      this.$inertia.visit(`/projects/${this.project.id}/edit`)
    },
    confirmDelete() {
      this.showDeleteModal = true
    },
    deleteProject() {
      this.$inertia.delete(`/projects/${this.project.id}`, {
        onSuccess: () => {
          this.$inertia.visit('/projects')
        }
      })
    },
    submitProposal() {
      this.submittingProposal = true
      
      this.$inertia.post('/bids', this.proposalForm, {
        onSuccess: () => {
          this.resetProposalForm()
          // Recarregar página para mostrar a nova proposta
          this.$inertia.reload()
        },
        onError: () => {
          this.submittingProposal = false
        },
        onFinish: () => {
          this.submittingProposal = false
        }
      })
    },
    resetProposalForm() {
      this.currentStep = 1
      this.proposalForm = {
        project_id: this.project.id,
        amount: null,
        delivery_time: null,
        proposal: ''
      }
    },
    nextStep() {
      // Validação antes de avançar
      if (this.currentStep === 1) {
        if (!this.proposalForm.amount || !this.proposalForm.delivery_time) {
          this.$page.props.errors = { 
            amount: !this.proposalForm.amount ? 'O valor é obrigatório' : null,
            delivery_time: !this.proposalForm.delivery_time ? 'O prazo é obrigatório' : null
          }
          return
        }
        if (this.proposalForm.amount < this.project.min_budget || this.proposalForm.amount > this.project.max_budget) {
          this.$page.props.errors = { 
            amount: `O valor deve estar entre R$ ${this.formatCurrency(this.project.min_budget)} e R$ ${this.formatCurrency(this.project.max_budget)}`
          }
          return
        }
      }
      
      if (this.currentStep === 2) {
        if (!this.proposalForm.proposal || this.proposalForm.proposal.length < 50) {
          this.$page.props.errors = { 
            proposal: 'A descrição deve ter pelo menos 50 caracteres'
          }
          return
        }
      }
      
      // Limpar erros e avançar
      this.$page.props.errors = {}
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },
    handleStepSubmit() {
      if (this.currentStep === 3) {
        this.submitProposal()
      } else {
        this.nextStep()
      }
    }
  }
}
</script>
