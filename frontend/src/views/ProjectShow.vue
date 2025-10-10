<template>
  <div v-if="loading" class="text-gray-500">Carregando...</div>
  <div v-else-if="!project" class="text-red-600">Projeto não encontrado.</div>
  <div v-else class="space-y-6">
    <header class="border-b pb-4">
      <h2 class="text-2xl font-bold mb-2">{{ project.title }}</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ project.description }}</p>
      <div class="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>Status: <strong>{{ project.status }}</strong></span>
        <span>Budget Máx: R$ {{ project.max_budget }}</span>
        <span>Deadline: {{ project.project_deadline || '-' }}</span>
        <span>Termina em: {{ project.bidding_ends_at }}</span>
      </div>
      <div v-if="project.required_skills?.length" class="mt-3 flex flex-wrap gap-2">
        <span v-for="(s,i) in project.required_skills" :key="i" class="bg-gray-200 text-xs px-2 py-1 rounded">{{ s }}</span>
      </div>
    </header>

    <section>
      <h3 class="text-lg font-semibold mb-2 flex items-center gap-2">Lances
        <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">{{ bids.length }}</span>
      </h3>
      <div v-if="bids.length === 0" class="text-sm text-gray-500">Nenhum lance ainda.</div>
      <ul class="space-y-3">
        <li v-for="b in bids" :key="b.id" class="bg-white p-4 rounded shadow flex justify-between items-start">
          <div>
            <p class="font-medium">R$ {{ b.amount }} <span class="text-xs text-gray-500">/ {{ b.delivery_time_days }} dias</span></p>
            <p class="text-sm text-gray-600 mt-1">{{ b.proposal }}</p>
            <p class="text-xs text-gray-500 mt-1">Fornecedor: {{ b.provider?.name }}</p>
          </div>
          <div v-if="canConfirmWinner && project.status==='bidding'">
            <button @click="confirmWinner(b.id)" class="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">Confirmar</button>
          </div>
        </li>
      </ul>
    </section>

    <section v-if="canBid && project.status==='bidding'" class="border-t pt-6">
      <h3 class="text-lg font-semibold mb-3">Enviar Lance</h3>
      <form @submit.prevent="submitBid" class="grid gap-4 max-w-xl">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium mb-1">Valor (R$)</label>
            <input type="number" step="0.01" v-model.number="bidForm.amount" required class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Entrega (dias)</label>
            <input type="number" v-model.number="bidForm.delivery_time_days" required class="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium mb-1">Proposta</label>
          <textarea v-model="bidForm.proposal" rows="3" required class="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div class="flex gap-3 items-center">
          <button :disabled="sendingBid" class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Enviar</button>
          <span v-if="bidError" class="text-sm text-red-600">{{ bidError }}</span>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const project = ref(null);
const bids = ref([]);
const loading = ref(false);
const user = ref(null);
const sendingBid = ref(false);
const bidError = ref('');
const bidForm = reactive({ amount: null, delivery_time_days: 1, proposal: '' });

const canBid = computed(() => !!user.value && user.value.is_provider && project.value && project.value.contractor_id !== user.value.id);
const canConfirmWinner = computed(() => !!user.value && project.value && project.value.contractor_id === user.value.id);

async function fetchUser() {
  try { const { data } = await api.get('/api/user'); user.value = data; } catch { user.value = null; }
}
async function loadProject() {
  loading.value = true;
  try {
    const { data } = await api.get(`/api/projects/${id}`);
    project.value = data;
  } catch (e) {
    project.value = null;
  } finally { loading.value = false; }
}
async function loadBids() {
  try {
    const { data } = await api.get(`/api/projects/${id}/bids`);
    bids.value = data;
  } catch { bids.value = []; }
}
async function submitBid() {
  sendingBid.value = true; bidError.value='';
  try {
    await api.post('/api/bids', { ...bidForm, project_id: project.value.id });
    bidForm.amount=null; bidForm.delivery_time_days=1; bidForm.proposal='';
    await loadBids(); await loadProject();
  } catch (e) {
    bidError.value = e.response?.data?.message || 'Erro ao enviar lance';
  } finally { sendingBid.value = false; }
}
async function confirmWinner(bidId) {
  if (!confirm('Confirmar este lance como vencedor?')) return;
  try {
    await api.post(`/api/projects/${project.value.id}/confirm-winner`, { bid_id: bidId });
    await loadProject(); await loadBids();
  } catch (e) { alert(e.response?.data?.message || 'Erro ao confirmar vencedor'); }
}

onMounted(async () => { await fetchUser(); await loadProject(); await loadBids(); });
</script>
