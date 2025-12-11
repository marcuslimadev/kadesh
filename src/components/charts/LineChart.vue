<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    default: 'Dados'
  }
})

const chartData = computed(() => ({
  labels: props.data.labels || [],
  datasets: [
    {
      label: props.label,
      data: props.data.values || [],
      borderColor: '#D4AF37',
      backgroundColor: 'rgba(212, 175, 55, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#D4AF37',
      pointBorderColor: '#0F1117',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#161821',
      titleColor: '#F5F5F5',
      bodyColor: '#C7C7C7',
      borderColor: 'rgba(212, 175, 55, 0.3)',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y || 0
          return `${label}: R$ ${value.toFixed(2).replace('.', ',')}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#C7C7C7',
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(212, 175, 55, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#C7C7C7',
        font: {
          size: 11
        },
        callback: (value) => {
          return `R$ ${value.toFixed(0)}`
        }
      }
    }
  }
}))
</script>
