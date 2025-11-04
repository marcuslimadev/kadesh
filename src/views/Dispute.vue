<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Disputa e Mediação</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <div v-if="!dispute">
        <h2 class="text-xl font-bold mb-4">Iniciar uma Disputa</h2>
        <form @submit.prevent="openDispute" class="space-y-4">
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700">Motivo da Disputa</label>
            <textarea id="reason" v-model="reason" required rows="4" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"></textarea>
          </div>
          <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            Abrir Disputa
          </button>
        </form>
      </div>

      <div v-else>
        <h2 class="text-xl font-bold mb-4">Mediação em Andamento</h2>
        <div class="space-y-4 mb-4" style="max-height: 400px; overflow-y: auto;">
          <div v-for="message in messages" :key="message.id" :class="{ 'text-right': message.user_id === currentUser.id }">
            <div class="inline-block p-3 rounded-lg" :class="{ 'bg-indigo-100': message.user_id === currentUser.id, 'bg-gray-100': message.user_id !== currentUser.id }">
              <div class="font-bold">{{ message.user_name }}</div>
              <div>{{ message.message }}</div>
            </div>
          </div>
        </div>
        <form @submit.prevent="postMessage" class="mt-4 flex">
          <input type="text" v-model="newMessage" placeholder="Digite sua mensagem..." class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md">
          <button type="submit" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-r-md">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const dispute = ref(null)
const messages = ref([])
const reason = ref('')
const newMessage = ref('')
const currentUser = ref(null)

async function fetchData() {
    // A simple way to check if a dispute already exists for this project might be needed.
    // For now, we assume we navigate here with a dispute ID if it exists.
    // A better approach would be to have an endpoint like /api/projects/{id}/dispute

    // Fetch current user to align messages
    const userRes = await api.get('/api/user');
    currentUser.value = userRes.data.user;
}

onMounted(fetchData)

async function openDispute() {
  const projectId = route.params.id
  const response = await api.post(`/api/projects/${projectId}/disputes`, { reason: reason.value })
  const disputeId = response.data.id

  // Now load the dispute view
  const disputeRes = await api.get(`/api/disputes/${disputeId}`)
  dispute.value = disputeRes.data.dispute
  messages.value = disputeRes.data.messages
}

async function postMessage() {
  if (!dispute.value) return;

  await api.post(`/api/disputes/${dispute.value.id}/messages`, { message: newMessage.value })
  newMessage.value = ''

  // Refresh messages
  const disputeRes = await api.get(`/api/disputes/${dispute.value.id}`)
  messages.value = disputeRes.data.messages
}
</script>
