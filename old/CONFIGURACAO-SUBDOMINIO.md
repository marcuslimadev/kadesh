# 🌐 Configuração de Subdomínio - Kadesh

## 📋 Passo a Passo no cPanel

### 1. **Criar Subdomínio**
1. Acesse **cPanel → Subdomains**
2. **Subdomain:** `kadesh`
3. **Domain:** `mmbsites.com.br` 
4. **Document Root:** `/home/mmbsites/public_html/kadesh/public` ⚠️ **IMPORTANTE: Deve apontar para a pasta PUBLIC**

### 2. **Configurar Banco de Dados**
1. Acesse **cPanel → MySQL Databases**
2. **Create Database:** `mmbsites_kadesh`
3. **Create User:** `mmbsites_kadesh` 
4. **Assign User to Database** com todos os privilégios

### 3. **Deploy do Projeto**
1. Acesse **cPanel → Git Version Control**
2. Clique em **"Deploy HEAD Commit"**
3. Aguarde a conclusão do processo

### 4. **Configurar Arquivo .env**
Após o deploy, edite o arquivo `.env` na raiz do projeto com:
```bash
DB_DATABASE=mmbsites_kadesh
DB_USERNAME=mmbsites_kadesh  
DB_PASSWORD=SUA_SENHA_AQUI
```

### 5. **Executar Migrações (se necessário)**
Via SSH ou File Manager, execute:
```bash
cd /home/mmbsites/public_html/kadesh
php artisan migrate --force
```

## 🎯 **URLs Finais**
- **Aplicação:** https://kadesh.mmbsites.com.br
- **Arquivos:** /home/mmbsites/public_html/kadesh/
- **Document Root:** /home/mmbsites/public_html/kadesh/public/

## ⚠️ **Pontos Importantes**

1. **Document Root DEVE apontar para `/public`** - Laravel exige isso
2. **Certificado SSL** será gerado automaticamente pelo cPanel
3. **Permissões** serão configuradas automaticamente pelo deploy
4. **Cache** será otimizado automaticamente

## 🔧 **Se der problema:**

### SSL não funciona:
- Aguarde até 24h para propagação
- Force SSL em cPanel → SSL/TLS

### Erro 500:
- Verifique logs em `/home/mmbsites/public_html/kadesh/storage/logs/`
- Confirme permissões das pastas `storage` e `bootstrap/cache`

### Banco não conecta:
- Verifique credenciais no arquivo `.env`
- Confirme que o usuário tem privilégios no banco

---
**✅ Após esses passos, seu Kadesh estará rodando em: https://kadesh.mmbsites.com.br**