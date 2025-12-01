import { test, expect } from '@playwright/test';

/**
 * Testes de APIs do Backend
 * Testa endpoints de projetos, contratos, comprovantes
 */

const API_BASE_URL = 'http://localhost:3000/api';

test.describe('Backend API - Autenticação', () => {
  
  test('POST /api/auth/login - deve fazer login com sucesso', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data).toHaveProperty('user');
    expect(data.user.email).toBe('contratante@teste.com');
  });

  test('POST /api/auth/login - deve falhar com credenciais inválidas', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'invalido@teste.com',
        password: 'senhaerrada'
      }
    });
    
    expect(response.status()).toBe(401);
  });

  test('POST /api/auth/register - deve registrar novo usuário', async ({ request }) => {
    const randomEmail = `teste${Date.now()}@teste.com`;
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, {
      data: {
        name: 'Usuário Teste',
        email: randomEmail,
        password: 'senha123',
        type: 'client'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('token');
    expect(data.user.email).toBe(randomEmail);
  });
});

test.describe('Backend API - Projetos', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    // Login para obter token
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('GET /api/projects - deve listar projetos', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/projects`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.projects || data)).toBeTruthy();
  });

  test('POST /api/projects - deve criar projeto com autenticação', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Projeto de Teste E2E',
        description: 'Este é um projeto criado automaticamente durante testes E2E usando Playwright. O objetivo é validar a criação de projetos via API.',
        category: 'Desenvolvimento Web',
        budget: 3000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        skills_required: ['JavaScript', 'Node.js', 'React'],
        priority: 3
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data.project).toHaveProperty('id');
    expect(data.data.project.title).toBe('Projeto de Teste E2E');
  });

  test('POST /api/projects - deve falhar sem autenticação', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/projects`, {
      data: {
        title: 'Projeto sem Auth',
        description: 'Descrição qualquer com mais de 50 caracteres para validar',
        category: 'Design',
        budget: 1000
      }
    });
    
    expect(response.status()).toBe(401);
  });
});

test.describe('Backend API - Contratos', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('GET /api/contracts - deve listar contratos do usuário', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/contracts`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.contracts || data)).toBeTruthy();
  });
});

test.describe('Backend API - Carteira', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('GET /api/wallet - deve obter saldo da carteira', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/wallet`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('balance');
    expect(typeof data.balance).toBe('number');
  });

  test('GET /api/wallet/transactions - deve listar transações', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/wallet/transactions`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data.transactions || data)).toBeTruthy();
  });
});

test.describe('Backend API - Comprovantes (Receipts)', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('GET /api/receipts/contract/:id - deve retornar erro para contrato inexistente', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/receipts/contract/99999`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.status()).toBe(404);
  });

  test('GET /api/receipts/transaction/:id - deve retornar erro para transação inexistente', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/receipts/transaction/99999`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.status()).toBe(404);
  });

  test('GET /api/receipts/contract/:id - deve falhar sem autenticação', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/receipts/contract/1`);
    
    expect(response.status()).toBe(401);
  });
});

test.describe('Backend API - Validações', () => {
  let authToken;

  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'contratante@teste.com',
        password: 'senha123'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });

  test('POST /api/projects - deve validar campos obrigatórios', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'abc' // título muito curto
      }
    });
    
    expect(response.status()).toBe(400);
  });

  test('POST /api/projects - deve validar orçamento mínimo', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        title: 'Projeto com orçamento zero',
        description: 'Descrição válida com mais de cinquenta caracteres para passar na validação',
        category: 'Design',
        budget: 0
      }
    });
    
    expect(response.status()).toBe(400);
  });
});

test.describe('Backend API - Health Check', () => {
  
  test('GET / - servidor deve estar rodando', async ({ request }) => {
    const response = await request.get('http://localhost:3000/');
    
    expect(response.ok()).toBeTruthy();
  });
});
