<template>
  <div class="countdown-timer" :class="urgencyClass">
    <div v-if="isExpired" class="expired-state">
      <span class="font-bold text-neutral-500 text-sm bg-neutral-100 px-3 py-1 rounded-full">
        ENCERRADO
      </span>
    </div>
    
    <div v-else class="time-display">
      <!-- Tempo principal -->
      <div class="main-time" :class="mainTimeClass">
        {{ formattedTime }}
      </div>
      
      <!-- Detalhes (opcional) -->
      <div v-if="showDetails && !isUrgent" class="time-details text-xs text-neutral-500 mt-1">
        <span v-if="days > 0">{{ days }}d </span>
        <span v-if="hours > 0">{{ hours }}h </span>
        <span v-if="minutes > 0">{{ minutes }}m </span>
        <span>{{ seconds }}s</span>
      </div>
      
      <!-- Label -->
      <div v-if="label" class="time-label text-xs text-neutral-500 mt-1">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  endDate: {
    type: [String, Date],
    required: true
  },
  label: {
    type: String,
    default: 'Tempo restante'
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: value => ['small', 'medium', 'large'].includes(value)
  }
});

const emit = defineEmits(['expired', 'urgent', 'timeUpdate']);

// Estado reativo
const currentTime = ref(new Date());
const interval = ref(null);

// Cálculos de tempo
const endTime = computed(() => new Date(props.endDate));

const timeDiff = computed(() => {
  const diff = endTime.value.getTime() - currentTime.value.getTime();
  return Math.max(0, diff);
});

const isExpired = computed(() => timeDiff.value <= 0);

const days = computed(() => Math.floor(timeDiff.value / (1000 * 60 * 60 * 24)));
const hours = computed(() => Math.floor((timeDiff.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
const minutes = computed(() => Math.floor((timeDiff.value % (1000 * 60 * 60)) / (1000 * 60)));
const seconds = computed(() => Math.floor((timeDiff.value % (1000 * 60)) / 1000));

// Estados de urgência
const totalHours = computed(() => timeDiff.value / (1000 * 60 * 60));
const isUrgent = computed(() => totalHours.value <= 2 && !isExpired.value);
const isCritical = computed(() => totalHours.value <= 0.5 && !isExpired.value);

// Formatação do tempo principal
const formattedTime = computed(() => {
  if (isExpired.value) return '00:00:00';
  
  if (days.value > 0) {
    return `${days.value}d ${hours.value.toString().padStart(2, '0')}h`;
  } else if (hours.value > 0) {
    return `${hours.value.toString().padStart(2, '0')}:${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.value.toString().padStart(2, '0')}:${seconds.value.toString().padStart(2, '0')}`;
  }
});

// Classes CSS dinâmicas
const urgencyClass = computed(() => {
  if (isExpired.value) return 'expired';
  if (isCritical.value) return 'critical';
  if (isUrgent.value) return 'urgent';
  return 'normal';
});

const mainTimeClass = computed(() => {
  const base = 'font-bold transition-all duration-300';
  const sizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  
  const colors = {
    normal: 'text-success-600',
    urgent: 'text-warning-600',
    critical: 'text-danger-600 ',
    expired: 'text-neutral-500'
  };
  
  return `${base} ${sizes[props.size]} ${colors[urgencyClass.value]}`;
});

// Funções
function updateTime() {
  const oldTime = currentTime.value;
  currentTime.value = new Date();
  
  // Emitir eventos
  emit('timeUpdate', {
    remaining: timeDiff.value,
    days: days.value,
    hours: hours.value,
    minutes: minutes.value,
    seconds: seconds.value
  });
  
  // Detectar mudanças de estado
  const wasExpired = endTime.value.getTime() - oldTime.getTime() <= 0;
  if (!wasExpired && isExpired.value) {
    emit('expired');
  }
  
  const wasUrgent = (endTime.value.getTime() - oldTime.getTime()) / (1000 * 60 * 60) <= 2;
  if (!wasUrgent && isUrgent.value) {
    emit('urgent');
  }
}

function startTimer() {
  updateTime(); // Update inicial
  interval.value = setInterval(updateTime, 1000);
}

function stopTimer() {
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
}

// Lifecycle
onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});

// Exportar funções para uso externo
defineExpose({
  startTimer,
  stopTimer,
  updateTime,
  isExpired,
  timeDiff
});
</script>

<style scoped>
.countdown-timer {
  display: inline-block;
}

.countdown-timer.normal {
  color: rgb(56 161 105); /* success-600 */
}

.countdown-timer.urgent {
  color: rgb(237 137 54); /* warning-600 */
}

.countdown-timer.critical {
  color: rgb(229 62 62); /* danger-600 */
}

.countdown-timer.expired {
  color: rgb(113 128 150); /* neutral-500 */
}

.time-display {
  text-align: center;
}

.expired-state {
  text-align: center;
}

/* Animação para estado crítico */
.countdown-timer.critical .main-time {
  animation: pulse-danger 2s infinite;
}

@keyframes pulse-danger {
  0%, 100% {
    color: rgb(229 62 62); /* danger-600 */
  }
  50% {
    color: rgb(248 113 113); /* danger-400 */
  }
}
</style>



