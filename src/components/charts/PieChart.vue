<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const chartData = computed(() => ({
  labels: props.data.labels || [],
  datasets: [
    {
      data: props.data.values || [],
      backgroundColor: [
        '#D4AF37', // Gold
        '#E5C04A', // Light Gold
        '#B8962E', // Dark Gold
        '#8A8A8A', // Gray
        '#C7C7C7'  // Light Gray
      ],
      borderColor: '#0F1117',
      borderWidth: 2
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#F5F5F5',
        font: {
          size: 12,
          family: 'Inter, system-ui, sans-serif'
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: '#161821',
      titleColor: '#F5F5F5',
      bodyColor: '#C7C7C7',
      borderColor: 'rgba(212, 175, 55, 0.3)',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.parsed || 0
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  }
}))
</script>
