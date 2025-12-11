<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
      backgroundColor: 'rgba(212, 175, 55, 0.8)',
      borderColor: '#D4AF37',
      borderWidth: 2,
      borderRadius: 8,
      barThickness: 40
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
      padding: 12
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
        }
      }
    }
  }
}))
</script>
