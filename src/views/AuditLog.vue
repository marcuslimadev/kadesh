<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Log de Auditoria</h1>
    <div class="p-8 bg-white rounded-lg shadow-md">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in auditLogs" :key="log.id">
            <td class="px-4 py-2 whitespace-nowrap">{{ log.date }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ log.action }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ log.user }}</td>
            <td class="px-4 py-2 whitespace-nowrap">{{ log.ip }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const auditLogs = ref([
  { id: 1, date: '2023-10-12 10:00', action: 'Login', user: 'usuario@teste.com', ip: '192.168.1.1' },
  { id: 2, date: '2023-10-12 10:05', action: 'Criou Proposta #123', user: 'usuario@teste.com', ip: '192.168.1.1' },
  { id: 3, date: '2023-10-12 11:30', action: 'Deu Lance em #123', user: 'contratado@teste.com', ip: '200.200.200.1' },
])
</script>
