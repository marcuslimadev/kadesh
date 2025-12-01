// Teste manual de registro via API
import axios from 'axios';

const testUser = {
  name: 'Teste Manual',
  email: `teste.manual.${Date.now()}@kadesh.com`,
  password: 'Senha@123456'
};

console.log('Testando registro com:', testUser);

try {
  const response = await axios.post('http://localhost:3001/api/auth/register', testUser);
  console.log('✅ Registro bem-sucedido!');
  console.log('Resposta:', JSON.stringify(response.data, null, 2));
} catch (error) {
  console.log('❌ Erro no registro:');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Dados:', JSON.stringify(error.response.data, null, 2));
  } else if (error.request) {
    console.log('Nenhuma resposta recebida do servidor');
    console.log('Request:', error.request);
  } else {
    console.log('Erro ao fazer requisição:', error.message);
  }
  console.log('Stack:', error.stack);
}
