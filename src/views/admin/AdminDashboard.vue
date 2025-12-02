<template>
  <AdminLayout>
    <!-- Page Header -->
    <template #header>
      <div>
        <h1 class="admin-heading-1">Dashboard Administrativo</h1>
        <p class="admin-text-secondary mt-2">Visão geral da plataforma Kadesh</p>
      </div>
    </template>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="admin-spinner-lg"></div>
      <p class="mt-4 admin-text-secondary">Carregando estatísticas...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Grid -->
      <div class="admin-stats-grid mb-8">
        <!-- Total Users -->
        <div class="admin-stat-card admin-stat-card-primary">
          <div class="admin-stat-content">
            <div class="admin-stat-info">
              <p class="admin-stat-label">Total de Usuários</p>
              <p class="admin-stat-value">{{ stats.users?.total || 0 }}</p>
              <p class="admin-stat-meta">
                {{ stats.users?.new_this_month || 0 }} novos este mês
              </p>
            </div>
            <div class="admin-stat-icon admin-stat-icon-primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
          <div class="admin-stat-footer">
            <span class="font-medium">{{ stats.users?.clients || 0 }}</span> Contratantes • 
            <span class="font-medium">{{ stats.users?.providers || 0 }}</span> Prestadores
          </div>
        </div>

        <!-- Total Projects -->
        <div class="admin-stat-card admin-stat-card-success">
          <div class="admin-stat-content">
            <div class="admin-stat-info">
              <p class="admin-stat-label">Total de Projetos</p>
              <p class="admin-stat-value">{{ stats.projects?.total || 0 }}</p>
              <p class="admin-stat-meta">
                {{ stats.projects?.new_this_month || 0 }} novos este mês
              </p>
            </div>
            <div class="admin-stat-icon admin-stat-icon-success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="admin-stat-footer">
            <span class="font-medium">{{ stats.projects?.open || 0 }}</span> Abertos • 
            <span class="font-medium">{{ stats.projects?.in_progress || 0 }}</span> Em andamento
          </div>
        </div>

        <!-- Total Bids -->
        <div class="admin-stat-card admin-stat-card-secondary">
          <div class="admin-stat-content">
            <div class="admin-stat-info">
              <p class="admin-stat-label">Total de Propostas</p>
              <p class="admin-stat-value">{{ stats.bids?.total || 0 }}</p>
              <p class="admin-stat-meta">
                {{ stats.bids?.new_this_month || 0 }} novas este mês
              </p>
            </div>
            <div class="admin-stat-icon admin-stat-icon-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
          <div class="admin-stat-footer">
            <span class="font-medium">{{ stats.bids?.pending || 0 }}</span> Pendentes • 
            <span class="font-medium">{{ stats.bids?.accepted || 0 }}</span> Aceitas
          </div>
        </div>

        <!-- Total Payments -->
        <div class="admin-stat-card admin-stat-card-warning">
          <div class="admin-stat-content">
            <div class="admin-stat-info">
              <p class="admin-stat-label">Volume de Pagamentos</p>
              <p class="admin-stat-value">
                R$ {{ formatCurrency(stats.payments?.total_amount || 0) }}
              </p>
              <p class="admin-stat-meta">
                {{ stats.payments?.total || 0 }} transações
              </p>
            </div>
            <div class="admin-stat-icon admin-stat-icon-warning">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="admin-stat-footer">
            Taxas: <span class="font-medium">R$ {{ formatCurrency(stats.payments?.total_fees || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-heading-3">Usuários Recentes</h3>
          </div>
          <div class="admin-card-body">
            <div class="space-y-3">
              <div
                v-for="user in stats.recentUsers"
                :key="user.email"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p class="font-medium admin-text-primary">{{ user.name }}</p>
                  <p class="admin-text-xs admin-text-secondary">{{ user.email }}</p>
                </div>
                <span
                  class="admin-badge"
                  :class="user.type === 'client' ? 'admin-badge-primary' : 'admin-badge-success'"
                >
                  {{ user.type === 'client' ? 'Contratante' : 'Prestador' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Projects -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h3 class="admin-heading-3">Projetos Recentes</h3>
          </div>
          <div class="admin-card-body">
            <div class="space-y-3">
              <div
                v-for="project in stats.recentProjects"
                :key="project.id"
                class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium admin-text-primary">{{ project.title }}</p>
                    <p class="admin-text-xs admin-text-secondary mt-1">Por: {{ project.client_name }}</p>
                  </div>
                  <span class="admin-text-sm font-bold text-green-600">
                    R$ {{ formatCurrency(project.budget) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const router = useRouter()

const loading = ref(true)
const stats = ref({})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem('kadesh_token') || localStorage.getItem('adminToken')
    
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/stats/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    if (error.response?.status === 401) {
      router.push('/admin/login')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>

<style scoped>
@import '@/assets/admin-design-system.css';
</style>

