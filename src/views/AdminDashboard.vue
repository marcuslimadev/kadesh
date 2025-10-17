<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <!-- Modern Header -->
    <div class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span class="text-2xl">👑</span>
              </div>
              <div>
                <h1 class="text-3xl md:text-4xl font-black">Painel Administrativo</h1>
                <p class="text-purple-100 font-semibold">Bem-vindo, <span class="text-yellow-300">{{ adminName }}</span></p>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <router-link
              to="/admin/settings"
              class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-bold transition-all border-2 border-white/20 hover:border-white/40 flex items-center gap-2"
            >
              <span>⚙️</span>
              <span class="hidden sm:inline">Configurações</span>
            </router-link>
            <button
              @click="handleLogout"
              class="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>🚪</span>
              <span class="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="relative inline-block mb-6">
          <div class="w-20 h-20 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div class="absolute inset-0 w-20 h-20 border-8 border-transparent border-r-pink-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
          Carregando estatísticas...
        </p>
      </div>

      <template v-else>
        <!-- KPIs Principais - Redesign Moderno -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Usuários -->
          <div class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 border-4 border-transparent hover:border-blue-300 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <span class="text-3xl">👥</span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Usuários</p>
                <p class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">{{ stats.users?.total || 0 }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t-2 border-blue-100">
              <span class="text-xs text-gray-600 font-bold">Novos este mês</span>
              <span class="text-sm font-black text-green-600 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                +{{ stats.users?.new_this_month || 0 }}
              </span>
            </div>
          </div>

          <!-- Projetos -->
          <div class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 border-4 border-transparent hover:border-purple-300 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <span class="text-3xl">📋</span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Projetos</p>
                <p class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mt-1">{{ stats.projects?.total || 0 }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t-2 border-purple-100">
              <span class="text-xs text-gray-600 font-bold">Abertos agora</span>
              <span class="text-sm font-black text-purple-600">{{ stats.projects?.open || 0 }} ativos</span>
            </div>
          </div>

          <!-- Receita -->
          <div class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 border-4 border-transparent hover:border-green-300 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <span class="text-3xl">💰</span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Receita</p>
                <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mt-1">
                  R$ {{ formatMoney(stats.payments?.platform_fee || 0) }}
                </p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t-2 border-green-100">
              <span class="text-xs text-gray-600 font-bold">Este mês</span>
              <span class="text-sm font-black text-green-600">R$ {{ formatMoney(stats.payments?.revenue_this_month || 0) }}</span>
            </div>
          </div>

          <!-- Avaliações -->
          <div class="group bg-white rounded-3xl shadow-xl hover:shadow-2xl p-8 border-4 border-transparent hover:border-yellow-300 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>
            <div class="flex items-start justify-between mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <span class="text-3xl">⭐</span>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Avaliações</p>
                <p class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mt-1">{{ stats.reviews?.total || 0 }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t-2 border-yellow-100">
              <span class="text-xs text-gray-600 font-bold">Média geral</span>
              <span class="text-sm font-black text-yellow-600 flex items-center gap-1">
                ⭐ {{ (stats.reviews?.average_rating || 0).toFixed(1) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detalhes Secundários -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Usuários Detalhado -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              👥 Usuários por Tipo
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">🔨 Fornecedores</span>
                <span class="font-bold text-purple-600">{{ stats.users?.providers || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">🏢 Contratantes</span>
                <span class="font-bold text-blue-600">{{ stats.users?.contractors || 0 }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                <span class="text-gray-900 font-medium">Total</span>
                <span class="font-bold text-gray-900">{{ stats.users?.total || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Projetos Detalhado -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📋 Status dos Projetos
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">🟢 Abertos</span>
                <span class="font-bold text-green-600">{{ stats.projects?.open || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">🟡 Em Andamento</span>
                <span class="font-bold text-yellow-600">{{ stats.projects?.in_progress || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">✅ Concluídos</span>
                <span class="font-bold text-blue-600">{{ stats.projects?.completed || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Pagamentos Detalhado -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              💳 Resumo Financeiro
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Transações</span>
                <span class="font-bold text-gray-900">{{ stats.payments?.total || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Volume Total</span>
                <span class="font-bold text-green-600">R$ {{ formatMoney(stats.payments?.total_amount || 0) }}</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                <span class="text-gray-900 font-medium">Taxa Plataforma</span>
                <span class="font-bold text-purple-600">R$ {{ formatMoney(stats.payments?.platform_fee || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Atividade Recente -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📊 Atividade (Últimos 7 dias)
          </h3>
          <div v-if="stats.activity && stats.activity.length > 0" class="space-y-2">
            <div
              v-for="day in stats.activity"
              :key="day.date"
              class="flex items-center gap-4"
            >
              <span class="text-sm text-gray-600 w-24">{{ formatDate(day.date) }}</span>
              <div class="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-purple-500 to-blue-500 h-full flex items-center justify-end px-3 text-white text-sm font-bold"
                  :style="{ width: getBarWidth(day.count) + '%' }"
                >
                  {{ day.count }}
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-center py-4">Sem atividade recente</p>
        </div>

        <!-- Ações Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link
            to="/admin/users"
            class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <div class="text-4xl mb-3">👥</div>
            <h3 class="text-xl font-bold mb-2">Gerenciar Usuários</h3>
            <p class="text-blue-100 text-sm">Visualizar e administrar todos os usuários</p>
          </router-link>

          <router-link
            to="/admin/projects"
            class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <div class="text-4xl mb-3">�</div>
            <h3 class="text-xl font-bold mb-2">Gerenciar Projetos</h3>
            <p class="text-purple-100 text-sm">Todos os projetos da plataforma</p>
          </router-link>

          <router-link
            to="/admin/payments"
            class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            <div class="text-4xl mb-3">💳</div>
            <h3 class="text-xl font-bold mb-2">Ver Pagamentos</h3>
            <p class="text-green-100 text-sm">Histórico completo de transações</p>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const stats = ref({})
const loading = ref(true)
const adminName = ref(localStorage.getItem('adminName') || 'Admin')

const maxActivity = computed(() => {
  if (!stats.value.activity || stats.value.activity.length === 0) return 1
  return Math.max(...stats.value.activity.map(d => d.count))
})

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const getBarWidth = (count) => {
  return (count / maxActivity.value) * 100
}

const loadStats = async () => {
  loading.value = true
  try {
    const response = await axios.get('/kadesh/api/admin/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  try {
    await axios.post('/kadesh/api/admin/logout')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  } finally {
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('adminName')
    router.push('/admin/login')
  }
}

onMounted(() => {
  // Verificar se está logado como admin
  if (!localStorage.getItem('isAdmin')) {
    router.push('/admin/login')
    return
  }
  loadStats()
})
</script>
