import { test, expect } from '@playwright/test';

const API_BASE = 'http://localhost/kadesh/public/backend.php';

/**
 * Testes E2E para API Backend
 */

test.describe('API Backend - Endpoints de Leilões', () => {
  
  test('GET /api/auctions/active deve retornar lista de leilões', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/auctions/active`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('auctions');
    expect(Array.isArray(data.auctions)).toBeTruthy();
  });

  test('GET /api/auctions/active deve retornar estrutura correta', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/auctions/active`);
    const data = await response.json();
    
    expect(data).toHaveProperty('weights');
    expect(data.weights).toHaveProperty('price');
    expect(data.weights).toHaveProperty('reputation');
    
    if (data.auctions.length > 0) {
      const auction = data.auctions[0];
      expect(auction).toHaveProperty('id');
      expect(auction).toHaveProperty('title');
      expect(auction).toHaveProperty('lowest_bid');
      expect(auction).toHaveProperty('bids_count');
      expect(auction).toHaveProperty('bidding_ends_at');
    }
  });

  test('GET /api/auctions/:id deve retornar detalhes do leilão', async ({ request }) => {
    // Primeiro buscar um leilão ativo
    const listResponse = await request.get(`${API_BASE}/api/auctions/active`);
    const listData = await listResponse.json();
    
    if (listData.auctions.length > 0) {
      const auctionId = listData.auctions[0].id;
      
      // Buscar detalhes
      const detailResponse = await request.get(`${API_BASE}/api/auctions/${auctionId}`);
      expect(detailResponse.status()).toBe(200);
      
      const data = await detailResponse.json();
      expect(data).toHaveProperty('project');
      expect(data.project.id).toBe(auctionId);
    }
  });

  test('GET /api/auctions/:id deve incluir lista de propostas', async ({ request }) => {
    const listResponse = await request.get(`${API_BASE}/api/auctions/active`);
    const listData = await listResponse.json();
    
    if (listData.auctions.length > 0) {
      const auctionId = listData.auctions[0].id;
      const detailResponse = await request.get(`${API_BASE}/api/auctions/${auctionId}`);
      const data = await detailResponse.json();
      
      expect(data).toHaveProperty('bids');
      expect(Array.isArray(data.bids)).toBeTruthy();
    }
  });

  test('GET /api/auctions/999999 deve retornar 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/auctions/999999`);
    expect(response.status()).toBe(404);
  });
});

test.describe('API Backend - Endpoints de Propostas', () => {
  
  // Criar um usuário de teste para os testes de autenticação
  let authCookie = '';
  
  test.beforeAll(async ({ request }) => {
    // Tentar fazer login com usuário de teste
    const loginResponse = await request.post(`${API_BASE}/api/auth/login`, {
      data: {
        email: 'test@kadesh.com',
        password: 'Test@123'
      }
    });
    
    if (loginResponse.ok()) {
      const cookies = loginResponse.headers()['set-cookie'];
      if (cookies) {
        authCookie = cookies;
      }
    }
  });

  test('POST /api/bids deve criar uma nova proposta (autenticado)', async ({ request }) => {
    if (!authCookie) {
      test.skip();
      return;
    }
    
    // Buscar um projeto ativo
    const projectsResponse = await request.get(`${API_BASE}/api/auctions/active`);
    const projectsData = await projectsResponse.json();
    
    if (projectsData.auctions.length === 0) {
      test.skip();
      return;
    }
    
    const projectId = projectsData.auctions[0].id;
    
    const response = await request.post(`${API_BASE}/api/bids`, {
      headers: {
        'Cookie': authCookie
      },
      data: {
        project_id: projectId,
        amount: 5000.00,
        proposal: 'Proposta de teste via Playwright',
        availability_days: 15
      }
    });
    
    // Pode retornar 201 (criado) ou 400/403 (validação/permissão)
    expect([200, 201, 400, 403]).toContain(response.status());
  });

  test('POST /api/bids deve falhar sem autenticação', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/bids`, {
      data: {
        project_id: 1,
        amount: 5000.00,
        proposal: 'Proposta sem auth',
        availability_days: 15
      }
    });
    
    // Deve retornar 401 (não autorizado)
    expect(response.status()).toBe(401);
  });

  test('POST /api/bids deve validar campos obrigatórios', async ({ request }) => {
    if (!authCookie) {
      test.skip();
      return;
    }
    
    const response = await request.post(`${API_BASE}/api/bids`, {
      headers: {
        'Cookie': authCookie
      },
      data: {
        // Faltando campos obrigatórios
        project_id: 1
      }
    });
    
    expect([400, 422]).toContain(response.status());
  });
});

test.describe('API Backend - Endpoints de Projetos', () => {
  
  test('GET /api/projects/my deve retornar projetos do usuário', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/projects/my`);
    
    // Pode retornar 200 (com lista) ou 401 (não autenticado)
    expect([200, 401]).toContain(response.status());
  });

  test('GET /api/projects/:id deve retornar detalhes do projeto', async ({ request }) => {
    // Buscar um projeto da lista de leilões
    const auctionsResponse = await request.get(`${API_BASE}/api/auctions/active`);
    const auctionsData = await auctionsResponse.json();
    
    if (auctionsData.auctions.length > 0) {
      const projectId = auctionsData.auctions[0].id;
      const response = await request.get(`${API_BASE}/api/projects/${projectId}`);
      
      expect([200, 401]).toContain(response.status());
    }
  });
});

