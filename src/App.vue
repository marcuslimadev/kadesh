<template>
  <div class="min-h-screen flex flex-col">
    <router-view />
    <SessionExpiryAlert />
  </div>
</template>

<script setup>
import SessionExpiryAlert from '@/components/SessionExpiryAlert.vue'
</script>
