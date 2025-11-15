# Guia de Usuários de Exemplo - Kadesh

Este documento contém as credenciais dos usuários de exemplo criados para demonstração da plataforma Kadesh.

## 🔐 Acesso Administrativo

### Administrador do Sistema
- **Email:** admin@kadesh.local
- **Senha:** admin123
- **Acesso:** [/admin/login](http://localhost:3000/admin/login)
- **Permissões:** Acesso completo ao painel administrativo

**Funcionalidades do Admin:**
- Dashboard com estatísticas da plataforma
- Gerenciamento de usuários (listar, suspender, excluir)
- Gerenciamento de projetos (moderar, excluir)
- Gerenciamento de pagamentos
- Configurações do sistema

---

## 👥 Usuários Contratantes (Clientes)

Estes usuários representam empresas e pessoas que contratam serviços na plataforma.

### 1. Maria Silva - Startup Tech
- **Email:** maria.silva@example.com
- **Senha:** kadesh2025
- **Tipo:** Cliente
- **Perfil:** CEO de startup de tecnologia
- **Localização:** São Paulo, SP
- **Projetos:** Criou projeto de "Desenvolvimento de Website Institucional" (R$ 8.000) e "Criação de Conteúdo para Blog" (R$ 3.000)

### 2. João Santos - E-commerce
- **Email:** joao.santos@example.com
- **Senha:** kadesh2025
- **Tipo:** Cliente
- **Perfil:** Dono de e-commerce em crescimento
- **Localização:** Rio de Janeiro, RJ
- **Projetos:** Criou projeto de "App Mobile para E-commerce" (R$ 15.000)

### 3. Ana Costa - Marketing Digital
- **Email:** ana.costa@example.com
- **Senha:** kadesh2025
- **Tipo:** Cliente
- **Perfil:** Agência de marketing digital
- **Localização:** Fortaleza, CE
- **Projetos:** Criou projeto de "Design UX/UI para Plataforma SaaS" (R$ 5.000)

---

## 🛠️ Usuários Fornecedores (Prestadores de Serviço)

Estes usuários representam profissionais freelancers que oferecem serviços na plataforma.

### 1. Pedro Oliveira - Dev Full Stack
- **Email:** pedro.oliveira@example.com
- **Senha:** kadesh2025
- **Tipo:** Fornecedor
- **Perfil:** Desenvolvedor Full Stack Sênior
- **Localização:** São Paulo, SP
- **Especialidades:** React, Node.js, PostgreSQL, JavaScript, TypeScript, Vue.js
- **Experiência:** 8 anos
- **Taxa Horária:** R$ 150/hora
- **Avaliação:** 4.8/5.0 (24 reviews)
- **Projetos Concluídos:** 45
- **Saldo:** R$ 8.500,00
- **Propostas:** Enviou proposta de R$ 7.500 para o projeto de Website

### 2. Carla Mendes - Designer UX/UI
- **Email:** carla.mendes@example.com
- **Senha:** kadesh2025
- **Tipo:** Fornecedor
- **Perfil:** Designer UX/UI
- **Localização:** Belo Horizonte, MG
- **Especialidades:** Figma, Adobe XD, Sketch, UX Research, Prototyping
- **Experiência:** 5 anos
- **Taxa Horária:** R$ 120/hora
- **Avaliação:** 4.9/5.0 (18 reviews)
- **Projetos Concluídos:** 32
- **Saldo:** R$ 6.500,00
- **Propostas:** Enviou proposta de R$ 4.500 para o projeto de Design UX/UI

### 3. Ricardo Alves - Mobile Dev
- **Email:** ricardo.alves@example.com
- **Senha:** kadesh2025
- **Tipo:** Fornecedor
- **Perfil:** Desenvolvedor Mobile
- **Localização:** Curitiba, PR
- **Especialidades:** React Native, Flutter, iOS, Android, Firebase
- **Experiência:** 6 anos
- **Taxa Horária:** R$ 140/hora
- **Avaliação:** 4.7/5.0 (15 reviews)
- **Projetos Concluídos:** 28
- **Saldo:** R$ 12.000,00
- **Propostas:** Enviou proposta de R$ 14.000 para o projeto de App Mobile

### 4. Juliana Pereira - Redatora
- **Email:** juliana.pereira@example.com
- **Senha:** kadesh2025
- **Tipo:** Fornecedor
- **Perfil:** Redatora e Estrategista de Conteúdo
- **Localização:** Porto Alegre, RS
- **Especialidades:** SEO, Copywriting, Content Strategy, Blog Posts
- **Experiência:** 4 anos
- **Taxa Horária:** R$ 90/hora
- **Avaliação:** 4.6/5.0 (22 reviews)
- **Projetos Concluídos:** 38
- **Saldo:** R$ 4.000,00
- **Propostas:** Enviou proposta de R$ 2.800 para o projeto de Conteúdo

---

## 📋 Projetos de Exemplo

### 1. Desenvolvimento de Website Institucional
- **Cliente:** Maria Silva
- **Orçamento:** R$ 8.000,00
- **Prazo:** 30 dias
- **Categoria:** Desenvolvimento Web
- **Status:** Aberto (recebendo propostas)
- **Propostas:** 1 (Pedro Oliveira - R$ 7.500)

### 2. App Mobile para E-commerce
- **Cliente:** João Santos
- **Orçamento:** R$ 15.000,00
- **Prazo:** 60 dias
- **Categoria:** Desenvolvimento Mobile
- **Status:** Aberto (recebendo propostas)
- **Propostas:** 1 (Ricardo Alves - R$ 14.000)

### 3. Design UX/UI para Plataforma SaaS
- **Cliente:** Ana Costa
- **Orçamento:** R$ 5.000,00
- **Prazo:** 45 dias
- **Categoria:** Design
- **Status:** Aberto (recebendo propostas)
- **Propostas:** 1 (Carla Mendes - R$ 4.500)

### 4. Criação de Conteúdo para Blog - 10 Artigos
- **Cliente:** Maria Silva
- **Orçamento:** R$ 3.000,00
- **Prazo:** 20 dias
- **Categoria:** Marketing
- **Status:** Aberto (recebendo propostas)
- **Propostas:** 1 (Juliana Pereira - R$ 2.800)

---

## 🚀 Como Usar

### Para Testar como Cliente:
1. Acesse http://localhost:3000
2. Faça login com um dos emails de cliente (ex: maria.silva@example.com)
3. Senha: kadesh2025
4. Você verá seus projetos criados e poderá:
   - Ver propostas recebidas
   - Aceitar/rejeitar propostas
   - Criar novos projetos

### Para Testar como Fornecedor:
1. Acesse http://localhost:3000
2. Faça login com um dos emails de fornecedor (ex: pedro.oliveira@example.com)
3. Senha: kadesh2025
4. Você poderá:
   - Ver projetos disponíveis
   - Enviar propostas
   - Gerenciar suas propostas
   - Ver seu saldo e transações

### Para Testar como Administrador:
1. Acesse http://localhost:3000/admin/login
2. Email: admin@kadesh.local
3. Senha: admin123
4. Você terá acesso a:
   - Dashboard com estatísticas
   - Gerenciamento de usuários
   - Gerenciamento de projetos
   - Gerenciamento de pagamentos
   - Configurações do sistema

---

## 📊 Estatísticas Iniciais

- **Total de Usuários:** 7 (3 clientes + 4 fornecedores)
- **Total de Projetos:** 4
- **Total de Propostas:** 4
- **Volume de Transações:** R$ 30.500,00 (histórico dos fornecedores)

---

## 🔄 Resetar Dados

Para resetar os dados de exemplo e começar do zero:

```bash
# Conecte ao banco de dados
psql -U postgres -d kadesh_dev

# Execute o schema novamente
\i database/schema.sql

# Execute a migration com os dados de exemplo
\i database/migration_001_wallet_and_samples.sql
```

---

## 📝 Notas Importantes

1. **Senhas**: Todas as senhas estão hasheadas com bcrypt no banco de dados
2. **Email Verificado**: Todos os usuários de exemplo têm email verificado (email_verified = true)
3. **Saldos**: Os fornecedores já possuem saldo em carteira simulando trabalhos anteriores
4. **Avaliações**: As avaliações dos fornecedores são simuladas para demonstração

---

## 🛡️ Segurança

⚠️ **IMPORTANTE:** Estes são dados de exemplo para desenvolvimento/demonstração.

**Antes de ir para produção:**
- Remova ou altere o usuário admin padrão
- Use senhas fortes e únicas
- Ative autenticação de dois fatores
- Configure backup automático do banco de dados
- Implemente logs de auditoria

---

## 📞 Suporte

Para dúvidas ou problemas com os dados de exemplo, consulte a documentação principal do projeto.

**Desenvolvido com ❤️ para a plataforma Kadesh**
