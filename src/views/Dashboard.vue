<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p v-if="user">Bem-vindo, {{ user.name }}!</p>
    <p v-if="user">Você está logado como {{ user.userType }}.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})
</script>
