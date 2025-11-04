<template>
  <div class="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Main Content: Milestones -->
    <div class="md:col-span-2">
      <h1 class="text-2xl font-bold mb-4">Acompanhamento do Projeto</h1>
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">Marcos (Milestones)</h2>
        <div v-if="loading.milestones">Carregando...</div>
        <div v-else class="space-y-4">
          <div v-for="milestone in milestones" :key="milestone.id" class="p-4 border border-gray-200 rounded-md">
            <!-- Milestone details -->
          </div>
        </div>

        <!-- Add Milestone Form -->
        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">Adicionar Novo Marco</h2>
          <form @submit.prevent="addMilestone" class="flex gap-4">
            <input type="text" v-model="newMilestone.description" placeholder="Descrição" required class="flex-grow px-3 py-2 border rounded-md">
            <input type="number" v-model.number="newMilestone.amount" placeholder="Valor" required class="w-32 px-3 py-2 border rounded-md">
            <button type="submit" class="px-4 py-2 text-white bg-indigo-600 rounded-md">Adicionar</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Sidebar: Timeline -->
    <div>
      <h2 class="text-xl font-bold mb-4">Timeline de Eventos</h2>
      <div class="p-8 bg-white rounded-lg shadow-md">
        <div v-if="loading.timeline">Carregando...</div>
        <div v-else class="space-y-6">
          <div v-for="event in timeline" :key="event.id" class="flex items-start">
            <div class="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              <!-- Icon placeholder -->
            </div>
            <div class="ml-4">
              <div class="font-bold">{{ event.event_type }}</div>
              <p class="text-sm text-gray-600">{{ event.description }}</p>
              <div class="text-xs text-gray-400">{{ new Date(event.created_at).toLocaleString() }}</div>
            </div>
          </div>
        </div>
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
const timeline = ref([])
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

async function fetchTimeline() {
  loading.timeline = true
  try {
    const response = await api.get(`/api/projects/${route.params.id}/timeline`)
    timeline.value = response.data
  } finally {
    loading.timeline = false
  }
}

onMounted(() => {
  fetchMilestones()
  fetchTimeline()
})

async function addMilestone() {
  await api.post(`/api/projects/${route.params.id}/milestones`, newMilestone)
  fetchMilestones()
  fetchTimeline() // Refresh timeline as well
  newMilestone.description = ''
  newMilestone.amount = 0
}
</script>
