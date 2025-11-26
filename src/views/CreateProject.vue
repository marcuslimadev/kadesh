<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-3">✨ Criar Novo Projeto</h1>
        <p class="text-lg text-gray-600">Preencha os detalhes e receba propostas de profissionais qualificados</p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          <div v-for="(step, index) in steps" :key="index" class="flex items-center">
            <div class="flex flex-col items-center">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all',
                currentStep >= index + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              ]">
                {{ index + 1 }}
              </div>
              <span :class="[
                'mt-2 text-xs font-medium',
                currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
              ]">
                {{ step }}
              </span>
            </div>
            <div v-if="index < steps.length - 1" :class="[
              'w-16 h-1 mx-2 mb-6 transition-all',
              currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
            ]"></div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- Step 1: Informações Básicas -->
          <div v-show="currentStep === 1" class="space-y-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span class="text-2xl">📝</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Informações Básicas</h2>
                <p class="text-gray-600">Defina o título e a categoria do seu projeto</p>
              </div>
            </div>

            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                Título do Projeto *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.title }"
                placeholder="Ex: Desenvolvimento de site institucional para empresa"
              />
              <p v-if="errors.title" class="mt-2 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ errors.title }}
              </p>
              <p v-else class="mt-2 text-sm text-gray-500">
                💡 Seja claro e específico para atrair os profissionais certos
              </p>
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                v-model="form.category"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.category }"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Desenvolvimento Web">💻 Desenvolvimento Web</option>
                <option value="Design">🎨 Design</option>
                <option value="Marketing">📢 Marketing</option>
                <option value="Redação">✍️ Redação</option>
                <option value="Mobile">📱 Mobile</option>
                <option value="Consultoria">💼 Consultoria</option>
                <option value="Outros">📋 Outros</option>
              </select>
              <p v-if="errors.category" class="mt-2 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ errors.category }}
              </p>
            </div>
          </div>

          <!-- Step 2: Descrição Detalhada -->
          <div v-show="currentStep === 2" class="space-y-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span class="text-2xl">📋</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Descrição Detalhada</h2>
                <p class="text-gray-600">Quanto mais detalhes, melhores propostas você receberá</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                Descrição do Projeto *
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="8"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
                placeholder="Exemplo:

Preciso de um site institucional moderno e responsivo para minha empresa de consultoria. 

O site deve ter:
- Página inicial com apresentação da empresa
- Página de serviços detalhando nossas soluções
- Página sobre nós com histórico da empresa
- Formulário de contato integrado
- Blog para publicação de artigos

