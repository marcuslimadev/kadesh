import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

async function run() {
  const results = [];
  function push(name, ok, extra='') { results.push({ name, ok, extra }); }

  // 1. Public list projects
  try {
    const { data } = await api.get('/projects');
    push('GET /projects', Array.isArray(data.data) || Array.isArray(data));
  } catch (e) { push('GET /projects', false, e.message); }

  // 2. Try create without auth (should 401/403)
  try {
    await api.post('/projects', { title:'X',description:'Y',max_budget:10,bidding_ends_at:new Date().toISOString() });
    push('POST /projects (unauthenticated)', false, 'Should not allow');
  } catch (e) { push('POST /projects (unauthenticated)', e.response?.status === 401 || e.response?.status === 403, e.response?.status); }

  console.table(results);
}

run();