<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="admin-title">Gerenciar Anúncios</h1>
      <button class="btn-primary" @click="openCreateModal">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Novo Anúncio
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert-error">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="ml-3 text-sm text-red-700">{{ error }}</p>
        <button @click="error = null" class="ml-auto text-red-400 hover:text-red-600">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert-success">
      <div class="flex">
        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="ml-3 text-sm text-green-700">{{ successMessage }}</p>
        <button @click="successMessage = null" class="ml-auto text-green-400 hover:text-green-600">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total de Anúncios</div>
        <div class="stat-value">{{ advertisements.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Ativos</div>
        <div class="stat-value text-green-400">{{ activeCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Impressões Totais</div>
        <div class="stat-value">{{ totalImpressions }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Cliques Totais</div>
        <div class="stat-value">{{ totalClicks }}</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filters-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar anúncios..."
        class="filter-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="all">Todos os Status</option>
        <option value="active">Apenas Ativos</option>
        <option value="inactive">Apenas Inativos</option>
      </select>
      <select v-model="filterPosition" class="filter-select">
        <option value="all">Todas as Posições</option>
        <option value="left">Esquerda</option>
        <option value="right">Direita</option>
      </select>
    </div>

    <!-- Lista de Anúncios -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando anúncios...</p>
    </div>

    <div v-else-if="filteredAdvertisements.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p>Nenhum anúncio encontrado</p>
      <button class="btn-secondary" @click="openCreateModal">Criar primeiro anúncio</button>
    </div>

    <div v-else class="ads-grid">
      <div v-for="ad in filteredAdvertisements" :key="ad.id" class="ad-item">
        <div class="ad-header">
          <div class="ad-status-badge" :class="{ active: ad.is_active }">
            {{ ad.is_active ? 'Ativo' : 'Inativo' }}
          </div>
          <div class="ad-position-badge">{{ ad.position === 'left' ? 'Esquerda' : 'Direita' }} - Slot {{ ad.slot }}</div>
        </div>

        <div v-if="ad.image_url" class="ad-preview">
          <img :src="ad.image_url" :alt="ad.title" class="ad-image" />
        </div>

        <div class="ad-content">
          <h3 class="ad-title">{{ ad.title }}</h3>
          <p class="ad-description">{{ ad.description }}</p>
          
          <div v-if="ad.link_url" class="ad-link">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <a :href="ad.link_url" target="_blank" rel="noopener">{{ ad.link_url }}</a>
          </div>

          <div class="ad-stats">
            <div class="ad-stat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ ad.impression_count }} impressões
            </div>
            <div class="ad-stat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              {{ ad.click_count }} cliques
            </div>
            <div class="ad-stat" v-if="ad.click_count > 0">
              <span class="ctr-badge">CTR: {{ ((ad.click_count / ad.impression_count) * 100).toFixed(2) }}%</span>
            </div>
          </div>

          <div v-if="ad.start_date || ad.end_date" class="ad-dates">
            <div v-if="ad.start_date" class="ad-date">
              Início: {{ formatDate(ad.start_date) }}
            </div>
            <div v-if="ad.end_date" class="ad-date">
              Fim: {{ formatDate(ad.end_date) }}
            </div>
          </div>
        </div>

        <div class="ad-actions">
          <button class="btn-icon" @click="editAdvertisement(ad)" title="Editar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="btn-icon" @click="toggleAdvertisement(ad.id)" :title="ad.is_active ? 'Desativar' : 'Ativar'">
            <svg v-if="ad.is_active" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button class="btn-icon btn-danger" @click="deleteAdvertisement(ad.id)" title="Deletar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Criar/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingAd ? 'Editar Anúncio' : 'Novo Anúncio' }}</h2>
          <button class="btn-close" @click="closeModal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveAdvertisement" class="modal-form">
          <div class="form-group">
            <label>Título *</label>
            <input v-model="formData.title" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Descrição *</label>
            <textarea v-model="formData.description" required class="form-textarea"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Link (URL)</label>
              <input v-model="formData.link_url" type="url" class="form-input" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label>URL da Imagem</label>
              <input v-model="formData.image_url" type="url" class="form-input" placeholder="https://..." />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Posição *</label>
              <select v-model="formData.position" required class="form-select">
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
              </select>
            </div>

            <div class="form-group">
              <label>Slot (ordem) *</label>
              <input v-model.number="formData.slot" type="number" min="1" max="10" required class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Data Início</label>
              <input v-model="formData.start_date" type="datetime-local" class="form-input" />
            </div>

            <div class="form-group">
              <label>Data Fim</label>
              <input v-model="formData.end_date" type="datetime-local" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.is_active" type="checkbox" class="form-checkbox" />
              <span>Anúncio ativo</span>
            </label>
          </div>

          <!-- Preview -->
          <div v-if="formData.title && formData.description" class="ad-preview-box">
            <p class="preview-label">Preview:</p>
            <div class="ad-card-preview">
              <p class="ad-eyebrow-preview">{{ formData.is_active ? 'Patrocinado' : 'Inativo' }}</p>
              <h4 class="ad-title-preview">{{ formData.title }}</h4>
              <p class="ad-sub-preview">{{ formData.description }}</p>
              <button class="ad-cta-preview" type="button">Quero anunciar</button>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar Anúncio' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const advertisements = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingAd = ref(null)
const saving = ref(false)
const error = ref(null)
const successMessage = ref(null)

const searchQuery = ref('')
const filterStatus = ref('all')
const filterPosition = ref('all')

const formData = ref({
  title: '',
  description: '',
  link_url: '',
  image_url: '',
  position: 'left',
  slot: 1,
  is_active: true,
  start_date: '',
  end_date: ''
})

const activeCount = computed(() => 
  advertisements.value.filter(ad => ad.is_active).length
)

const totalImpressions = computed(() =>
  advertisements.value.reduce((sum, ad) => sum + (ad.impression_count || 0), 0)
)

const totalClicks = computed(() =>
  advertisements.value.reduce((sum, ad) => sum + (ad.click_count || 0), 0)
)

const filteredAdvertisements = computed(() => {
  return advertisements.value.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'all' ||
                         (filterStatus.value === 'active' && ad.is_active) ||
                         (filterStatus.value === 'inactive' && !ad.is_active)
    const matchesPosition = filterPosition.value === 'all' || ad.position === filterPosition.value
    
    return matchesSearch && matchesStatus && matchesPosition
  })
})

async function loadAdvertisements() {
  try {
    loading.value = true
    error.value = null
    const token = localStorage.getItem('admin_token')
    const response = await axios.get('/api/advertisements/admin', {
      headers: { Authorization: `Bearer ${token}` }
    })
    advertisements.value = response.data
  } catch (err) {
    console.error('Erro ao carregar anúncios:', err)
    error.value = 'Não foi possível carregar os anúncios. Tente novamente.'
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingAd.value = null
  formData.value = {
    title: '',
    description: '',
    link_url: '',
    image_url: '',
    position: 'left',
    slot: 1,
    is_active: true,
    start_date: '',
    end_date: ''
  }
  showModal.value = true
}

function editAdvertisement(ad) {
  editingAd.value = ad
  formData.value = {
    title: ad.title,
    description: ad.description,
    link_url: ad.link_url || '',
    image_url: ad.image_url || '',
    position: ad.position,
    slot: ad.slot,
    is_active: ad.is_active,
    start_date: ad.start_date ? ad.start_date.slice(0, 16) : '',
    end_date: ad.end_date ? ad.end_date.slice(0, 16) : ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingAd.value = null
}

async function saveAdvertisement() {
  try {
    saving.value = true
    error.value = null
    successMessage.value = null
    
    const token = localStorage.getItem('admin_token')
    
    const payload = {
      ...formData.value,
      link_url: formData.value.link_url || null,
      image_url: formData.value.image_url || null,
      start_date: formData.value.start_date || null,
      end_date: formData.value.end_date || null
    }

    if (editingAd.value) {
      await axios.put(`/api/advertisements/admin/${editingAd.value.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      successMessage.value = 'Anúncio atualizado com sucesso!'
    } else {
      await axios.post('/api/advertisements/admin', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      successMessage.value = 'Anúncio criado com sucesso!'
    }

    await loadAdvertisements()
    closeModal()
  } catch (err) {
    console.error('Erro ao salvar anúncio:', err)
    error.value = 'Erro ao salvar anúncio: ' + (err.response?.data?.error || err.message)
  } finally {
    saving.value = false
  }
}

async function toggleAdvertisement(id) {
  try {
    error.value = null
    const token = localStorage.getItem('admin_token')
    await axios.patch(`/api/advertisements/admin/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await loadAdvertisements()
    successMessage.value = 'Status alterado!'
    setTimeout(() => { successMessage.value = null }, 2000)
  } catch (err) {
    console.error('Erro ao alternar status:', err)
    error.value = 'Erro ao alternar status do anúncio.'
  }
}

async function deleteAdvertisement(id) {
  if (!confirm('Tem certeza que deseja deletar este anúncio?')) return

  try {
    error.value = null
    const token = localStorage.getItem('admin_token')
    await axios.delete(`/api/advertisements/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await loadAdvertisements()
    successMessage.value = 'Anúncio deletado!'
    setTimeout(() => { successMessage.value = null }, 2000)
  } catch (err) {
    console.error('Erro ao deletar anúncio:', err)
    error.value = 'Erro ao deletar anúncio.'
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadAdvertisements()
})
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-primary {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: #0b1021;
  border: 2px solid var(--accent-strong);
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: var(--surface-alt);
  color: var(--text-primary);
  border: 2px solid var(--card-border);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--accent);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.filter-input {
  flex: 1;
  min-width: 250px;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--accent);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--card-border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.ads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.ad-item {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  transition: all 0.2s;
}

.ad-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.25);
}

.ad-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.ad-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.ad-status-badge.active {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.ad-position-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--surface-alt);
  color: var(--text-secondary);
}

.ad-preview {
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
}

.ad-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.ad-content {
  margin-bottom: 1rem;
}

.ad-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.ad-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.ad-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
}

.ad-link a {
  color: var(--accent);
  text-decoration: none;
  word-break: break-all;
}

.ad-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

.ad-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.ctr-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(212, 175, 55, 0.2);
  color: var(--accent);
  border-radius: 6px;
  font-weight: 700;
}

.ad-dates {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--card-border);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.ad-date {
  margin-bottom: 0.25rem;
}

.ad-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

.btn-icon {
  padding: 0.5rem;
  background: var(--surface-alt);
  border: 2px solid var(--card-border);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-danger:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--surface);
  border: 2px solid var(--card-border);
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--card-border);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.btn-close {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
}

.btn-close:hover {
  color: var(--accent);
}

.modal-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--background);
  border: 2px solid var(--card-border);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.ad-preview-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--background);
  border: 2px solid var(--card-border);
  border-radius: 12px;
}

.preview-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ad-card-preview {
  background: var(--surface);
  border: 2px solid var(--card-border);
  padding: 14px;
  border-radius: 14px;
}

.ad-eyebrow-preview {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  color: var(--text-secondary);
}

.ad-title-preview {
  margin-top: 6px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
}

.ad-sub-preview {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 13px;
}

.ad-cta-preview {
  margin-top: 10px;
  width: 100%;
  padding: 8px 10px;
  background: var(--accent);
  color: #0b1021;
  border-radius: 10px;
  font-weight: 700;
  border: 2px solid var(--accent-strong);
  cursor: default;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--card-border);
}

.alert-error {
  margin-bottom: 1.5rem;
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 1rem;
  border-radius: 8px;
}

.alert-success {
  margin-bottom: 1.5rem;
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  padding: 1rem;
  border-radius: 8px;
}
</style>
