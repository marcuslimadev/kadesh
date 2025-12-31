<template>
  <aside
    v-if="!hidden && slots.length > 0"
    :class="[
      'grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:w-72 xl:flex xl:flex-col xl:gap-6',
      position === 'left' ? 'xl:mr-8' : 'xl:ml-8'
    ]"
  >
    <div class="flex items-center justify-between text-xs font-medium text-muted sm:col-span-2">
      <span class="uppercase tracking-wider">Patrocinado</span>
      <button
        class="text-muted hover:text-heading transition-colors"
        @click="hidden = true"
        title="Ocultar anúncios"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div
      v-for="slot in slots"
      :key="slot.id"
      class="ad-card card-premium"
    >
      <div class="ad-badge">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span>Anúncio</span>
      </div>
      
      <h4 class="ad-title">{{ slot.title }}</h4>
      <p class="ad-description">{{ slot.description }}</p>
      
      <a
        v-if="slot.link_url"
        :href="slot.link_url"
        target="_blank"
        rel="noopener"
        class="ad-cta btn-gold"
        @click="trackClick(slot.id)"
      >
        <span>Saiba mais</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
      <button v-else class="ad-cta btn-gold" type="button">
        <span>Saiba mais</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import api from '@/services/api'

const props = defineProps({
  position: {
    type: String,
    default: 'left'
  }
})

const hidden = ref(false)
const slots = ref([])
const position = computed(() => (props.position === 'right' ? 'right' : 'left'))

const MOCK_ADS = {
  left: [
    {
      id: 'mock-left-1',
      title: 'Impulsione seu Projeto',
      description: 'Destaque seu projeto e encontre os melhores profissionais.',
      link_url: '/lobby'
    },
    {
      id: 'mock-left-2',
      title: 'Seja um Prestador Premium',
      description: 'Aumente sua visibilidade e ganhe mais propostas.',
      link_url: '/profile'
    }
  ],
  right: [
    {
      id: 'mock-right-1',
      title: 'Suporte 24/7',
      description: 'Nossa equipe está sempre disponível para ajudar.',
      link_url: '/tutorial'
    },
    {
      id: 'mock-right-2',
      title: 'Pagamentos 100% Seguros',
      description: 'Transações protegidas e fluxo com escrow.',
      link_url: '/wallet'
    }
  ]
}

async function loadAdvertisements() {
  try {
    const response = await api.get('/api/advertisements', {
      params: { position: position.value }
    })
    const data = Array.isArray(response.data) ? response.data : []
    slots.value = data.length ? data : (MOCK_ADS[position.value] || [])
  } catch (error) {
    console.error('Erro ao carregar anúncios:', error)
    slots.value = MOCK_ADS[position.value] || []
  }
}

async function trackClick(adId) {
  try {
    if (String(adId).startsWith('mock-')) return
    await api.post(`/api/advertisements/${adId}/click`)
  } catch (error) {
    console.error('Erro ao registrar clique:', error)
  }
}

onMounted(() => {
  loadAdvertisements()
})
</script>

<style scoped>
.ad-card {
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.ad-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  background: var(--accent-muted);
  border: 1px solid var(--card-border);
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.ad-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.ad-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.ad-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
</style>
