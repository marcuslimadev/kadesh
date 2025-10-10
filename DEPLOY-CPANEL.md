# 🚀 Deploy Kadesh - Guia cPanel

## 📋 Pré-requisitos para o cPanel

Antes de fazer o deploy, certifique-se de que seu cPanel possui:

- ✅ PHP 8.1 ou superior
- ✅ Composer instalado
- ✅ Node.js 18+ e npm
- ✅ MySQL/MariaDB
- ✅ Extensões PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## 🎯 Deploy Automático com .cpanel.yml

O projeto está configurado para deploy automático. O arquivo `.cpanel.yml` executará:

1. **Cópia dos arquivos** para `/home/mmbsites/public_html/kadesh`
2. **Instalação das dependências** PHP e Node.js
3. **Configuração do ambiente** de produção
4. **Execução das migrações** do banco de dados
5. **Compilação dos assets** otimizados
6. **Cache e otimizações** para produção

## ⚙️ Configuração Manual (se necessário)

### 1. Configurar Banco de Dados

Crie um banco de dados MySQL no cPanel:
- Nome: `mmbsites_kadesh`
- Usuário: `mmbsites_kadesh`
- Senha: (defina uma senha segura)

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto com:

```bash
DB_DATABASE=mmbsites_kadesh
DB_USERNAME=mmbsites_kadesh
DB_PASSWORD=sua_senha_aqui
APP_URL=https://mmbsites.com.br
```

### 3. Configurar Document Root

No cPanel, configure o Document Root para apontar para:
```bash
/home/mmbsites/public_html/kadesh/public
```

### 4. Executar Script de Instalação (se necessário)

```bash
cd /home/mmbsites/public_html/kadesh
chmod +x install-production.sh
./install-production.sh
```

## 🔧 Comandos Úteis para Produção

### Limpar caches:
```bash
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Recriar caches:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Recompilar assets:
```bash
npm run build
```

## 🔐 Configurações de Segurança

O `.htaccess` inclui:
- ✅ Headers de segurança (XSS, CSRF, Frame protection)
- ✅ Compressão gzip
- ✅ Cache de assets estáticos
- ✅ Bloqueio de arquivos sensíveis

## 📊 Monitoramento

### Logs importantes:
- `/storage/logs/laravel.log` - Logs da aplicação
- `/var/log/apache2/error.log` - Logs do servidor (se disponível)

### Verificar saúde da aplicação:
```bash
php artisan about
```

## 🆘 Solução de Problemas

### 1. Erro 500 - Internal Server Error
- Verificar permissões: `chmod -R 755 storage bootstrap/cache`
- Verificar logs: `tail -f storage/logs/laravel.log`

### 2. Assets não carregam
- Verificar se `npm run build` foi executado
- Verificar permissões dos arquivos em `public/build/`

### 3. Banco de dados
- Verificar credenciais no `.env`
- Executar: `php artisan migrate:status`

## 📞 Suporte

Para problemas específicos:
1. Verificar logs da aplicação
2. Executar `php artisan about` para diagnóstico
3. Consultar documentação do Laravel

---

**Status do Projeto:** ✅ Pronto para produção
**Última atualização:** $(date)
**Versão:** 1.0.0