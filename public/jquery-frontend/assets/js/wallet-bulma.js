/**
 * Carteira com Bulma CSS
 */

// Carregar página da carteira
function loadWalletPage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <h1 class="title is-3">
                    <i class="fas fa-wallet has-text-primary"></i>
                    Minha Carteira
                </h1>
                
                <div class="columns">
                    <div class="column is-4">
                        <div class="box has-text-centered" style="background: var(--success-gradient); color: white;">
                            <p class="heading has-text-white">Saldo Disponível</p>
                            <p class="title is-1 has-text-white" id="walletBalanceMain">R$ 0,00</p>
                            <div class="buttons is-centered mt-4">
                                <button class="button is-light" id="btnDeposit">
                                    <span class="icon"><i class="fas fa-plus"></i></span>
                                    <span>Depositar</span>
                                </button>
                                <button class="button is-light" id="btnWithdraw">
                                    <span class="icon"><i class="fas fa-minus"></i></span>
                                    <span>Sacar</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="box">
                            <h3 class="title is-5">Resumo</h3>
                            <div class="content">
                                <p>
                                    <span class="icon has-text-info"><i class="fas fa-lock"></i></span>
                                    <strong>Em Garantia:</strong> R$ <span id="escrowAmount">0,00</span>
                                </p>
                                <p>
                                    <span class="icon has-text-success"><i class="fas fa-arrow-down"></i></span>
                                    <strong>Total Recebido:</strong> R$ <span id="totalReceived">0,00</span>
                                </p>
                                <p>
                                    <span class="icon has-text-danger"><i class="fas fa-arrow-up"></i></span>
                                    <strong>Total Enviado:</strong> R$ <span id="totalSent">0,00</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column is-8">
                        <div class="box">
                            <div class="level">
                                <div class="level-left">
                                    <h2 class="title is-4">Transações</h2>
                                </div>
                                <div class="level-right">
                                    <div class="field has-addons">
                                        <div class="control">
                                            <div class="select">
                                                <select id="filterTransactions">
                                                    <option value="all">Todas</option>
                                                    <option value="deposit">Depósitos</option>
                                                    <option value="withdraw">Saques</option>
                                                    <option value="escrow">Garantia</option>
                                                    <option value="payment">Pagamentos</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="transactionsList">
                                <div class="has-text-centered">
                                    <button class="button is-loading is-ghost is-large"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal de Depósito -->
        <div class="modal" id="depositModal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <span class="icon"><i class="fas fa-plus-circle"></i></span>
                        Depositar na Carteira
                    </p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Valor</label>
                        <div class="control has-icons-left">
                            <input class="input is-large" type="number" id="depositAmount" placeholder="0,00" min="10" step="0.01">
                            <span class="icon is-small is-left">
                                <i class="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                        <p class="help">Valor mínimo: R$ 10,00</p>
                    </div>
                    
                    <div class="field">
                        <label class="label">Método de Pagamento</label>
                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="payment_method" value="credit_card" checked>
                                <span class="icon"><i class="fas fa-credit-card"></i></span>
                                Cartão de Crédito
                            </label>
                            <br>
                            <label class="radio">
                                <input type="radio" name="payment_method" value="pix">
                                <span class="icon"><i class="fas fa-qrcode"></i></span>
                                PIX
                            </label>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" id="confirmDeposit">Confirmar Depósito</button>
                    <button class="button">Cancelar</button>
                </footer>
            </div>
        </div>

        <!-- Modal de Saque -->
        <div class="modal" id="withdrawModal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <span class="icon"><i class="fas fa-minus-circle"></i></span>
                        Sacar da Carteira
                    </p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Valor</label>
                        <div class="control has-icons-left">
                            <input class="input is-large" type="number" id="withdrawAmount" placeholder="0,00" min="10" step="0.01">
                            <span class="icon is-small is-left">
                                <i class="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                        <p class="help">Saldo disponível: R$ <span id="availableBalance">0,00</span></p>
                    </div>
                    
                    <div class="field">
                        <label class="label">Dados Bancários</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Banco" id="bankName">
                        </div>
                    </div>
                    
                    <div class="columns">
                        <div class="column">
                            <div class="field">
                                <div class="control">
                                    <input class="input" type="text" placeholder="Agência" id="bankAgency">
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <div class="control">
                                    <input class="input" type="text" placeholder="Conta" id="bankAccount">
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-warning" id="confirmWithdraw">Confirmar Saque</button>
                    <button class="button">Cancelar</button>
                </footer>
            </div>
        </div>
    `;
    
    $('#app').html(html);
    setupWalletListeners();
    loadWalletData();
}

// Configurar listeners da carteira
function setupWalletListeners() {
    // Botões de ação
    $('#btnDeposit').on('click', () => $('#depositModal').addClass('is-active'));
    $('#btnWithdraw').on('click', () => $('#withdrawModal').addClass('is-active'));
    
    // Confirmar depósito
    $('#confirmDeposit').on('click', handleDeposit);
    
    // Confirmar saque
    $('#confirmWithdraw').on('click', handleWithdraw);
    
    // Filtro de transações
    $('#filterTransactions').on('change', function() {
        filterTransactions($(this).val());
    });
}

// Carregar dados da carteira
function loadWalletData() {
    $.ajax({
        url: `${API_URL}/wallet/details`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(data) {
        $('#walletBalanceMain').text(`R$ ${parseFloat(data.balance).toFixed(2)}`);
        $('#escrowAmount').text(parseFloat(data.escrow_amount || 0).toFixed(2));
        $('#totalReceived').text(parseFloat(data.total_received || 0).toFixed(2));
        $('#totalSent').text(parseFloat(data.total_sent || 0).toFixed(2));
        $('#availableBalance').text(parseFloat(data.balance).toFixed(2));
        
        loadTransactions();
    });
}

// Carregar transações
function loadTransactions() {
    $.ajax({
        url: `${API_URL}/wallet/transactions`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(transactions) {
        displayTransactions(transactions);
    }).fail(function() {
        $('#transactionsList').html('<p class="has-text-danger">Erro ao carregar transações</p>');
    });
}

// Exibir transações
function displayTransactions(transactions) {
    if (transactions.length === 0) {
        $('#transactionsList').html('<p class="has-text-grey has-text-centered">Nenhuma transação ainda</p>');
        return;
    }
    
    let html = '<table class="table is-fullwidth is-hoverable">';
    html += '<thead><tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th><th>Status</th></tr></thead><tbody>';
    
    transactions.forEach(tx => {
        const typeIcons = {
            'deposit': '<span class="icon has-text-success"><i class="fas fa-arrow-down"></i></span>',
            'withdraw': '<span class="icon has-text-danger"><i class="fas fa-arrow-up"></i></span>',
            'escrow': '<span class="icon has-text-info"><i class="fas fa-lock"></i></span>',
            'payment': '<span class="icon has-text-primary"><i class="fas fa-exchange-alt"></i></span>'
        };
        
        const valueClass = tx.type === 'deposit' ? 'has-text-success' : 'has-text-danger';
        const valuePrefix = tx.type === 'deposit' ? '+' : '-';
        
        html += `
            <tr>
                <td>${formatDate(tx.created_at)}</td>
                <td>${typeIcons[tx.type] || ''} ${tx.type}</td>
                <td>${tx.description}</td>
                <td class="${valueClass}"><strong>${valuePrefix} R$ ${parseFloat(tx.amount).toFixed(2)}</strong></td>
                <td><span class="tag is-${tx.status === 'completed' ? 'success' : 'warning'}">${tx.status}</span></td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    $('#transactionsList').html(html);
}

