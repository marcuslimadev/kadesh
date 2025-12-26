<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { differenceInSeconds, isPast } from 'date-fns'

const props = defineProps({
  deadline: { type: String, required: true },
  variant: { type: String, default: 'default' } // 'default', 'badge', 'large'
})

const now = ref(new Date())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const timeLeft = computed(() => {
  const deadlineDate = new Date(props.deadline)
  
  if (isPast(deadlineDate)) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      display: 'Encerrado',
      urgent: false
    }
  }
  
  const seconds = differenceInSeconds(deadlineDate, now.value)
  
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds: secs,
    display: days > 0 
      ? `${days}d ${hours}h ${minutes}m`
      : `${hours}h ${minutes}m ${secs}s`,
    urgent: seconds < 3600, // < 1 hora
    critical: seconds < 600 // < 10 minutos
  }
})
</script>

<template>
  <!-- Variant: Badge (para cards) -->
  <div v-if="variant === 'badge'" class="countdown-badge-wrapper">
    <div
      :class="[
        'countdown-badge',
        {
          'countdown-urgent': timeLeft.critical && !timeLeft.expired,
          'countdown-warning': timeLeft.urgent && !timeLeft.critical && !timeLeft.expired,
          'countdown-expired': timeLeft.expired
        }
      ]"
    >
      <svg class="w-4 h-4" :class="{ 'animate-pulse': timeLeft.urgent }" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
      </svg>
      <span class="countdown-text">{{ timeLeft.display }}</span>
    </div>
  </div>

  <!-- Variant: Large (para páginas de detalhes) -->
  <div v-else-if="variant === 'large'" class="countdown-large">
    <div class="countdown-label">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
      </svg>
      <span>{{ timeLeft.expired ? 'Leilão Encerrado' : 'Finaliza em:' }}</span>
    </div>
    
    <div v-if="!timeLeft.expired" class="countdown-units">
      <div class="countdown-unit">
        <span class="countdown-value">{{ String(timeLeft.days).padStart(2, '0') }}</span>
        <span class="countdown-unit-label">Dias</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-unit">
        <span class="countdown-value">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
        <span class="countdown-unit-label">Horas</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-unit">
        <span class="countdown-value">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
        <span class="countdown-unit-label">Min</span>
      </div>
      <span class="countdown-separator">:</span>
      <div class="countdown-unit">
        <span class="countdown-value">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
        <span class="countdown-unit-label">Seg</span>
      </div>
    </div>
  </div>

  <!-- Variant: Default (inline simples) -->
  <div v-else class="countdown-default">
    <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
    </svg>
    <span :class="{ 'text-red-600 font-semibold': timeLeft.urgent }">
      {{ timeLeft.display }}
    </span>
  </div>
</template>

<style scoped>
/* Badge Variant */
.countdown-badge-wrapper {
  display: inline-block;
}

.countdown-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.countdown-badge:not(.countdown-expired) {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.countdown-warning {
  background: rgba(251, 191, 36, 0.15) !important;
  color: #f59e0b !important;
  border-color: rgba(251, 191, 36, 0.4) !important;
}

.countdown-urgent {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #dc2626 !important;
  border-color: rgba(239, 68, 68, 0.4) !important;
  animation: pulse-urgent 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.countdown-expired {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.2);
}

@keyframes pulse-urgent {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Large Variant */
.countdown-large {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 24px;
}

.countdown-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #D4AF37;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.countdown-units {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.countdown-value {
  font-size: 32px;
  font-weight: 700;
  color: #D4AF37;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.countdown-unit-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.countdown-separator {
  font-size: 28px;
  font-weight: 700;
  color: #475569;
  margin: 0 4px;
}

/* Default Variant */
.countdown-default {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}
</style>
