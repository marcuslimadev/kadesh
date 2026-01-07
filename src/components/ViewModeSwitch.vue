<template>
  <div :class="['view-mode-switch', isSidebar ? 'view-mode-switch--sidebar' : '']">
    <!-- Desktop -->
    <div
      :class="[
        'hidden md:flex items-center rounded-full transition-all duration-500',
        'vm-shell',
        isSidebar ? 'vm-shell--sidebar' : 'vm-shell--inline'
      ]"
    >
      <button
        @click="goToMode('contractor')"
        :class="[
          'vm-pill',
          isSidebar ? 'vm-pill--sidebar' : 'vm-pill--inline',
          viewMode.isContractor ? 'vm-pill--active' : 'vm-pill--inactive'
        ]"
      >
        <span class="text-base transition-transform duration-500" :class="viewMode.isContractor ? 'scale-110' : ''">📘</span>
        <span class="text-xs font-semibold">Contratante</span>
      </button>
      
      <button
        @click="goToMode('provider')"
        :class="[
          'vm-pill',
          isSidebar ? 'vm-pill--sidebar' : 'vm-pill--inline',
          viewMode.isProvider ? 'vm-pill--active' : 'vm-pill--inactive'
        ]"
      >
        <span class="text-base transition-transform duration-500" :class="viewMode.isProvider ? 'scale-110' : ''">🛠️</span>
        <span class="text-xs font-semibold">Prestador</span>
      </button>
    </div>

    <!-- Mobile -->
    <div class="md:hidden flex items-center justify-center">
      <button
        @click="toggleMode()"
        class="vm-pill vm-pill--mobile"
      >
        <span class="text-xl transition-transform duration-500">{{ viewMode.modeIcon }}</span>
        <span class="text-sm">Ver como {{ viewMode.modeLabel }}</span>
        <svg class="w-4 h-4 transition-transform duration-700" :class="viewMode.isProvider ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useViewModeStore } from '@/stores/viewModeStore'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const isSidebar = computed(() => props.variant === 'sidebar')

const viewMode = useViewModeStore()
const showTooltip = ref(false)
const router = useRouter()

onMounted(() => {
  if (typeof window === 'undefined') return
  const tooltipCount = parseInt(localStorage.getItem('kadesh_viewmode_tooltip_count') || '0')
  
  if (tooltipCount < 3) {
    showTooltip.value = true
    localStorage.setItem('kadesh_viewmode_tooltip_count', (tooltipCount + 1).toString())
    
    // Auto-dismiss após 5 segundos
    setTimeout(() => {
      showTooltip.value = false
    }, 5000)
  }
})

const dismissTooltip = () => {
  showTooltip.value = false
  if (typeof window !== 'undefined') {
    localStorage.setItem('kadesh_viewmode_tooltip_count', '999') // Não mostra mais
  }
}

const goToMode = (mode) => {
  viewMode.setMode(mode)
  const target = { name: 'auction-lobby', query: { mode, ts: Date.now() } }
  const isOnLobby = router.currentRoute.value.name === 'auction-lobby'
  const navFn = isOnLobby ? router.replace : router.push
  navFn(target).catch(() => {})
}

const toggleMode = () => {
  const next = viewMode.isContractor ? 'provider' : 'contractor'
  goToMode(next)
}
</script>

<style scoped>
.view-mode-switch {
  position: relative;
}

.view-mode-switch--sidebar :deep(.md\:hidden) {
  display: none;
}

.vm-shell {
  background: var(--surface);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-md);
  padding: 0.25rem;
}

.vm-shell--sidebar {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
}

.vm-shell--inline {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.vm-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 999px;
}

.vm-pill--inline {
  padding: 0.375rem 0.75rem;
}

.vm-pill--sidebar {
  width: 100%;
  justify-content: flex-start;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
}

.vm-pill--active {
  background: var(--accent);
  color: #0f1117;
  box-shadow: var(--shadow-gold);
  transform: scale(1.02);
}

.vm-pill--inactive {
  background: var(--surface-alt);
  color: var(--text-secondary);
  border: 1px solid var(--muted-border);
}

.vm-pill--inactive:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
}

.vm-pill--mobile {
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-weight: 700;
  background: var(--accent);
  color: #0f1117;
  box-shadow: var(--shadow-gold);
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-5px) translateX(-50%);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}

button {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
