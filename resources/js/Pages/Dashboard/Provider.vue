<template>
  <Layout>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Dashboard do Fornecedor</h1>
              <p class="mt-2 text-gray-600">
                Bem-vindo de volta, {{ user.name }}! Encontre novos projetos aqui.
              </p>
            </div>
            <Link href="/projects" 
                  class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Buscar Projetos
            </Link>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8V9a2 2 0 012-2h2a2 2 0 012 2v.93m-6 4v1a2 2 0 002 2h2a2 2 0 002-2V9.07m-6 4H9m1.5-2h2m0 0h2"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Total de Propostas</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.bids_total }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-full">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Propostas Ativas</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.bids_active }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Projetos Vencidos</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.projects_won }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-600">Total Faturado</p>
                <p class="text-2xl font-bold text-gray-900">R$ {{ formatMoney(stats.earnings) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div class="space-y-3">
              <Link href="/projects" 
                    class="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors">
                <svg class="w-8 h-8 text-green-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <div>
                  <h3 class="font-medium text-gray-900">Buscar Projetos</h3>
                  <p class="text-sm text-gray-600">Encontre projetos que combinam com você</p>
                </div>
              </Link>

              <Link href="/projects?status=open" 
                    class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors">
                <svg class="w-8 h-8 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8V9a2 2 0 012-2h2a2 2 0 012 2v.93m-6 4v1a2 2 0 002 2h2a2 2 0 002-2V9.07m-6 4H9m1.5-2h2m0 0h2"></path>
                </svg>
                <div>
                  <h3 class="font-medium text-gray-900">Minhas Propostas</h3>
                  <p class="text-sm text-gray-600">Gerencie suas propostas ativas</p>
                </div>
              </Link>

              <Link href="/profile" 
                    class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors">
                <svg class="w-8 h-8 text-purple-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <div>
                  <h3 class="font-medium text-gray-900">Meu Perfil</h3>
                  <p class="text-sm text-gray-600">Atualize suas habilidades</p>
                </div>
              </Link>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Oportunidades</h2>
            <div class="space-y-4">
              <div class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                <h3 class="font-medium text-gray-900 mb-2">🎯 Projetos Recomendados</h3>
                <p class="text-sm text-gray-600 mb-3">
                  Encontre projetos que combinam com suas habilidades
                </p>
                <Link href="/projects" 
                      class="inline-flex items-center text-sm text-orange-600 hover:text-orange-500 font-medium">
                  Ver projetos
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>

              <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 class="font-medium text-gray-900 mb-2">💡 Dica do Dia</h3>
                <p class="text-sm text-gray-600">
                  Mantenha seu perfil atualizado com suas melhores habilidades para receber mais convites.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Atividade Recente</h2>
            <Link href="/projects" class="text-green-600 hover:text-green-500 font-medium">
              Ver todos os projetos
            </Link>
          </div>
          
          <div class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8V9a2 2 0 012-2h2a2 2 0 012 2v.93m-6 4v1a2 2 0 002 2h2a2 2 0 002-2V9.07m-6 4H9m1.5-2h2m0 0h2"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Bem-vindo ao Kadesh!</h3>
            <p class="mt-2 text-gray-500">Comece explorando projetos disponíveis e enviando suas propostas.</p>
            <Link href="/projects" 
                  class="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
              Explorar Projetos
            </Link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import Layout from '../../Components/Layout.vue'
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  stats: {
    type: Object,
    required: true
  }
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value || 0)
}
</script>