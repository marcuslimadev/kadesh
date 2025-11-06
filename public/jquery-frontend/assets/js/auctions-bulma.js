/**
 * Leilões com Bulma CSS
 */

// Carregar página de leilões
function loadAuctionsPage() {
    const html = `
        <section class="section">
            <div class="container">
                <h1 class="title is-3">
                    <i class="fas fa-gavel has-text-primary"></i>
                    Leilões Ativos
                </h1>
                <p class="subtitle">Participe dos leilões reversos e ofereça suas melhores propostas</p>

                <div class="columns is-multiline" id="auctionsList">
                    <div class="column is-12 has-text-centered">
                        <button class="button is-loading is-large is-ghost"></button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    loadActiveAuctions();
}

// Carregar leilões ativos
function loadActiveAuctions() {
    $.ajax({
        url: `${API_URL}/auctions/active`,
        method: 'GET'
    }).done(function(auctions) {
        if (auctions.length === 0) {
            $('#auctionsList').html(`
                <div class="column is-12">
                    <div class="notification is-info is-light has-text-centered">
                        <p class="is-size-4">
                            <span class="icon is-large"><i class="fas fa-2x fa-gavel"></i></span>
                        </p>
                        <p>Nenhum leilão ativo no momento</p>
                    </div>
                </div>
            `);
            return;
        }
        
        let html = '';
        auctions.forEach(auction => {
            html += createAuctionCard(auction);
        });
        $('#auctionsList').html(html);
        
        // Iniciar contadores regressivos
        startAuctionCountdowns();
    }).fail(function() {
        $('#auctionsList').html(`
            <div class="column is-12">
                <div class="notification is-danger">Erro ao carregar leilões</div>
            </div>
        `);
    });
}

// Criar card de leilão
function createAuctionCard(auction) {
    const endDate = new Date(auction.end_date);
    const now = new Date();
    const timeLeft = endDate - now;
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    
    return `
        <div class="column is-4">
            <div class="card animate__animated animate__fadeIn" data-auction-id="${auction.id}">
                <div class="card-content">
                    <div class="level is-mobile mb-3">
                        <div class="level-left">
                            <span class="project-badge badge-open">
                                <i class="fas fa-fire"></i> Leilão Ativo
                            </span>
                        </div>
                        <div class="level-right">
                            <span class="countdown" data-end="${auction.end_date}">
                                ${hoursLeft}h restantes
                            </span>
                        </div>
                    </div>
                    
                    <p class="title is-5">${auction.project_title}</p>
                    <p class="subtitle is-6 has-text-grey">${auction.project_description ? auction.project_description.substring(0, 80) + '...' : ''}</p>
                    
                    <div class="box has-background-light mb-3">
                        <div class="columns is-mobile is-multiline">
                            <div class="column is-6">
                                <p class="heading">Orçamento Máximo</p>
                                <p class="title is-6 has-text-success">R$ ${parseFloat(auction.max_budget).toFixed(2)}</p>
                            </div>
                            <div class="column is-6">
                                <p class="heading">Melhor Lance</p>
                                <p class="title is-6 has-text-primary">R$ ${auction.lowest_bid ? parseFloat(auction.lowest_bid).toFixed(2) : 'N/A'}</p>
                            </div>
                            <div class="column is-6">
                                <p class="heading">Propostas</p>
                                <p class="title is-6 has-text-info">${auction.bids_count || 0}</p>
                            </div>
                            <div class="column is-6">
                                <p class="heading">Tipo</p>
                                <p class="title is-6">${auction.auction_type === 'sealed' ? '🔒 Fechado' : '🔓 Aberto'}</p>
                            </div>
                        </div>
                    </div>

                    ${auction.auction_type === 'open' && auction.top_bids && auction.top_bids.length > 0 ? `
                        <div class="content">
                            <p class="has-text-weight-bold">Ranking:</p>
                            <ol class="auction-ranking">
                                ${auction.top_bids.map((bid, index) => `
                                    <li class="ranking-item ranking-${index + 1}">
                                        <span class="icon"><i class="fas fa-medal"></i></span>
                                        ${bid.provider_name} - R$ ${parseFloat(bid.amount).toFixed(2)}
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    ` : ''}
                </div>
                
                <footer class="card-footer">
                    <a href="#auction-details-${auction.id}" class="card-footer-item has-text-primary">
                        <span class="icon"><i class="fas fa-eye"></i></span>
                        <span>Ver Detalhes</span>
                    </a>
                    ${AppState.currentUser ? `
                        <a href="#bid-${auction.project_id}" class="card-footer-item has-text-success">
                            <span class="icon"><i class="fas fa-gavel"></i></span>
                            <span>Dar Lance</span>
                        </a>
                    ` : `
                        <a href="#login" class="card-footer-item has-text-grey">
                            <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                            <span>Login p/ Lance</span>
                        </a>
                    `}
                </footer>
            </div>
        </div>
    `;
}

// Iniciar contadores regressivos
function startAuctionCountdowns() {
    setInterval(() => {
        $('.countdown').each(function() {
            const endDate = new Date($(this).data('end'));
            const now = new Date();
            const timeLeft = endDate - now;
            
            if (timeLeft <= 0) {
                $(this).html('<span class="has-text-danger">Encerrado</span>');
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            let text = '';
            if (days > 0) text += `${days}d `;
            if (hours > 0) text += `${hours}h `;
            text += `${minutes}m`;
            
            $(this).html(`<i class="fas fa-clock"></i> ${text}`);
        });
    }, 60000); // Atualizar a cada minuto
}

// Dashboard com estatísticas
function loadDashboardPage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <h1 class="title is-3">
                    <i class="fas fa-chart-line has-text-primary"></i>
                    Dashboard
                </h1>
                <p class="subtitle">Visão geral das suas atividades</p>

                <div class="columns is-multiline">
                    <div class="column is-3">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-folder"></i>
                            </div>
                            <p class="title is-3" id="dashProjects">0</p>
                            <p class="subtitle is-6 has-text-grey">Projetos Criados</p>
                        </div>
                    </div>
                    
                    <div class="column is-3">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <p class="title is-3" id="dashBids">0</p>
                            <p class="subtitle is-6 has-text-grey">Propostas Feitas</p>
                        </div>
                    </div>
                    
                    <div class="column is-3">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <p class="title is-3" id="dashWins">0</p>
                            <p class="subtitle is-6 has-text-grey">Propostas Aceitas</p>
                        </div>
                    </div>
                    
                    <div class="column is-3">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <p class="title is-3" id="dashRating">0.0</p>
                            <p class="subtitle is-6 has-text-grey">Avaliação Média</p>
                        </div>
                    </div>
                </div>

                <div class="columns">
                    <div class="column is-8">
                        <div class="box">
                            <h2 class="title is-4">Atividade Recente</h2>
                            <div id="recentActivity">
                                <div class="has-text-centered">
                                    <button class="button is-loading is-ghost"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column is-4">
                        <div class="box">
                            <h2 class="title is-4">Carteira</h2>
                            <div class="has-text-centered mb-4">
                                <p class="heading">Saldo Disponível</p>
                                <p class="title is-2 has-text-success">R$ ${AppState.walletBalance.toFixed(2)}</p>
                            </div>
                            <a href="#wallet" class="button is-primary is-fullwidth">
                                <span class="icon"><i class="fas fa-wallet"></i></span>
                                <span>Gerenciar Carteira</span>
                            </a>
                        </div>
                        
                        <div class="box">
                            <h2 class="title is-4">Notificações</h2>
                            <div id="dashNotifications">
                                <p class="has-text-grey">Nenhuma notificação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    loadDashboardStats();
}

// Carregar estatísticas do dashboard
function loadDashboardStats() {
    $.ajax({
        url: `${API_URL}/dashboard/stats`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(stats) {
        $('#dashProjects').text(stats.projects_count || 0);
        $('#dashBids').text(stats.bids_count || 0);
        $('#dashWins').text(stats.wins_count || 0);
        $('#dashRating').text((stats.avg_rating || 0).toFixed(1));
        
        // Carregar atividade recente
        loadRecentActivity();
    }).fail(function() {
        showNotification('Erro ao carregar estatísticas', 'error');
    });
}

// Carregar atividade recente
function loadRecentActivity() {
    $.ajax({
        url: `${API_URL}/timeline/recent`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(events) {
        if (events.length === 0) {
            $('#recentActivity').html('<p class="has-text-grey has-text-centered">Nenhuma atividade recente</p>');
            return;
        }
        
        let html = '<div class="timeline">';
        events.forEach(event => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-marker is-icon is-primary">
                        <i class="fas fa-${getEventIcon(event.type)}"></i>
                    </div>
                    <div class="timeline-content">
                        <p class="heading">${formatDate(event.created_at)}</p>
                        <p>${event.description}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        $('#recentActivity').html(html);
    });
}

// Helper para ícone do evento
function getEventIcon(type) {
    const icons = {
        'project_created': 'folder-plus',
        'bid_placed': 'gavel',
        'bid_accepted': 'check-circle',
        'payment_sent': 'money-bill-wave',
        'review_received': 'star'
    };
    return icons[type] || 'info-circle';
}

// Helper para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Há alguns minutos';
    if (hours < 24) return `Há ${hours}h`;
    if (hours < 48) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR');
}
