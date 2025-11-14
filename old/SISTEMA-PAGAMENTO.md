# 💳 Sistema de Pagamento Kadesh - Documentação Completa

## 📊 Fluxo Geral do Pagamento

### 1️⃣ **Contratação do Serviço (Contratante)**
1. Contratante visualiza projeto
2. Fornecedores fazem propostas (bids)
3. Contratante escolhe melhor proposta
4. **PAGAMENTO IMEDIATO** - Contratante paga no ato da aceitação
5. Valor vai para conta do **Administrador** (Kadesh)
6. Projeto muda status para `in_progress`

### 2️⃣ **Execução do Serviço (Fornecedor)**
1. Fornecedor executa o trabalho
2. Fornecedor marca projeto como concluído
3. Sistema notifica Contratante

### 3️⃣ **Aceite do Serviço (Contratante)**
1. Contratante revisa o trabalho
2. Contratante dá **ACEITE** (ou solicita ajustes)
3. Sistema registra aceite na tabela `project_deliveries`

### 4️⃣ **Repasse do Valor (Administrador)**
1. Sistema detecta aceite
2. Calcula valores:
   - **Taxa Kadesh**: 1% do valor total
   - **Valor Fornecedor**: 99% do valor total
3. Administrador faz repasse manual (via Mercado Pago, PIX, etc.)
4. Administrador marca repasse como concluído no painel

---

## 💰 Cálculo de Valores

### Exemplo: Projeto de R$ 1.000,00

```
Valor Total Pago pelo Contratante: R$ 1.000,00
├─ Taxa Kadesh (1%):               R$    10,00
└─ Repasse ao Fornecedor (99%):    R$   990,00
```

### Configuração da Taxa

- Configurável em `/admin/settings`
- Campo: `platform_fee_percentage`
- Valor padrão: **1.0** (1%)
- Pode ser alterado a qualquer momento

---

## 🗄️ Estrutura de Banco de Dados

### Tabela: `project_deliveries`

Registra entregas e aceites dos projetos:

```sql
CREATE TABLE project_deliveries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    provider_id BIGINT UNSIGNED NOT NULL,
    contractor_id BIGINT UNSIGNED NOT NULL,
    
    -- Entrega
    delivered_at TIMESTAMP NULL,
    delivery_notes TEXT,
    delivery_files JSON,  -- URLs de arquivos entregues
    
    -- Aceite
    accepted_at TIMESTAMP NULL,
    accepted_by BIGINT UNSIGNED NULL,
    acceptance_notes TEXT,
    
    -- Revisão/Ajustes
    revision_requested BOOLEAN DEFAULT FALSE,
    revision_notes TEXT,
    revision_requested_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_project (project_id),
    INDEX idx_provider (provider_id),
    INDEX idx_contractor (contractor_id),
    INDEX idx_accepted_at (accepted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Tabela: `transactions` (já existe)

Registra pagamentos e repasses:

```sql
-- Campos importantes:
- type: 'payment' (contratante paga), 'payout' (repasse ao fornecedor)
- status: 'pending', 'completed', 'failed', 'refunded'
- amount: valor em reais
- platform_fee: taxa da plataforma
- net_amount: valor líquido (amount - platform_fee)
- payment_method: 'credit_card', 'pix', 'boleto', etc.
- external_id: ID da transação no Mercado Pago
```

---

## 🎯 Funcionalidades por Perfil

### 👨‍💼 **CONTRATANTE**

#### Ao Aceitar Proposta:
- [ ] Ver resumo do pagamento (valor, taxa, total)
- [ ] Escolher método de pagamento (PIX, Cartão, Boleto)
- [ ] Realizar pagamento via Mercado Pago
- [ ] Receber confirmação de pagamento

#### Durante o Projeto:
- [ ] Acompanhar andamento
- [ ] Trocar mensagens com fornecedor
- [ ] Receber notificação quando fornecedor marcar como concluído

#### Ao Receber Entrega:
- [ ] Visualizar arquivos/trabalho entregue
- [ ] **DAR ACEITE** ou **SOLICITAR REVISÃO**
- [ ] Deixar avaliação após aceite

---

### 👨‍🔧 **FORNECEDOR**

#### Ao Ter Proposta Aceita:
- [ ] Receber notificação de projeto contratado
- [ ] Ver que pagamento foi realizado (valor em garantia)
- [ ] Iniciar execução do trabalho

#### Durante Execução:
- [ ] Atualizar progresso
- [ ] Trocar mensagens com contratante
- [ ] Fazer upload de arquivos/trabalho

#### Ao Concluir:
- [ ] Marcar projeto como concluído
- [ ] Aguardar aceite do contratante
- [ ] Ver status de "Aguardando Aceite"

#### Após Aceite:
- [ ] Ver status "Repasse Pendente"
- [ ] Aguardar repasse do administrador
- [ ] Receber notificação de repasse concluído

---

### 🛡️ **ADMINISTRADOR**

#### Painel de Pagamentos:
- [ ] Ver todos os pagamentos recebidos
- [ ] Ver repasses pendentes
- [ ] Ver repasses concluídos
- [ ] Filtrar por status, data, valor

#### Ao Receber Aceite:
- [ ] Ver notificação de aceite pendente
- [ ] Ver dados do fornecedor (PIX, banco, etc.)
- [ ] Calcular valor de repasse (99%)
- [ ] Marcar repasse como "Em Processamento"
- [ ] Fazer repasse manual (Mercado Pago, PIX, TED)
- [ ] Registrar comprovante de repasse
- [ ] Marcar repasse como "Concluído"

#### Configurações:
- [ ] Configurar chaves do Mercado Pago
- [ ] Ajustar taxa da plataforma (%)
- [ ] Ver relatórios financeiros

---

## 🔄 Status do Projeto

```
open → bid_accepted → payment_pending → payment_completed 
    → in_progress → delivered → accepted → payout_pending 
    → payout_completed → completed
