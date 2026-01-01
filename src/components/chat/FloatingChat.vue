<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Button -->
    <Transition name="fade">
      <button
        v-if="!isOpen"
        @click="toggleChat"
        class="chat-btn group relative"
        aria-label="Abrir chat"
      >
        <!-- Pulse Animation -->
        <span class="absolute inset-0 bg-[#D4AF37] rounded-full animate-ping opacity-75"></span>
        
        <!-- Button Content -->
        <span class="relative flex items-center justify-center">
          <svg class="w-7 h-7 text-[#0F1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </span>

        <!-- Badge de notificação (se houver mensagens não lidas) -->
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>

        <!-- Tooltip -->
        <span class="chat-tooltip">
          {{ isAuthenticated ? 'Fale conosco' : 'Fale com o suporte' }}
        </span>
      </button>
    </Transition>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <!-- Header -->
        <div class="chat-header">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="h-10 w-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <svg class="w-6 h-6 text-[#0F1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span class="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[#161821] rounded-full"></span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-heading">
                {{ chatTitle }}
              </h3>
              <p class="text-xs text-muted">Online agora</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-body hover:text-heading transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="chat-messages">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-8">
            <div class="h-16 w-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <svg class="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p class="text-sm text-body mb-2">{{ welcomeMessage }}</p>
            <p class="text-xs text-muted">Respondemos em alguns minutos</p>
          </div>

          <!-- Messages List -->
          <div v-for="(message, index) in messages" :key="index" class="mb-4">
            <div :class="['message', message.isUser ? 'message-user' : 'message-admin']">
              <p class="text-sm text-heading">{{ message.text }}</p>
              <span class="text-xs text-muted mt-1">{{ message.time }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message message-admin">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-container">
          <div class="flex gap-2">
            <input
              v-model="newMessage"
              @keypress.enter="sendMessage"
              type="text"
              placeholder="Digite sua mensagem..."
              class="chat-input"
            />
            <button
              @click="sendMessage"
              :disabled="!newMessage.trim()"
              class="chat-send-btn"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p class="text-xs text-muted mt-2 text-center">
            Atendimento de seg a sex, das 9h às 18h
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const isOpen = ref(false)
const newMessage = ref('')
const messages = ref([])
const isTyping = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref(null)

const chatTitle = computed(() => {
  return isAuthenticated.value ? 'Suporte Kadesh' : 'Fale com Admin'
})

const welcomeMessage = computed(() => {
  return isAuthenticated.value
    ? 'Olá! Como podemos ajudar você hoje?'
    : 'Bem-vindo! Crie sua conta para começar a usar a plataforma.'
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    text: newMessage.value,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    isUser: true
  }

  messages.value.push(userMessage)
  newMessage.value = ''

  await nextTick()
  scrollToBottom()

  // Simular resposta automática do admin (em produção, isso seria via Socket.io)
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    
    const adminResponse = {
      text: isAuthenticated.value
        ? 'Obrigado pela mensagem! Nossa equipe responderá em breve.'
        : 'Para criar sua conta e publicar projetos, clique em "Cadastrar" no menu superior.',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isUser: false
    }

    messages.value.push(adminResponse)

    nextTick(() => {
      scrollToBottom()
      if (!isOpen.value) {
        unreadCount.value++
      }
    })
  }, 1500)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch para scroll automático quando novas mensagens chegarem
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
/* Chat Button */
.chat-btn {
  @apply relative h-16 w-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E5C04A] shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 transform hover:scale-110;
}

.chat-tooltip {
  @apply absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#161821] text-heading text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none;
}

/* Chat Window */
.chat-window {
  @apply w-[380px] h-[600px] bg-[#161821] rounded-2xl shadow-2xl border border-[rgba(212,175,55,0.24)] flex flex-col overflow-hidden;
}

.chat-header {
  @apply flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1A1A1A] to-[#0F1117] border-b border-[rgba(212,175,55,0.24)];
}

.chat-messages {
  @apply flex-1 p-6 overflow-y-auto bg-[#0F1117];
}

/* Custom Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(212, 175, 55, 0.05);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

/* Messages */
.message {
  @apply max-w-[75%] p-3 rounded-2xl;
}

.message-user {
  @apply ml-auto bg-gradient-to-br from-[#D4AF37] to-[#E5C04A] text-[#0F1117];
}

.message-admin {
  @apply mr-auto bg-[#1A1A1A] border border-[rgba(212,175,55,0.24)];
}

/* Typing Indicator */
.typing-indicator {
  @apply flex gap-1 py-1;
}

.typing-indicator span {
  @apply w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Input Area */
.chat-input-container {
  @apply px-6 py-4 bg-[#1A1A1A] border-t border-[rgba(212,175,55,0.24)];
}

.chat-input {
  @apply flex-1 bg-[#0F1117] border border-[#333] text-heading px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder-[#8A8A8A];
}

.chat-send-btn {
  @apply bg-gradient-to-br from-[#D4AF37] to-[#E5C04A] text-[#0F1117] p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>


