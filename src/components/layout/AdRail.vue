<template>
  <aside
    v-if="!hidden && slots.length > 0"
    :class="[
      'hidden xl:flex flex-col gap-6 w-72',
      position === 'left' ? 'xl:mr-8' : 'xl:ml-8'
    ]"
  >
    <div class="flex items-center justify-between text-xs font-medium text-gray-400">
      <span class="uppercase tracking-wider">Patrocinado</span>
      <button
        class="text-gray-400 hover:text-gray-600 transition-colors"
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
      class="ad-card"
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
        class="ad-cta"
        @click="trackClick(slot.id)"
      >
        <span>Saiba mais</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </a>
      <button v-else class="ad-cta" type="button">
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
import axios from 'axios'

const props = defineProps({
  position: {
    type: String,
    default: 'left'
  }
})

const hidden = ref(false)
const slots = ref([])
const position = computed(() => (props.position === 'right' ? 'right' : 'left'))

async function loadAdvertisements() {
  try {
    const response = await axios.get('/api/advertisements', {
      params: { position: position.value }
    })
    slots.value = response.data
  } catch (error) {
    console.error('Erro ao carregar anúncios:', error)
    // Manter vazio se houver erro
    slots.value = []
  }
}

async function trackClick(adId) {
  try {
    await axios.post(`/api/advertisements/${adId}/click`)
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
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.ad-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ad-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

.ad-card:hover::before {
  opacity: 1;
}

.ad-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: #0284c7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.ad-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.ad-description {
  font-size: 14px;
  color: #64748b;
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
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.ad-cta:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.ad-cta:active {
  transform: translateY(0);
}
</style>
