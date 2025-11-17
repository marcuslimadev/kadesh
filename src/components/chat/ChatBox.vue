<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Chat do Contrato</h3>
      <span class="text-xs text-gray-500">Tempo real</span>
    </div>

    <div ref="scrollEl" class="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
      <div v-if="loading" class="text-center text-gray-500 py-8">Carregando mensagens...</div>
      <template v-else>
        <div v-for="m in messages" :key="m.id" :class="messageClass(m)">
          <div class="px-3 py-2 rounded-lg max-w-[75%]" :class="bubbleClass(m)">
            <p class="text-sm whitespace-pre-wrap">{{ m.content }}</p>
            <p class="text-[10px] mt-1 opacity-60 text-right">{{ formatTime(m.created_at) }}</p>
          </div>
        </div>
        <div v-if="typing" class="text-xs text-gray-500">Digitando...</div>
      </template>
    </div>

    <form @submit.prevent="send" class="p-3 border-t border-gray-200 flex gap-2">
      <input v-model="text" type="text" placeholder="Escreva uma mensagem" class="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" @input="notifyTyping" />
      <button type="submit" :disabled="!text.trim() || sending" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
        {{ sending ? 'Enviando...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { io } from 'socket.io-client'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  contractId: { type: String, required: true },
})

const auth = useAuthStore()
const loading = ref(true)
const sending = ref(false)
const text = ref('')
const messages = ref([])
const typing = ref(false)
let socket
const scrollEl = ref(null)

function scrolldown() {
  nextTick(() => {
    const el = scrollEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function formatTime(v) {
  try { return new Date(v).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) } catch { return '' }
}

function messageClass(m){
  return m.sender_id === auth.user?.id ? 'flex justify-end' : 'flex justify-start'
}
function bubbleClass(m){
  return m.sender_id === auth.user?.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-900 border'
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get(`/api/messages/contract/${props.contractId}`)
    messages.value = data.messages || []
    scrolldown()
  } finally {
    loading.value = false
  }
}

async function send(){
  if (!text.value.trim()) return
  sending.value = true
  try {
    const { data } = await api.post('/api/messages', { contract_id: props.contractId, content: text.value })
    // Message will be appended by socket echo, but append optimistic in case socket lag
    if (!messages.value.some(m => m.id === data.message.id)) {
      messages.value.push(data.message)
      scrolldown()
    }
    text.value = ''
  } finally {
    sending.value = false
  }
}

let typingTimeout
function notifyTyping(){
  if (!socket) return
  socket.emit('typing', { contract_id: props.contractId })
}

function setupSocket(){
  const base = api.defaults.baseURL || window.location.origin
  socket = io(base, {
    transports: ['websocket', 'polling'],
    auth: { token: auth.token },
  })
  socket.on('connect', () => {
    socket.emit('join:contract', props.contractId)
  })
  socket.on('message:new', (m) => {
    if (m.contract_id !== props.contractId) return
    messages.value.push(m)
    scrolldown()
  })
  socket.on('typing', (payload) => {
    if (payload?.contract_id && payload.contract_id !== props.contractId) return
    typing.value = true
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => typing.value = false, 1200)
  })
}

onMounted(async () => {
  await load()
  setupSocket()
})

onBeforeUnmount(() => {
  try { socket?.disconnect() } catch {}
})
</script>