Preferência por design clean e profissional, com cores azul e branco."
              ></textarea>
              <div class="mt-2 flex items-center justify-between">
                <p :class="[
                  'text-sm',
                  form.description.length >= 50 ? 'text-green-600' : 'text-gray-500'
                ]">
                  {{ form.description.length }} / 2000 caracteres (mínimo 50)
                </p>
                <span v-if="form.description.length >= 50" class="text-green-600 text-sm flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  Ótimo!
                </span>
              </div>
              <p v-if="errors.description" class="mt-2 text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                {{ errors.description }}
              </p>
            </div>

            <!-- File Attachments -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Anexos (Fotos ou Vídeos) - Opcional
              </label>
              <div 
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                @click="$refs.fileInput.click()"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleFileDrop"
                :class="{ 'border-blue-500 bg-blue-50': isDragging }"
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-gray-600 font-medium">Arraste arquivos ou clique para selecionar</p>
                <p class="text-sm text-gray-500 mt-1">Suporta imagens e vídeos (máximo 10MB por arquivo)</p>
              </div>
              
              <!-- Preview dos arquivos selecionados -->
              <div v-if="form.attachments.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  v-for="(file, index) in form.attachments" 
                  :key="index"
                  class="relative group"
                >
                  <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      v-if="file.type.startsWith('image/')"
                      :src="file.preview" 
                      :alt="file.name"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center">
                      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs text-gray-500 mt-1 px-2 truncate w-full text-center">{{ file.name }}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="errors.attachments" class="mt-2 text-sm text-red-600">{{ errors.attachments }}</p>
            </div>

            <!-- Requirements -->
            <div>
              <label for="requirements" class="block text-sm font-semibold text-gray-700 mb-2">
                Requisitos Técnicos (Opcional)
              </label>
              <textarea
                id="requirements"
                v-model="form.requirements"
                rows="4"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ex: Deve ser desenvolvido em WordPress, compatível com todos os navegadores, otimizado para SEO..."
              ></textarea>
              <p class="mt-2 text-sm text-gray-500">
                💡 Informe tecnologias específicas, critérios de aceitação ou integrações necessárias
              </p>
            </div>
          </div>

          <!-- Step 3: Orçamento e Prazo -->
          <div v-show="currentStep === 3" class="space-y-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span class="text-2xl">💰</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Orçamento e Prazo</h2>
                <p class="text-gray-600">Defina quanto pode investir e quando precisa do projeto</p>
              </div>
            </div>

            <!-- Budget and Deadline -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Budget -->
              <div>
                <label for="budget" class="block text-sm font-semibold text-gray-700 mb-2">
                  Orçamento (R$) *
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-3 text-gray-500 font-medium">R$</span>
                  <input
                    id="budget"
                    v-model.number="form.budget"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    :class="{ 'border-red-500 focus:ring-red-500': errors.budget }"
                    placeholder="0,00"
                  />
                </div>
                <p v-if="errors.budget" class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  {{ errors.budget }}
                </p>
                <p v-else class="mt-2 text-sm text-gray-500">
                  💡 Este é o valor máximo que você está disposto a pagar
                </p>
              </div>

              <!-- Deadline -->
              <div>
                <label for="deadline" class="block text-sm font-semibold text-gray-700 mb-2">
                  Prazo de Entrega (Data e Hora)
                </label>
                <input
                  id="deadline"
                  v-model="form.deadline"
                  type="datetime-local"
                  :min="minDateTime"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :class="{ 'border-red-500 focus:ring-red-500': errors.deadline }"
                />
                <p v-if="errors.deadline" class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  {{ errors.deadline }}
                </p>
                <p v-else class="mt-2 text-sm text-gray-500">
                  💡 Defina a data e hora limite para o encerramento do leilão
                </p>
              </div>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                Prioridade do Projeto
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="priority in priorities"
                  :key="priority.value"
                  type="button"
                  @click="form.priority = priority.value"
                  :class="[
                    'flex flex-col items-center p-4 border-2 rounded-xl transition-all transform hover:scale-105',
                    form.priority === priority.value
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  ]"
                >
                  <span class="text-3xl mb-2">{{ priority.icon }}</span>
                  <span :class="[
                    'text-sm font-bold',
                    form.priority === priority.value ? 'text-blue-600' : 'text-gray-700'
                  ]">
                    {{ priority.label }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Habilidades -->
          <div v-show="currentStep === 4" class="space-y-6">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span class="text-2xl">🎯</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Habilidades Necessárias</h2>
                <p class="text-gray-600">Quais competências o profissional deve ter?</p>
              </div>
            </div>

            <!-- Skills Required -->
            <div>
              <label for="skills" class="block text-sm font-semibold text-gray-700 mb-2">
                Adicionar Habilidades
              </label>
              <div class="flex gap-2 mb-4">
                <input
                  v-model="skillInput"
                  type="text"
                  placeholder="Ex: React, Node.js, Figma, SEO..."
                  class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  @keypress.enter.prevent="addSkill"
                />
                <button
                  type="button"
                  @click="addSkill"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all transform hover:scale-105 flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Adicionar
                </button>
              </div>
              
              <div v-if="form.skills_required.length > 0" class="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p class="text-sm font-medium text-gray-700 mb-3">Habilidades selecionadas:</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(skill, index) in form.skills_required"
                    :key="index"
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-all hover:bg-blue-200"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeSkill(index)"
                      class="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <div v-else class="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <p class="text-sm text-yellow-800 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  Adicione pelo menos uma habilidade para ajudar os profissionais a entenderem seu projeto
                </p>
              </div>
            </div>

            <!-- Suggested Skills -->
            <div>
              <p class="text-sm font-medium text-gray-700 mb-3">Sugestões populares:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="suggestion in suggestedSkills"
                  :key="suggestion"
                  type="button"
                  @click="addSuggestedSkill(suggestion)"
                  class="px-3 py-1.5 text-sm bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all"
                  :disabled="form.skills_required.includes(suggestion)"
                  :class="{ 'opacity-50 cursor-not-allowed': form.skills_required.includes(suggestion) }"
                >
                  + {{ suggestion }}
                </button>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errors.general" class="rounded-lg bg-red-50 p-4 border-2 border-red-200">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">{{ errors.general }}</p>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="prevStep"
              class="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Voltar
            </button>
            
            <button
              v-if="currentStep === 1"
              type="button"
              @click="$router.push('/dashboard')"
              class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
            >
              Cancelar
            </button>

            <button
              v-if="currentStep < 4"
              type="button"
              @click="nextStep"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Próximo
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <button
              v-if="currentStep === 4"
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ isSubmitting ? 'Criando Projeto...' : 'Criar Projeto e Publicar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Help Card -->
      <div class="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-bold mb-2">💡 Dicas para um projeto bem-sucedido</h3>
            <ul class="space-y-1 text-sm text-blue-100">
              <li>✓ Seja específico sobre o que você precisa</li>
              <li>✓ Defina um orçamento realista baseado no mercado</li>
              <li>✓ Adicione exemplos ou referências se possível</li>
              <li>✓ Responda rapidamente às propostas dos profissionais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import projectService from '@/services/projectService'

const router = useRouter()
const toast = useToast()

const currentStep = ref(1)
const steps = ['Básico', 'Descrição', 'Orçamento', 'Habilidades']

const form = reactive({
  title: '',
  description: '',
  category: '',
  budget: '',
  deadline: '',
  requirements: '',
  skills_required: [],
  priority: 3,
  attachments: []
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  budget: '',
  deadline: '',
  attachments: '',
  general: ''
})

const skillInput = ref('')
const isSubmitting = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)

