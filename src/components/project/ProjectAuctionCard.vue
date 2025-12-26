<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CountdownTimer from '../CountdownTimer.vue'

const props = defineProps({
  project: { type: Object, required: true },
  bidCount: { type: Number, default: 0 },
  lowestBid: { type: Number, default: null }
})

const router = useRouter()

const categoryLabels = {
  development: 'Desenvolvimento',
  design: 'Design',
  marketing: 'Marketing',
  writing: 'Redação',
  consulting: 'Consultoria',
  other: 'Outros'
}

const statusLabels = {
  open: 'LEILÃO PÚBLICO',
  in_progress: 'EM ANDAMENTO',
  completed: 'CONCLUÍDO',
  cancelled: 'CANCELADO'
}

const discount = computed(() => {
  if (!props.lowestBid || !props.project.budget) return null
  const diff = props.project.budget - props.lowestBid
  const percentage = (diff / props.project.budget) * 100
  return percentage > 0 ? Math.floor(percentage) : null
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '---'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewAuction = () => {
  router.push(`/projects/${props.project.id}`)
}
</script>

<template>
  <div class="auction-card-monitor">
    <!-- Image Section -->
    <div class="auction-image-wrapper">
      <img
        v-if="project.attachments && project.attachments.length > 0"
        :src="project.attachments[0]"
        :alt="project.title"
        class="auction-image"
      />
      <div v-else class="auction-image-placeholder">
        <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <!-- Badges Overlay -->
      <div class="auction-badges">
        <span class="badge-status">{{ statusLabels[project.status] || 'LEILÃO' }}</span>
        <span v-if="discount" class="badge-discount">{{ discount }}% OFF</span>
      </div>
    </div>

    <!-- Content Section -->
    <div class="auction-content">
      <!-- Title (Blurred for premium) -->
      <h3 class="auction-title blur-premium">
        {{ project.title }}
      </h3>

      <!-- Características -->
      <div class="auction-features">
        <div class="feature-item">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{{ categoryLabels[project.category] || project.category }}</span>
        </div>

        <div class="feature-item">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ bidCount }} Proposta(s)</span>
        </div>
      </div>

      <!-- Formas de Pagamento -->
      <div class="payment-methods">
        <div class="payment-method">
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Escrow (Garantido)</span>
        </div>
      </div>

      <!-- Countdown -->
      <div class="auction-deadline">
        <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        <span class="deadline-label">Finaliza em:</span>
        <span class="deadline-value">{{ formatDate(project.deadline) }}</span>
      </div>

      <div class="countdown-wrapper">
        <CountdownTimer :deadline="project.deadline" variant="badge" />
      </div>

      <!-- Valores -->
      <div class="auction-values">
        <div class="value-section">
          <p class="value-label">Valor mínimo:</p>
          <p class="value-amount">{{ formatCurrency(lowestBid || project.budget) }}</p>
          <p v-if="lowestBid && lowestBid < project.budget" class="value-original">
            {{ formatCurrency(project.budget) }}
          </p>
        </div>
      </div>

      <!-- CTA Button -->
      <button @click="viewAuction" class="btn-view-auction">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Ver Leilão</span>
      </button>
    </div>

    <!-- Premium Badge (like Monitor Leilão) -->
    <div class="premium-badge">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span>Premium</span>
    </div>
  </div>
</template>

<style scoped>
.auction-card-monitor {
  position: relative;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e5e7eb;
}

.auction-card-monitor:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: #D4AF37;
}

/* Image Section */
.auction-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.auction-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.auction-card-monitor:hover .auction-image {
  transform: scale(1.05);
}

.auction-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

/* Badges */
.auction-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.badge-status {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(15, 17, 23, 0.9);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-discount {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
}

/* Content Section */
.auction-content {
  padding: 20px;
}

.auction-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blur-premium {
  filter: blur(2px);
  user-select: none;
}

/* Features */
.auction-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

/* Payment Methods */
.payment-methods {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #059669;
  font-weight: 500;
}

/* Deadline */
.auction-deadline {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.deadline-label {
  font-weight: 500;
}

.deadline-value {
  font-weight: 600;
  color: #374151;
}

.countdown-wrapper {
  margin-bottom: 16px;
}

/* Values */
.auction-values {
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
}

.value-section {
  text-align: center;
}

.value-label {
  font-size: 12px;
  color: #78350f;
  font-weight: 500;
  margin-bottom: 4px;
}

.value-amount {
  font-size: 24px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 2px;
}

.value-original {
  font-size: 14px;
  color: #78350f;
  text-decoration: line-through;
  opacity: 0.7;
}

/* CTA Button */
.btn-view-auction {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #D4AF37;
  color: #0F1117;
  font-size: 14px;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-auction:hover {
  background: #E5C04A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

/* Premium Badge */
.premium-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #D4AF37 0%, #E5C04A 100%);
  color: #0F1117;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}
</style>
