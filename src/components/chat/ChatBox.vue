<template>
  <div class="chat-container bg-surface rounded-xl border border-theme shadow-lg overflow-hidden">
    <!-- Header do chat -->
    <div class="px-5 py-4 border-b border-theme flex items-center justify-between bg-surface-alt">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-bold text-heading">Chat do Contrato</h3>
          <p class="text-xs text-body">Comunicação em tempo real</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs text-emerald-400 font-medium">Online</span>
      </div>
    </div>

    <!-- Área de mensagens -->
    <div ref="scrollEl" class="h-80 overflow-y-auto p-4 space-y-4 bg-page">
      <div v-if="loading" class="text-center text-body py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-2"></div>
        Carregando mensagens...
      </div>
      
      <template v-else>
        <div v-if="messages.length === 0" class="text-center text-body py-12">
          <svg class="w-12 h-12 mx-auto mb-3 text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>Nenhuma mensagem ainda</p>
          <p class="text-xs mt-1">Inicie a conversa!</p>
        </div>
        
        <div v-for="m in messages" :key="m.id" :class="messageClass(m)">
          <div class="message-bubble" :class="bubbleClass(m)">
            <p class="text-sm whitespace-pre-wrap">{{ m.content }}</p>
            <p class="text-[10px] mt-1.5 opacity-60 text-right">{{ formatTime(m.created_at) }}</p>
          </div>
        </div>
        
        <div v-if="typing" class="flex items-center gap-2 text-xs text-body pl-2">
          <span class="flex gap-1">
            <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </span>
          Digitando...
        </div>
      </template>
    </div>

    <!-- Formulário de envio -->
    <form @submit.prevent="send" class="p-4 border-t border-theme bg-surface flex gap-3">
      <input 
        v-model="text" 
        type="text" 
        placeholder="Escreva uma mensagem..." 
        class="flex-1 px-4 py-3 bg-surface-alt border border-theme rounded-xl text-heading placeholder:text-body focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all" 
        @input="notifyTyping" 
      />
      <button 
        type="submit" 
        :disabled="!text.trim() || sending" 
        class="px-5 py-3 bg-accent text-graphite-900 font-bold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
      >
        <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-25"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
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
  return m.sender_id === auth.user?.id 
    ? 'message-bubble--sent bg-accent text-graphite-900' 
    : 'message-bubble--received bg-surface border border-theme text-heading'
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

<style scoped>
.chat-container {
  max-height: 500px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 75%;
  word-wrap: break-word;
}

.message-bubble--sent {
  border-bottom-right-radius: 4px;
}

.message-bubble--received {
  border-bottom-left-radius: 4px;
}
</style>