// File handling functions
const handleFileSelect = (event) => {
  const files = event.target.files
  addFiles(files)
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  addFiles(files)
}

const addFiles = (files) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const maxFiles = 10
  
  for (const file of files) {
    if (form.attachments.length >= maxFiles) {
      toast.warning('Máximo de 10 arquivos permitidos')
      break
    }
    
    if (file.size > maxSize) {
      toast.error(`Arquivo ${file.name} excede o limite de 10MB`)
      continue
    }
    
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error(`Arquivo ${file.name} não é uma imagem ou vídeo válido`)
      continue
    }
    
    // Create preview URL for images
    const fileWithPreview = {
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }
    
    form.attachments.push(fileWithPreview)
  }
}

const removeFile = (index) => {
  const file = form.attachments[index]
  if (file.preview) {
    URL.revokeObjectURL(file.preview)
  }
  form.attachments.splice(index, 1)
}

// Cleanup blob URLs when component unmounts
const cleanupAttachments = () => {
  form.attachments.forEach(attachment => {
    if (attachment.preview) {
      URL.revokeObjectURL(attachment.preview)
    }
  })
}

onUnmounted(() => {
  cleanupAttachments()
})

const priorities = [
  { value: 1, label: 'Urgente', icon: '🔥', color: 'text-red-500' },
  { value: 2, label: 'Alta', icon: '⚡', color: 'text-orange-500' },
  { value: 3, label: 'Normal', icon: '📌', color: 'text-blue-500' },
  { value: 4, label: 'Baixa', icon: '📋', color: 'text-gray-500' }
]

