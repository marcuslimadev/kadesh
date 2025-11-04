<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Disputa e Mediação</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <div v-if="!disputeStarted">
        <h2 class="text-xl font-bold mb-4">Iniciar uma Disputa</h2>
        <form @submit.prevent="startDispute" class="space-y-4">
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
        <div class="space-y-4">
          <div v-for="message in messages" :key="message.id" :class="message.sender === 'Eu' ? 'text-right' : ''">
            <div class="inline-block p-3 rounded-lg" :class="message.sender === 'Eu' ? 'bg-indigo-100' : 'bg-gray-100'">
              <div class="font-bold">{{ message.sender }}</div>
              <div>{{ message.text }}</div>
            </div>
          </div>
        </div>
        <form @submit.prevent="sendMessage" class="mt-4 flex">
          <input type="text" v-model="newMessage" placeholder="Digite sua mensagem..." class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md">
          <button type="submit" class="px-4 py-2 font-medium text-white bg-indigo-600 rounded-r-md">Enviar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const disputeStarted = ref(false)
const reason = ref('')
const newMessage = ref('')
const messages = ref([
  { id: 1, sender: 'Mediador', text: 'Olá, por favor, descrevam a situação.' },
])

function startDispute() {
  disputeStarted.value = true
  messages.value.push({ id: 2, sender: 'Eu', text: reason.value })
}

function sendMessage() {
  messages.value.push({ id: messages.value.length + 1, sender: 'Eu', text: newMessage.value })
  newMessage.value = ''
}
</script>
