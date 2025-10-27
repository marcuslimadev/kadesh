<template>
  <div class="score-progress">
    <!-- Header do placar -->
    <div class="flex justify-between items-center text-sm mb-2">
      <span class="text-gray-700 font-semibold">
        {{ label }}
      </span>
      <span class="font-bold text-lg" :class="scoreColorClass">
        {{ Math.round(totalScore) }}%
      </span>
    </div>
    
    <!-- Barra de progresso -->
    <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner border border-gray-300">
      <div 
        class="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
        :class="progressBarClass"
        :style="{ width: `${Math.min(100, Math.max(0, totalScore))}%` }"
      >
      </div>
    </div>
    
    <!-- Breakdown detalhado (opcional) -->
    <div v-if="showBreakdown" class="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div class="text-xs text-gray-700">
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold"> Preço ({{ priceWeight }}%)</span>
          <span class="font-bold text-gray-950">{{ Math.round(priceScore) }}pts</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 border border-gray-300">
          <div 
            class="h-full bg-gray-900 rounded-full transition-all duration-500"
            :style="{ width: `${priceScore}%` }"
          ></div>
        </div>
      </div>
      
      <div class="text-xs text-gray-700">
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold"> Reputação ({{ reputationWeight }}%)</span>
          <span class="font-bold text-gray-950">{{ Math.round(reputationScore) }}pts</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 border border-gray-300">
          <div 
            class="h-full bg-gray-700 rounded-full transition-all duration-500"
            :style="{ width: `${reputationScore}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Info adicional -->
    <div v-if="showInfo" class="mt-2 text-xs text-gray-600 font-medium">
      {{ infoText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Dados do lance/projeto
  bidAmount: {
    type: Number,
    required: true
  },
  maxBudget: {
    type: Number,
    required: true
  },
  providerRating: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 5
  },
  
  // Pesos do cálculo
  priceWeight: {
    type: Number,
    default: 70 // 70%
  },
  reputationWeight: {
    type: Number,
    default: 30 // 30%
  },
  
  // Aparência
  label: {
    type: String,
    default: 'Placar (70% preço + 30% reputação)'
  },
  showBreakdown: {
    type: Boolean,
    default: false
  },
  showInfo: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  }
});

// Cálculos do score
const priceScore = computed(() => {
  if (props.maxBudget <= 0) return 0;
  
  // Quanto menor o lance, maior o score de preço
  const savings = props.maxBudget - props.bidAmount;
  const maxSavings = props.maxBudget;
  
  if (savings <= 0) return 0; // Lance acima do orçamento
  
  return Math.min(100, (savings / maxSavings) * 100);
});

const reputationScore = computed(() => {
  // Converter rating 0-5 para 0-100
  return (props.providerRating / 5) * 100;
});

const totalScore = computed(() => {
  const weightedPrice = (priceScore.value * props.priceWeight) / 100;
  const weightedReputation = (reputationScore.value * props.reputationWeight) / 100;
  
  return weightedPrice + weightedReputation;
});

// Classes CSS dinâmicas
const scoreColorClass = computed(() => {
  const score = totalScore.value;
  
  if (score >= 90) return 'text-gray-950';
  if (score >= 70) return 'text-gray-900';
  if (score >= 50) return 'text-gray-800';
  if (score >= 30) return 'text-gray-700';
  return 'text-gray-600';
});

const progressBarClass = computed(() => {
  const score = totalScore.value;
  
  if (score >= 90) return 'bg-gray-950 shadow-lg';
  if (score >= 70) return 'bg-gray-900 shadow-md';
  if (score >= 50) return 'bg-gray-800';
  if (score >= 30) return 'bg-gray-700';
  return 'bg-gray-600';
});

const infoText = computed(() => {
  const score = totalScore.value;
  
  if (score >= 90) return 'Excelente proposta! Ótimo equilíbrio preço-qualidade.';
  if (score >= 70) return 'Boa proposta com bom custo-benefício.';
  if (score >= 50) return 'Proposta razoável, considere outros fatores.';
  if (score >= 30) return 'Proposta com algumas limitações.';
  return 'Proposta precisa de melhorias significativas.';
});

// Emitir mudanças de score
const emit = defineEmits(['scoreChange']);

// Watch para emitir mudanças
import { watch } from 'vue';
watch(totalScore, (newScore) => {
  emit('scoreChange', {
    total: newScore,
    price: priceScore.value,
    reputation: reputationScore.value,
    breakdown: {
      weightedPrice: (priceScore.value * props.priceWeight) / 100,
      weightedReputation: (reputationScore.value * props.reputationWeight) / 100
    }
  });
}, { immediate: true });
</script>

<style scoped>
/* Animação customizada para barra de progresso */
@keyframes score-fill {
  0% {
    width: 0%;
  }
  100% {
    width: var(--final-width);
  }
}

/* Hover effects */
.score-progress:hover .bg-gray-950,
.score-progress:hover .bg-gray-900,
.score-progress:hover .bg-gray-800,
.score-progress:hover .bg-gray-700,
.score-progress:hover .bg-gray-600 {
  transform: scaleY(1.1);
  transition: 0.2s ease;
}
</style>