```

### Novos Status Necessários:
- `payment_pending`: Aguardando pagamento do contratante
- `payment_completed`: Pagamento confirmado, projeto pode iniciar
- `delivered`: Fornecedor marcou como entregue
- `accepted`: Contratante deu aceite
- `payout_pending`: Aguardando repasse ao fornecedor
- `payout_completed`: Repasse concluído

---

## 📱 Notificações por Email

### Contratante:
- ✅ Pagamento confirmado
- ✅ Projeto iniciado
- ✅ Fornecedor marcou como concluído
- ✅ Lembrete para dar aceite

### Fornecedor:
- ✅ Projeto contratado (pagamento garantido)
- ✅ Aceite recebido
- ✅ Repasse processado
- ✅ Repasse concluído

### Administrador:
- ✅ Novo pagamento recebido
- ✅ Aceite pendente (precisa fazer repasse)
- ✅ Relatório diário de transações

---

## 🔐 Integração Mercado Pago

### Configuração (Admin):
1. Criar conta no Mercado Pago
2. Acessar [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel/app)
3. Criar aplicação
4. Copiar credenciais:
   - Public Key (TEST e PROD)
   - Access Token (TEST e PROD)
5. Configurar em `/admin/settings`

### Fluxo de Pagamento:
1. Frontend cria Preference no backend
2. Backend usa Access Token para criar pagamento
3. Frontend redireciona para checkout do Mercado Pago
4. Usuário paga
5. Mercado Pago envia webhook para `/api/webhooks/mercadopago`
6. Backend atualiza status da transação
7. Backend atualiza status do projeto

---

## 📂 Arquivos a Criar/Modificar

### Backend (PHP):
- [x] `handleAdminGetSettings()` - carregar configurações
- [x] `handleAdminUpdateSettings()` - salvar configurações
- [ ] `handleCreatePayment()` - criar pagamento
- [ ] `handlePaymentCallback()` - callback Mercado Pago
- [ ] `handleMarkDelivered()` - fornecedor marca como entregue
- [ ] `handleAcceptDelivery()` - contratante dá aceite
- [ ] `handleRequestRevision()` - contratante solicita revisão
- [ ] `handleProcessPayout()` - admin processa repasse
- [ ] `handleCompletePayout()` - admin confirma repasse

### Frontend (Vue):
- [ ] `PaymentCheckout.vue` - página de pagamento (já existe, melhorar)
- [ ] `ProjectDelivery.vue` - tela de entrega (fornecedor)
- [ ] `ProjectAcceptance.vue` - tela de aceite (contratante)
- [ ] `AdminPayouts.vue` - painel de repasses (admin)
- [ ] Componente de Status de Pagamento
- [ ] Notificações em tempo real

---

## ⏭️ Próximos Passos

1. ✅ Corrigir endpoint de configurações
2. ⏳ Criar tabela `project_deliveries`
3. ⏳ Implementar fluxo de pagamento no aceite de proposta
4. ⏳ Criar tela de entrega para fornecedor
5. ⏳ Criar tela de aceite para contratante
6. ⏳ Criar painel de repasses para admin
7. ⏳ Integrar Mercado Pago
8. ⏳ Implementar webhooks
9. ⏳ Criar sistema de notificações
10. ⏳ Testes completos

---

**Status Atual**: ✅ Configurações funcionando, pronto para implementar pagamentos!
