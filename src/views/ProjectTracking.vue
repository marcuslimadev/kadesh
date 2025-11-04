<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Acompanhamento do Projeto</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <!-- Milestones Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Marcos (Milestones)</h2>
        <div v-if="loading.milestones">Carregando...</div>
        <div v-else class="space-y-4">
          <div v-for="milestone in milestones" :key="milestone.id" class="p-4 border border-gray-200 rounded-md">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-bold">{{ milestone.description }}</div>
                <div class="text-sm text-gray-600">Valor: R$ {{ milestone.amount }}</div>
              </div>
              <div class="flex items-center gap-4">
                <span class="px-2 py-1 text-xs font-semibold text-white rounded-full" :class="statusColor(milestone.status)">{{ milestone.status }}</span>
                <button v-if="milestone.status === 'pending'" @click="fundMilestone(milestone.id)" class="px-3 py-1 text-sm text-white bg-blue-600 rounded-md">Financiar</button>
                <button v-if="milestone.status === 'funded'" @click="releaseMilestone(milestone.id)" class="px-3 py-1 text-sm text-white bg-green-600 rounded-md">Liberar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Milestone Form -->
      <div class="mt-8">
        <h2 class="text-xl font-bold mb-4">Adicionar Novo Marco</h2>
        <form @submit.prevent="addMilestone" class="flex gap-4">
          <input type="text" v-model="newMilestone.description" placeholder="Descrição" required class="flex-grow px-3 py-2 border rounded-md">
          <input type="number" v-model.number="newMilestone.amount" placeholder="Valor" required class="w-32 px-3 py-2 border rounded-md">
          <button type="submit" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md">Adicionar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const milestones = ref([])
const loading = reactive({ milestones: true, timeline: true })

const newMilestone = reactive({ description: '', amount: 0 })

async function fetchMilestones() {
    loading.milestones = true
    try {
        const response = await api.get(`/api/projects/${route.params.id}/milestones`)
        milestones.value = response.data
    } finally {
        loading.milestones = false
    }
}

onMounted(fetchMilestones)

async function addMilestone() {
    await api.post(`/api/projects/${route.params.id}/milestones`, newMilestone)
    fetchMilestones()
    newMilestone.description = ''
    newMilestone.amount = 0
}

async function fundMilestone(id) {
    try {
        const response = await api.post(`/api/milestones/${id}/fund`)
        if (response.data.checkout_url) {
            window.location.href = response.data.checkout_url
        }
    } catch (error) {
        alert('Falha ao iniciar o pagamento.')
    }
}

async function releaseMilestone(id) {
    await api.post(`/api/milestones/${id}/release`)
    fetchMilestones()
}

function statusColor(status) {
  return {
    'pending': 'bg-gray-500',
    'funded': 'bg-blue-500',
    'released': 'bg-green-500',
    'disputed': 'bg-red-500',
  }[status]
}
</script>
