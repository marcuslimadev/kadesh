<template>
  <aside
    v-if="!hidden && slots.length > 0"
    :class="[
      'hidden xl:flex flex-col gap-4 w-60',
      position === 'left' ? 'xl:mr-8 xl:pr-4' : 'xl:ml-8 xl:pl-4'
    ]"
  >
    <div class="flex items-center justify-between text-xs text-muted">
      <span>Publicidade</span>
      <button
        class="px-2 py-1 rounded bg-surface-alt text-primary hover:opacity-80"
        @click="hidden = true"
      >
        Ocultar
      </button>
    </div>
    <div
      v-for="slot in slots"
      :key="slot.id"
      class="ad-card"
    >
      <p class="ad-eyebrow">Patrocinado</p>
      <h4 class="ad-title">{{ slot.title }}</h4>
      <p class="ad-sub">{{ slot.description }}</p>
      <a
        v-if="slot.link_url"
        :href="slot.link_url"
        target="_blank"
        rel="noopener"
        class="ad-cta"
        @click="trackClick(slot.id)"
      >
        Saiba mais
      </a>
      <button v-else class="ad-cta" type="button">Quero anunciar</button>
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
  background: linear-gradient(145deg, rgba(212, 175, 55, 0.09), rgba(15, 23, 42, 0.9));
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.ad-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  color: var(--text-secondary);
}

.ad-title {
  margin-top: 6px;
  font-weight: 700;
  font-size: 16px;
}

.ad-sub {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.ad-cta {
  margin-top: 10px;
  width: 100%;
  padding: 8px 10px;
  background: var(--accent);
  color: #0b1021;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid var(--accent-strong);
}

.text-muted {
  color: var(--text-secondary);
}

.bg-surface-alt {
  background: var(--surface-alt);
}

.text-primary {
  color: var(--text-primary);
}
</style>