// Filtrar transações
function filterTransactions(type) {
    if (type === 'all') {
        loadTransactions();
    } else {
        // TODO: Implementar filtro na API
        loadTransactions();
    }
}

// Handler de depósito
function handleDeposit() {
    const amount = parseFloat($('#depositAmount').val());
    const method = $('input[name="payment_method"]:checked').val();
    
    if (!amount || amount < 10) {
        showNotification('Valor mínimo é R$ 10,00', 'error');
        return;
    }
    
    $('#confirmDeposit').addClass('is-loading');
    
    $.ajax({
        url: `${API_URL}/wallet/deposit`,
        method: 'POST',
        data: { amount, payment_method: method },
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        showNotification('Depósito realizado com sucesso!', 'success');
        $('#depositModal').removeClass('is-active');
        $('#depositAmount').val('');
        loadWalletData();
        loadWalletBalance();
    }).fail(function(xhr) {
        showNotification(xhr.responseJSON?.error || 'Erro ao processar depósito', 'error');
    }).always(function() {
        $('#confirmDeposit').removeClass('is-loading');
    });
}

// Handler de saque
function handleWithdraw() {
    const amount = parseFloat($('#withdrawAmount').val());
    const bank = $('#bankName').val();
    const agency = $('#bankAgency').val();
    const account = $('#bankAccount').val();
    
    if (!amount || amount < 10) {
        showNotification('Valor mínimo é R$ 10,00', 'error');
        return;
    }
    
    if (!bank || !agency || !account) {
        showNotification('Preencha todos os dados bancários', 'error');
        return;
    }
    
    $('#confirmWithdraw').addClass('is-loading');
    
    $.ajax({
        url: `${API_URL}/wallet/withdraw`,
        method: 'POST',
        data: { amount, bank_name: bank, bank_agency: agency, bank_account: account },
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        showNotification('Saque solicitado com sucesso!', 'success');
        $('#withdrawModal').removeClass('is-active');
        $('#withdrawAmount, #bankName, #bankAgency, #bankAccount').val('');
        loadWalletData();
        loadWalletBalance();
    }).fail(function(xhr) {
        showNotification(xhr.responseJSON?.error || 'Erro ao processar saque', 'error');
    }).always(function() {
        $('#confirmWithdraw').removeClass('is-loading');
    });
}
