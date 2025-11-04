<template>
  <div class="container mx-auto p-4">
    <div v-if="project" class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <!-- Project Details -->
      <div class="p-8 bg-white rounded-lg shadow-md md:col-span-2">
        <h1 class="text-3xl font-bold mb-2">{{ project.title }}</h1>
        <p class="text-gray-700 mb-4">{{ project.description }}</p>
        <div class="text-2xl font-bold text-indigo-600 mb-6">Orçamento: R$ {{ project.budget }}</div>

        <form @submit.prevent="placeBid" class="space-y-4">
          <div>
            <label for="bidAmount" class="block text-sm font-medium text-gray-700">Valor do Lance (R$)</label>
            <input type="number" id="bidAmount" v-model="bidAmount" required class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <button type="submit" class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Dar Lance
          </button>
        </form>
      </div>

      <!-- Bidding Leaderboard -->
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Leilão</h2>
        <div class="mb-4">
          <div class="text-lg font-bold text-center text-red-600">{{ formattedTimeLeft }}</div>
          <div class="text-sm text-center text-gray-600">Tempo Restante</div>
        </div>
        <ul class="space-y-4">
          <li v-for="bid in sortedBids" :key="bid.id" class="flex justify-between items-center p-3 bg-gray-100 rounded-md">
            <div>
              <div class="font-bold">{{ bid.userName }}</div>
              <div class="text-sm text-gray-600">Rep: {{ bid.reputation.toFixed(1) }}</div>
            </div>
            <div class="text-lg font-bold text-indigo-600">R$ {{ bid.amount }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const project = ref(null)
const bidAmount = ref(0)
const bids = reactive([
  { id: 1, userId: 2, userName: 'Contratado A', amount: 4800, reputation: 4.5 },
  { id: 2, userId: 3, userName: 'Contratado B', amount: 4750, reputation: 4.8 },
])
const timeLeft = ref(300) // 5 minutes in seconds
let timer = null

const mockProjects = [
  { id: 1, title: 'Reforma de Cozinha', description: 'Reforma completa da cozinha...', budget: 5000 },
]

const sortedBids = computed(() => {
  return [...bids].sort((a, b) => a.amount - b.amount)
})

const formattedTimeLeft = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

onMounted(() => {
  const projectId = parseInt(route.params.id)
  project.value = mockProjects.find(p => p.id === projectId)

  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      alert('Leilão encerrado!')
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function placeBid() {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  bids.push({
    id: bids.length + 1,
    userId: 4, // Mock user ID
    userName: currentUser?.name || 'Você',
    amount: bidAmount.value,
    reputation: currentUser?.reputation || 5.0,
  })

  // Soft close: add 2 minutes if bid is in the last 2 minutes
  if (timeLeft.value < 120) {
    timeLeft.value += 120
  }

  bidAmount.value = 0
}
</script>