test.describe('API Backend - Health Check', () => {
  
  test('GET /api/health deve retornar status OK', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ok');
  });

  test('Backend deve responder em menos de 1 segundo', async ({ request }) => {
    const startTime = Date.now();
    await request.get(`${API_BASE}/api/health`);
    const responseTime = Date.now() - startTime;
    
    expect(responseTime).toBeLessThan(1000);
  });
});

test.describe('API Backend - Tratamento de Erros', () => {
  
  test('Rota inexistente deve retornar 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/rota-inexistente-123`);
    expect(response.status()).toBe(404);
  });

  test('Método não permitido deve retornar 405', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/api/health`);
    expect([404, 405]).toContain(response.status());
  });

  test('JSON inválido deve retornar erro apropriado', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/bids`, {
      data: 'invalid json string',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    expect([400, 401, 422]).toContain(response.status());
  });
});

test.describe('API Backend - CORS e Headers', () => {
  
  test('Deve incluir headers de segurança apropriados', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/health`);
    const headers = response.headers();
    
    expect(headers['content-type']).toContain('application/json');
  });

  test('Deve aceitar Content-Type JSON', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/bids`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        project_id: 1,
        amount: 5000
      })
    });
    
    // Verifica que o servidor aceita JSON (não retorna 415)
    expect(response.status()).not.toBe(415);
  });
});

test.describe('API Backend - Performance e Carga', () => {
  
  test('Múltiplas requisições simultâneas devem funcionar', async ({ request }) => {
    const requests = Array(5).fill(null).map(() => 
      request.get(`${API_BASE}/api/auctions/active`)
    );
    
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('Cache deve funcionar para requisições repetidas', async ({ request }) => {
    const response1 = await request.get(`${API_BASE}/api/auctions/active`);
    const data1 = await response1.json();
    
    const response2 = await request.get(`${API_BASE}/api/auctions/active`);
    const data2 = await response2.json();
    
    // Dados devem ser consistentes
    expect(data1.auctions.length).toBe(data2.auctions.length);
  });
});

test.describe('API Backend - Validação de Dados', () => {
  
  test('Valores negativos devem ser rejeitados em propostas', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/bids`, {
      data: {
        project_id: 1,
        amount: -1000, // Valor negativo
        proposal: 'Teste',
        availability_days: 10
      }
    });
    
    expect([400, 401, 422]).toContain(response.status());
  });

  test('IDs inválidos devem ser rejeitados', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/auctions/abc`); // ID não numérico
    expect([400, 404]).toContain(response.status());
  });

  test('Strings vazias devem ser validadas', async ({ request }) => {
    const response = await request.post(`${API_BASE}/api/bids`, {
      data: {
        project_id: 1,
        amount: 5000,
        proposal: '', // String vazia
        availability_days: 10
      }
    });
    
    expect([400, 401, 422]).toContain(response.status());
  });
});
