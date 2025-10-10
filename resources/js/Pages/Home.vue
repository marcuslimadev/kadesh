<template>
  <Layout>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            O futuro dos 
            <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              projetos freelance
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Conectamos contratantes e fornecedores através de leilões reversos. 
            Encontre os melhores talentos pelos melhores preços.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" 
                  class="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105">
              Começar Agora
            </Link>
            <Link href="/projects" 
                  class="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200">
              Ver Projetos
            </Link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como funciona?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema de leilão reverso que garante os melhores preços e qualidade
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">1. Publique seu Projeto</h3>
            <p class="text-gray-600">
              Descreva seu projeto, defina o orçamento máximo e aguarde os lances dos fornecedores qualificados.
            </p>
          </div>

          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">2. Receba Lances</h3>
            <p class="text-gray-600">
              Fornecedores competem oferecendo seus melhores preços e prazos. Você economiza automaticamente.
            </p>
          </div>

          <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">3. Escolha o Vencedor</h3>
            <p class="text-gray-600">
              Analise as propostas, escolha o melhor fornecedor e inicie seu projeto com segurança total.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-blue-400 mb-2">1000+</div>
            <div class="text-gray-300">Projetos Concluídos</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-green-400 mb-2">500+</div>
            <div class="text-gray-300">Fornecedores Ativos</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-purple-400 mb-2">35%</div>
            <div class="text-gray-300">Economia Média</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-yellow-400 mb-2">24h</div>
            <div class="text-gray-300">Tempo Médio de Resposta</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Pronto para começar seu projeto?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Junte-se a milhares de empresas que já economizam com nosso sistema de leilão reverso.
        </p>
        <Link href="/register" 
              class="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105">
          Criar Conta Gratuita
        </Link>
      </div>
    </section>
  </Layout>
</template>

<script setup>
import Layout from '../Components/Layout.vue'
import { Link } from '@inertiajs/vue3'
</script>