#!/usr/bin/env node

/**
 * Smoke Test - API Kadesh
 * Testa os principais endpoints da API
 */

const BASE_URL = 'http://localhost/kadesh/api';

async function testEndpoint(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${path} - Status: ${response.status}`);
    return { success: true, status: response.status, data };
  } catch (error) {
    console.error(`❌ ${method} ${path} - Erro: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Iniciando Smoke Tests da API Kadesh\n');

  // Test 1: Health check (projects list)
  await testEndpoint('GET', '/projects');

  // Test 2: Login (contratante)
  const loginResult = await testEndpoint('POST', '/login', {
    email: 'contratante@teste.com',
    password: 'Teste@123'
  });

  if (loginResult.success) {
    console.log('🔐 Login bem-sucedido!\n');
  }

  // Test 3: Get user info (requer sessão)
  await testEndpoint('GET', '/user');

  // Test 4: Get specific project
  await testEndpoint('GET', '/projects/1');

  console.log('\n✨ Smoke Tests concluídos!');
}

runTests().catch(console.error);
