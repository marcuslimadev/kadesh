<template>
  <div>
    <!-- Hero Section - Mobile First -->
    <section class="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
            O futuro dos 
            <span class="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent inline-block animate-pulse">
              projetos freelance
            </span>
          </h1>
          <p class="text-base sm:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            🚀 Conectamos contratantes e fornecedores através de leilões reversos. 
            Encontre os melhores talentos pelos melhores preços.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <router-link to="/register" 
                         class="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl">
              ⚡ Começar Agora
            </router-link>
            <router-link to="/projects" 
                         class="border-2 border-white bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg">
              📋 Ver Projetos
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section - Mobile First -->
    <section class="py-12 sm:py-20 bg-gradient-to-b from-white to-indigo-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            ✨ Como funciona?
          </h2>
          <p class="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Sistema de leilão reverso que garante os melhores preços e qualidade
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <!-- Card 1 -->
          <div class="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 sm:mb-4">1. 📝 Publique seu Projeto</h3>
            <p class="text-sm sm:text-base text-gray-700 font-medium">
              Descreva seu projeto, defina o orçamento máximo e aguarde os lances dos fornecedores qualificados.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 sm:mb-4">2. 💰 Receba Lances</h3>
            <p class="text-sm sm:text-base text-gray-700 font-medium">
              Fornecedores competem oferecendo seus melhores preços e prazos. Você economiza automaticamente.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 via-pink-600 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-extrabold text-gray-900 mb-3 sm:mb-4">3. ✅ Escolha o Vencedor</h3>
            <p class="text-sm sm:text-base text-gray-700 font-medium">
              Analise as propostas, escolha o melhor fornecedor e inicie seu projeto com segurança total.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section - Mobile Optimized -->
    <section class="py-12 sm:py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          <div class="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">1000+</div>
            <div class="text-sm sm:text-base text-blue-200 font-semibold">Projetos Concluídos</div>
          </div>
          <div class="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">500+</div>
            <div class="text-sm sm:text-base text-green-200 font-semibold">Fornecedores Ativos</div>
          </div>
          <div class="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">35%</div>
            <div class="text-sm sm:text-base text-purple-200 font-semibold">Economia Média</div>
          </div>
          <div class="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">24h</div>
            <div class="text-sm sm:text-base text-yellow-200 font-semibold">Tempo Médio</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Mobile First -->
    <section class="py-12 sm:py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6">
          🎯 Pronto para começar seu projeto?
        </h2>
        <p class="text-base sm:text-xl text-purple-100 mb-6 sm:mb-8 px-4">
          Junte-se a milhares de empresas que já economizam com nosso sistema de leilão reverso.
        </p>
        <router-link to="/register" 
                     class="inline-block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl">
          🚀 Criar Conta Gratuita
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
// Nenhuma lógica especial necessária para a home
</script>
