# 📋 TODO - Sistema de Pagamento Kadesh

## ✅ CONCLUÍDO
- [x] Configurações do Admin funcionando
- [x] Tabela system_settings ajustada
- [x] Taxa da plataforma configurável (1%)
- [x] Tabela project_deliveries criada
- [x] Documentação completa

---

## 🔄 EM ANDAMENTO

### 1. Fluxo de Pagamento na Aceitação de Proposta
**Arquivo**: `src/views/ProjectShow.vue`

Quando contratante aceita uma proposta, deve:
- Mostrar tela de pagamento
- Calcular valor total + taxa
- Redirecionar para checkout Mercado Pago
- Aguardar confirmação de pagamento
- Mudar status para `payment_completed`

**Backend necessário**:
```php
function handleAcceptBid($bidId) {
    // 1. Verificar se proposta existe
    // 2. Verificar se usuário é o dono do projeto
    // 3. Criar registro de transação (status: pending)
    // 4. Criar preferência no Mercado Pago
    // 5. Retornar URL de pagamento
}
```

---

### 2. Integração Mercado Pago

**Backend**: `public/backend.php`

```php
function createMercadoPagoPreference($projectId, $bidId, $amount) {
    $settings = getSettings();
    $accessToken = $settings['payment']['mp_access_token_test']['value'];
    
    $preference = [
        'items' => [[
            'title' => 'Projeto #' . $projectId,
            'quantity' => 1,
            'unit_price' => (float)$amount
        ]],
        'back_urls' => [
            'success' => 'http://localhost/kadesh/payment/success',
            'failure' => 'http://localhost/kadesh/payment/failure',
            'pending' => 'http://localhost/kadesh/payment/pending'
        ],
        'auto_return' => 'approved',
        'external_reference' => 'PROJECT_' . $projectId . '_BID_' . $bidId
    ];
    
    // Chamar API do Mercado Pago
    // Retornar init_point
}

function handleMercadoPagoWebhook() {
    // Receber notificação do MP
    // Atualizar status da transação
    // Atualizar status do projeto
    // Enviar email de confirmação
}
```

---

### 3. Tela de Entrega (Fornecedor)

**Arquivo**: Criar `src/views/ProjectDelivery.vue`

Fornecedor pode:
- Fazer upload de arquivos
- Escrever notas de entrega
- Marcar projeto como "Entregue"
- Ver histórico de entregas/revisões

**Backend**:
```php
function handleMarkAsDelivered($projectId) {
    // 1. Verificar se usuário é o fornecedor do projeto
    // 2. Upload de arquivos (se houver)
    // 3. Criar registro em project_deliveries
    // 4. Mudar status do projeto para 'delivered'
    // 5. Notificar contratante
}
```

---

### 4. Tela de Aceite (Contratante)

**Arquivo**: Criar `src/views/ProjectAcceptance.vue`

Contratante pode:
- Ver arquivos entregues
- Dar ACEITE ou Solicitar REVISÃO
- Escrever notas de feedback

**Backend**:
```php
function handleAcceptDelivery($projectId) {
    // 1. Atualizar project_deliveries (accepted_at)
    // 2. Mudar status projeto para 'accepted'
    // 3. Criar registro de payout (transactions.type = 'payout', status = 'pending')
    // 4. Notificar fornecedor
    // 5. Notificar admin (repasse pendente)
}

function handleRequestRevision($projectId, $notes) {
    // 1. Atualizar project_deliveries (revision_requested = true)
    // 2. Mudar status projeto para 'in_progress'
    // 3. Notificar fornecedor
}
```

---

### 5. Painel de Repasses (Admin)

**Arquivo**: Melhorar `src/views/AdminPayments.vue`

Admin vê:
- Lista de repasses pendentes
- Dados do fornecedor (PIX, banco)
- Valor a repassar (99%)
- Botão "Processar Repasse"
- Botão "Confirmar Repasse"

**Backend**:
```php
function handleAdminGetPayouts() {
    // Buscar transactions com type='payout' e status='pending'
    // Incluir dados do fornecedor (nome, email, dados bancários)
    // Incluir dados do projeto
}

function handleAdminProcessPayout($transactionId) {
    // Atualizar status para 'processing'
    // Registrar admin que processou
}

function handleAdminCompletePayout($transactionId, $receiptData) {
    // Atualizar status para 'completed'
    // Salvar comprovante
    // Notificar fornecedor
    // Mudar status do projeto para 'completed'
}
```

---

### 6. Dados Bancários do Fornecedor

**Tabela users**: Adicionar campos

```sql
ALTER TABLE users ADD COLUMN bank_name VARCHAR(255);
ALTER TABLE users ADD COLUMN bank_account_type ENUM('checking', 'savings') DEFAULT 'checking';
ALTER TABLE users ADD COLUMN bank_account_number VARCHAR(50);
ALTER TABLE users ADD COLUMN bank_account_digit VARCHAR(5);
ALTER TABLE users ADD COLUMN bank_agency VARCHAR(20);
ALTER TABLE users ADD COLUMN pix_key VARCHAR(255);
ALTER TABLE users ADD COLUMN pix_key_type ENUM('cpf', 'cnpj', 'email', 'phone', 'random');
```

**Tela**: Adicionar em `ProviderProfile.vue`

---

### 7. Status do Projeto

Adicionar novos status em `projects.status`:

```sql
ALTER TABLE projects MODIFY COLUMN status ENUM(
    'open', 
    'bid_accepted', 
    'payment_pending', 
    'payment_completed', 
    'in_progress', 
    'delivered', 
    'accepted', 
    'payout_pending', 
    'payout_completed', 
    'completed', 
    'cancelled'
) DEFAULT 'open';
```

---

### 8. Sistema de Notificações

**Email**: Usar SMTP configurado em system_settings

Notificações necessárias:
- [  ] Pagamento confirmado (contratante)
- [ ] Projeto contratado (fornecedor)
- [ ] Projeto entregue (contratante)
- [ ] Aceite recebido (fornecedor)
- [ ] Repasse pendente (admin)
- [ ] Repasse concluído (fornecedor)
- [ ] Revisão solicitada (fornecedor)

---

### 9. Testes

- [ ] Testar fluxo completo de pagamento
- [ ] Testar webhook do Mercado Pago
- [ ] Testar repasse do admin
- [ ] Testar solicitação de revisão
- [ ] Testar cálculo de taxas
- [ ] Testar notificações por email

---

### 10. Melhorias Futuras

- [ ] Split payment (Mercado Pago divide automaticamente)
- [ ] Pagamento parcelado
- [ ] Boleto bancário
- [ ] Reembolso automático
- [ ] Escrow/Garantia (reter valor até aceite)
- [ ] Dashboard financeiro detalhado
- [ ] Exportar relatórios (Excel, PDF)

---

## 📞 COMO CONTINUAR

1. **Teste as configurações**: 
   - Acesse http://localhost/kadesh/admin/settings
   - Veja se carrega corretamente
   - Tente salvar uma configuração

2. **Próximo**: Implementar fluxo de pagamento na aceitação de proposta
   - Editar `ProjectShow.vue`
   - Criar função `handleAcceptBid` no backend
   - Integrar Mercado Pago

3. **Depois**: Criar telas de entrega e aceite

---

**Última atualização**: 17/10/2025
**Status**: ✅ Configurações funcionando, pronto para pagamentos