const suggestedSkills = [
  'HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Node.js', 
  'Python', 'PHP', 'WordPress', 'Figma', 'Photoshop',
  'SEO', 'Marketing Digital', 'Copywriting', 'Design Gráfico'
]

const minDateTime = computed(() => {
  const now = new Date()
  now.setHours(now.getHours() + 1) // Minimum 1 hour from now
  // Format as YYYY-MM-DDTHH:MM for datetime-local input
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})

const nextStep = () => {
  // Validate current step before proceeding
  if (currentStep.value === 1) {
    if (!form.title.trim() || form.title.length < 10) {
      errors.title = 'Título deve ter pelo menos 10 caracteres'
      return
    }
    if (!form.category) {
      errors.category = 'Selecione uma categoria'
      return
    }
    errors.title = ''
    errors.category = ''
  }
  
  if (currentStep.value === 2) {
    if (!form.description.trim() || form.description.length < 50) {
      errors.description = 'Descrição deve ter pelo menos 50 caracteres'
      return
    }
    errors.description = ''
  }
  
  if (currentStep.value === 3) {
    if (!form.budget || form.budget <= 0) {
      errors.budget = 'Orçamento deve ser maior que zero'
      return
    }
    errors.budget = ''
  }
  
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const addSkill = () => {
  const skill = skillInput.value.trim()
  if (skill && !form.skills_required.includes(skill)) {
    form.skills_required.push(skill)
    skillInput.value = ''
  }
}

const addSuggestedSkill = (skill) => {
  if (!form.skills_required.includes(skill)) {
    form.skills_required.push(skill)
  }
}

const removeSkill = (index) => {
  form.skills_required.splice(index, 1)
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate title
  if (!form.title.trim()) {
    errors.title = 'Título é obrigatório'
    isValid = false
  } else if (form.title.length < 10) {
    errors.title = 'Título deve ter pelo menos 10 caracteres'
    isValid = false
  }

  // Validate description
  if (!form.description.trim()) {
    errors.description = 'Descrição é obrigatória'
    isValid = false
  } else if (form.description.length < 50) {
    errors.description = 'Descrição deve ter pelo menos 50 caracteres'
    isValid = false
  }

  // Validate category
  if (!form.category) {
    errors.category = 'Categoria é obrigatória'
    isValid = false
  }

  // Validate budget
  if (!form.budget || form.budget <= 0) {
    errors.budget = 'Orçamento deve ser maior que zero'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Por favor, corrija os erros antes de continuar')
    return
  }

  isSubmitting.value = true

  try {
    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      budget: parseFloat(form.budget),
      deadline: form.deadline || null,
      requirements: form.requirements.trim() || null,
      skills_required: form.skills_required,
      priority: form.priority
    }

    const result = await projectService.createProject(projectData)

    if (result.success) {
      // Upload attachments if any
      if (form.attachments.length > 0) {
        await uploadAttachments(result.data.project.id)
      }
      
      toast.success('🎉 Projeto criado com sucesso! Agora você receberá propostas de profissionais qualificados.')
      router.push(`/projects/${result.data.project.id}`)
    } else {
      errors.general = result.error
      toast.error(result.error)
    }
  } catch (error) {
    errors.general = 'Erro ao criar projeto. Tente novamente.'
    toast.error('Erro ao criar projeto. Tente novamente.')
  } finally {
    isSubmitting.value = false
  }
}

// Upload attachments after project creation
const uploadAttachments = async (projectId) => {
  const uploadPromises = form.attachments.map(attachment => 
    projectService.uploadAttachment(projectId, attachment.file)
  )
  
  const results = await Promise.allSettled(uploadPromises)
  const failedUploads = results.filter(r => r.status === 'rejected' || !r.value?.success)
  
  if (failedUploads.length > 0) {
    toast.warning(`${failedUploads.length} arquivo(s) não puderam ser enviados`)
  }
  
  // Clean up blob URLs after upload completes
  cleanupAttachments()
}
</script>
