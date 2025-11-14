# Configuração do Kadesh

## 📋 Visão Geral

O sistema Kadesh agora utiliza um arquivo de configuração centralizado que permite ajustar facilmente a baseURL da API e outras configurações sem precisar modificar o código compilado.

## 📁 Arquivos de Configuração

### `config.js`
Contém todas as configurações da aplicação:
- **API_BASE_URL**: URL base da API
- **APP_BASE_PATH**: Caminho base da aplicação
- **SESSION**: Configurações de sessão
- **URLS**: URLs importantes do sistema

### `kadesh-init.js`
Script que intercepta as requisições de rede e aplica as configurações do `config.js`.

## ⚙️ Como Configurar

### Para Produção (Raiz do Site)
```javascript
window.KADESH_CONFIG.API_BASE_URL = '/api';
window.KADESH_CONFIG.APP_BASE_PATH = '';
```

### Para Subdiretório
```javascript
window.KADESH_CONFIG.API_BASE_URL = '/kadesh/api';
window.KADESH_CONFIG.APP_BASE_PATH = '/kadesh';
```

### Para Desenvolvimento Local
```javascript
window.KADESH_CONFIG.API_BASE_URL = '/api';
window.KADESH_CONFIG.APP_BASE_PATH = '';
```

### Para Domínio Próprio
```javascript
window.KADESH_CONFIG.API_BASE_URL = '/api';
window.KADESH_CONFIG.APP_BASE_PATH = '';
```

## 🔧 Alterando Configurações

1. **Edite apenas o arquivo `config.js`**
2. **Não modifique o JavaScript compilado**
3. **As mudanças são aplicadas automaticamente**

### Exemplo de Mudança Rápida:
```javascript
// No arquivo config.js, mude:
API_BASE_URL: '/kadesh/api',

// Para (exemplo - desenvolvimento local):
API_BASE_URL: '/api',
```

## 🧪 Debug e Testes

Você pode usar o console do navegador para verificar as configurações:

```javascript
// Verificar configuração atual
console.log(window.KADESH_CONFIG);

// Debug das requisições
window.debugKadeshRequests();
```

## ✅ Vantagens desta Abordagem

1. **✅ Fácil manutenção**: Um único arquivo para alterar
2. **✅ Não modifica código compilado**: Preserva integridade
3. **✅ Suporte a múltiplos ambientes**: Dev, staging, produção
4. **✅ Debug facilitado**: Logs no console
5. **✅ Interceptação inteligente**: Funciona com qualquer biblioteca HTTP

## 🚀 Deploy

Para fazer deploy em diferentes ambientes:

1. **Copie a pasta `producao/`**
2. **Edite apenas o `config.js`** 
3. **Configure o servidor web** (Apache/Nginx)

## ⚠️ Importante

- **Sempre carregue `config.js` antes de `kadesh-init.js`**
- **Mantenha a ordem dos scripts no `index.html`**
- **Teste sempre após mudanças**

## 📞 Suporte

Se houver problemas:
1. Abra o console do navegador (F12)
2. Verifique se há logs do Kadesh Config
3. Execute `window.debugKadeshRequests()` para diagnóstico